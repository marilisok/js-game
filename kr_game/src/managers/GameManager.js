class GameManager {
    constructor(){
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;// идентификатор выстрела
        this.player = null;
        this.laterKill = [];
        this.curLevel = 1;
        this.levelCount = 2;
    }

    initPlayer(obj){
        this.player = obj;
    }

    kill(obj){
        if (obj.type === 'fire'){
            let hit = new Hit();
            hit.pos_x = obj.pos_x + obj.move_x * (obj.size_x / 6);
            hit.pos_y = obj.pos_y + obj.move_y * (obj.size_y / 6);
            this.entities.push(hit);
        }
        this.laterKill.push(obj);
    }

    draw(ctx){
        if (!mapManager.entitiesParsed){
            setTimeout(() => {
                this.draw(ctx);
            }, 100);
        }else{
            for (let i = 0; i < this.entities.length; i++) {
                this.entities[i].draw(ctx);
                if (this.entities[i].type === 'hit'){
                    this.kill(this.entities[i]);
                }
            }
        }
    }

    update(){
        if (this.player === null)
            return;

        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action['up']) {
            this.player.move_y = -1;
            this.player.direction = 'up';
        }
        if (eventsManager.action['down']) {
            this.player.move_y = 1;
            this.player.direction = 'down';
        }
        if (eventsManager.action['left']) {
            this.player.move_x = -1;
            this.player.direction = 'left';
        }
        if (eventsManager.action['right']) {
            this.player.move_x = 1;
            this.player.direction = 'right';
        }
        if (eventsManager.action['fire'])
            this.player.fire();

        this.entities.forEach((e) => {
            try{
                e.update();
            }
            catch (ex) {
                console.log(ex);
            }
        });

        //удаление всех объектов попавших в laterKill
        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                if (this.entities[idx].type === 'player') {
                    soundManager.play("./public/sounds/dead.mp3", {looping: false, volume: 0.1});
                    setTimeout(() => { this.end(); }, 1000);
                }
                if (this.entities[idx].type === 'orc') {
                    soundManager.play("./public/sounds/great.mp3", {looping: false, volume: 0.1});
                    this.player.score += 100;
                }
                if (this.entities[idx].type === 'bonus') {
                    soundManager.play("./public/sounds/spell1_0.mp3", {looping: false, volume: 0.1});
                }
                this.entities.splice(idx, 1);
            }
        }

        if (this.laterKill.length > 0)//очитстка массива laterKill
            this.laterKill.length = 0;

        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        mapManager.draw(ctx);

        this.draw(ctx);
        document.getElementById('health').innerHTML = `Здоровье: ${this.player.lifetime}`;
        document.getElementById('score').innerHTML = `Счёт: ${this.player.score}`;
    }

    mute(){
        if (document.getElementById('muteButton').innerHTML === 'Выкл звук'){
            document.getElementById('muteButton').innerHTML = 'Вкл звук';
        }
        else{
            document.getElementById('muteButton').innerHTML = 'Выкл звук';
        }
        soundManager.toggleMute();
    }

    play(){
        setInterval(updateWorld, 50);
    }

    loadAll(ctx, canvas){
        soundManager.init();
        soundManager.loadArray(['./public/sounds/main_sound.mp3', './public/sounds/spell1_0.mp3', './public/sounds/whoosh2.mp3', './public/sounds/dead.mp3', './public/sounds/great.mp3']);

        mapManager.loadMap('./public/maps/map1.json');
        spriteManager.loadAtlas('./public/atlas/atlas.json', './public/atlas/spritesheet.png');

        soundManager.play("./public/sounds/main_sound.mp3", {looping: true, volume: 0.1});


        this.factory['player'] = new Player();
        this.factory['orc'] = new Orc();
        this.factory['fire'] = new Fire();
        this.factory['bonus'] = new Bonus();
        mapManager.parseEntities();
        mapManager.draw(ctx);
        this.draw(ctx);
        eventsManager.setup(canvas);
    }

    nextLevel(){
        let score = this.player.score;
        let lifetime = this.player.lifetime;
        this.entities.length = 0;
        physicManager.isLevelLoading = false;
        mapManager = new MapManager(mapManager.view.w, mapManager.view.h);
        mapManager.loadMap(`./public/maps/map${this.curLevel}.json`);
        mapManager.parseEntities();
        this.setPlayerAttributes(score, lifetime);
    }

    setPlayerAttributes(score, lifetime){
        if (!mapManager.entitiesParsed){
            setTimeout(() => {
                this.setPlayerAttributes(score, lifetime);
            }, 10)
        }
        else{
            this.player.score = score;
            this.player.lifetime = lifetime;
        }
    }

    end(){
        let name = localStorage.getItem('username');
        let highscore = localStorage.getItem('highscores');
        localStorage["score"] = this.player.score;
        let table;
        if(highscore) {
            table = JSON.parse(localStorage.getItem('highscores'));
        } else {
            table = [];
        }
        let element = [name, this.player.score];
        table.push(element);
        localStorage.setItem('highscores', JSON.stringify(table));
        window.location = 'records.html';
    }
}