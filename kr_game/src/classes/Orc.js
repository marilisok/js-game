class Orc extends Entity{
    constructor(){
        super();
        this.lifetime = 100;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 2;
        this.fireInterval = 1500;
        this.canFire = true;
    }

    draw(ctx){
        spriteManager.drawSprite(ctx, this.type, this.direction, this.pos_x, this.pos_y, mapManager.view);
    }

    update(){
        physicManager.update(this);
    }

    onTouchMap(obj){
        if(this.direction === 'left'){
            this.direction = 'right';
            this.move_x = 1;
            this.move_y = 0;
        }else if(this.direction === 'right'){
            this.direction = 'left';
            this.move_x = -1;
            this.move_y = 0;
        }else if(this.direction === 'down'){
            this.direction = 'up';
            this.move_x = 0;
            this.move_y = -1;
        }else if(this.direction === 'up'){
            this.direction = 'down';
            this.move_x = 0;
            this.move_y = 1;
        }
    }

    fire(){
        if(!this.canFire)
            return;
        let fire = Object.create(gameManager.factory['fire']);
        //задание размеров создаваемому объекту
        fire.size_x = this.size_x;
        fire.size_y = this.size_y;
        fire.name = 'fire' + (++gameManager.fireNum);//счетчик выстрелов
        fire.type = 'fire';

        switch (this.direction) {
            case 'left':
                fire.pos_x = this.pos_x - fire.size_x;
                fire.pos_y = this.pos_y;
                fire.direction = 'left';
                fire.move_x = -1;
                break;
            case 'up':
                fire.pos_x = this.pos_x;
                fire.pos_y = this.pos_y - fire.size_y;
                fire.direction = 'up';
                fire.move_y = -1;
                break;
            case 'right':
                fire.pos_x = this.pos_x + fire.size_x;
                fire.pos_y = this.pos_y;
                fire.direction = 'right';
                fire.move_x = 1;
                break;
            case 'down':
                fire.pos_x = this.pos_x;
                fire.pos_y = this.pos_y + fire.size_y;
                fire.direction = 'down';
                fire.move_y = 1;
                break;
            default:
                return;

        }
        gameManager.entities.push(fire);

        this.canFire = false;
        setTimeout(() => {
            this.canFire = true;
        }, this.fireInterval);
        soundManager.play("./public/sounds/whoosh2.mp3", {looping: false, volume: 0.1});
    }
}