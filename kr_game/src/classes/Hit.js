class Hit extends Entity{
    constructor(){
        super();
        this.name = 'hit';
        this.type = 'hit';
    }

    draw(ctx){
        spriteManager.drawSprite(ctx, this.type, this.direction, this.pos_x, this.pos_y, mapManager.view);
    }

    update(){
        physicManager.update(this);
    }
}