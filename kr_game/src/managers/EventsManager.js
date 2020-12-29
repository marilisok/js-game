class EventsManager {
    constructor(){
        this.bind = [];
        this.action = [];
    }

    setup(canvas){
        this.bind[38] = 'up'; // arrow up
        this.bind[37] = 'left'; // arrow left
        this.bind[40] = 'down'; // arrow down
        this.bind[39] = 'right'; // arrow right
        this.bind[32] = 'fire'; // space

        //контроль событий мыши
        canvas.addEventListener('mousedown', this.onMouseDown());
        canvas.addEventListener('mouseup', this.onMouseUp());

        //контроль событий клавиатуры
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }

    onKeyDown(event){
        let action = eventsManager.bind[event.keyCode];
        if(action){
            eventsManager.action[action] = true;
        }
    }

    onKeyUp(event){
        let action = eventsManager.bind[event.keyCode];
        if(action){
            eventsManager.action[action] = false;
        }
    }

    onMouseDown(event){
        eventsManager.action['fire'] = true;
    }

    onMouseUp(event){
        eventsManager.action['fire'] = false;
    }

}