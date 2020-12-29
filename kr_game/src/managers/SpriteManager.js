class SpriteManager{
    constructor(){
        this.image = new Image();
        this.sprites = [];
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }
    loadAtlas(atlasJson, atlasImg){
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200)
                spriteManager.parseAtlas(request.responseText);
        };
        request.open('GET', atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    }

    parseAtlas(atlasJSON){
        let atlas = JSON.parse(atlasJSON);
        for(let name in atlas.frames){
            let frame = atlas.frames[name].frame;
            this.sprites.push({name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
        }
        this.jsonLoaded = true;
    }

    loadImg(atlasImg){
        this.image.onload = () => {
            spriteManager.imgLoaded = true;
        };
        this.image.src = atlasImg;
    }

    drawSprite(ctx, name, direction, x, y, view){
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.drawSprite(ctx, name, direction, x, y, view);
            }, 100);
        }else{
            let sprite;

            if (name === 'fire' || name === 'bonus' || name === 'hit') {
                sprite = this.getSprite(`${name}`);
            }
            else {
                sprite = this.getSprite(`${name}_${direction}`);
            }

            if(!mapManager.isVisible(x, y, sprite.w, sprite.h, view)) // виден ли спрайт на экране или нет
                return;

            x -= view.x;
            y -= view.y;
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        }
    }

    getSprite(name){
        for (let i = 0; i < this.sprites.length; i++) {
            let s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null;
    }
}