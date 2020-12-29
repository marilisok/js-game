class Fire extends Entity{
    constructor(){
        super();
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 10;
    }

    draw(ctx){
        spriteManager.drawSprite(ctx, this.type, this.direction, this.pos_x, this.pos_y, mapManager.view);
    }

    update(){
        physicManager.update(this);
    }

    onTouchEntity(obj) {
        if (obj.name.match(/orc[\d*]/) || obj.name.match(/fire[\d*]/)) {
            return 'object killed'
        }
        if (obj.type === 'player'){
            return 'player hurted';
        }
        if (obj.type !== 'bonus')
            return 'fire used';
    }

    onTouchMap(){
        gameManager.kill(this);
    }
}