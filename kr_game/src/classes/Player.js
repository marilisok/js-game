class Player extends Entity{

    constructor(props){
        super(props);
        this.lifetime = 1000000;
        this.score = 0;
        this.canFire = true;
        //направление игрока
        this.move_x = 0;
        this.move_y = 0;
        this.fireInterval = 1000;
        this.speed = 4;
    }

    draw(ctx){
        spriteManager.drawSprite(ctx, this.type, this.direction, this.pos_x, this.pos_y, mapManager.view);
    }

    update(){
        physicManager.update(this);
    }

    onTouchEntity(obj){
        if(obj.name.match(/bonus[\d]/)){
            this.lifetime += 50;
            this.score += 50;
            gameManager.kill(obj);
        }
    }

    getDamage(){
        this.lifetime -= 50;
        this.score -= 50;
        if(this.lifetime <= 0){
           gameManager.kill(this);
        }
    }

    onTouchMap(obj){
        if (obj === 280 || obj === 281){
            soundManager.play("./public/sounds/spell1_0.mp3", {looping: false, volume: 0.1});
            return 'next';
        }
        //объект для второго уровня!!!
        if (obj === 193){
            soundManager.play("./public/sounds/spell1_0.mp3", {looping: false, volume: 0.1});
            setTimeout(() => { gameManager.end(); }, 1000);
        }
    }

    fire(){
        if (!this.canFire)
            return;

        let fb = Object.create(gameManager.factory['fire']);
        fb.size_x = this.size_x;
        fb.size_y = this.size_y;
        fb.name = 'fire' + (++gameManager.fireNum);
        fb.type = 'fire';
        switch (this.direction) {
            case 'left':
                fb.pos_x = this.pos_x - fb.size_x;
                fb.pos_y = this.pos_y;
                fb.direction = 'left';
                fb.move_x = -1;
                break;
            case 'right':
                fb.pos_x = this.pos_x + fb.size_x;
                fb.pos_y = this.pos_y;
                fb.direction = 'right';
                fb.move_x = 1;
                break;
            case 'up':
                fb.pos_x = this.pos_x;
                fb.pos_y = this.pos_y - fb.size_y;
                fb.direction = 'up';
                fb.move_y = -1;
                break;
            case 'down':
                fb.pos_x = this.pos_x;
                fb.pos_y = this.pos_y + fb.size_y;
                fb.direction = 'down';
                fb.move_y = 1;
                break;
            default:
                return;
        }
        gameManager.entities.push(fb);

        this.canFire = false;
        setTimeout(() => {
            this.canFire = true;
        }, this.fireInterval);

        soundManager.play("./public/sounds/whoosh2.mp3", {looping: false, volume: 0.1});
    }
}