class PhysicManager{
    constructor(){
        this.isLevelLoading = false;
    }

    update(obj){
        //скорости движения нулевые
        if (obj.move_x === 0 && obj.move_y === 0)
            return 'stop';

        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        let ts = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2);
        let e = this.entityAtXY(obj, newX, newY);

        if(e !== null && obj.onTouchEntity){//если есть конфликт
            //разбор конфликта
            let res = obj.onTouchEntity(e);
            if (res === 'object killed'){
                gameManager.kill(e);
                gameManager.kill(obj);
            }
            if (res === 'player hurted'){
                e.getDamage();
                gameManager.kill(obj);
            }
            if (res === 'fire used'){
                gameManager.kill(obj);
            }
        }

        if (ts !== 1 && ts !== 421 && ts !== 505 && obj.onTouchMap) {//есть препятсвие 1-газон 421 - огород 505-дорога
            let res = obj.onTouchMap(ts);
            if(res === 'next' && !this.isLevelLoading && (++gameManager.curLevel) <= gameManager.levelCount){
                this.isLevelLoading = true;
                setTimeout(()=>{gameManager.nextLevel()}, 1000);
            }
        }

        if(obj.type === 'orc'){
            let flagFindPlayer = false;

            for(let i = 0; !flagFindPlayer && i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++){
                let leftX = obj.pos_x + Math.floor(obj.move_x * obj.speed) - i * mapManager.tSize.x;
                let leftY = obj.pos_y;
                let e = this.entityAtXY(obj, leftX, leftY);

                let ts = mapManager.getTilesetIdx(leftX + obj.size_x/2, leftY + obj.size_y/2);
                if (ts !== 1 && ts !== 421 && ts !== 505){
                    break;
                }

                if (e) {
                    if (e.type === 'player') {
                        flagFindPlayer = true;
                        obj.direction = 'left';
                        obj.move_y *= 0;
                        obj.move_x = -1;
                        break;
                    }
                }
            }

            for(let i = 0; !flagFindPlayer && i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++){
                let rightX = obj.pos_x + Math.floor(obj.move_x * obj.speed) + i * mapManager.tSize.x;
                let rightY = obj.pos_y;
                let e = this.entityAtXY(obj, rightX, rightY);

                let ts = mapManager.getTilesetIdx(rightX + obj.size_x/2, rightY + obj.size_y/2);
                if (ts !== 1 && ts !== 421 && ts !== 505){
                    break;
                }

                if (e) {
                    if (e.type === 'player') {
                        flagFindPlayer = true;
                        obj.direction = 'right';
                        obj.move_y *= 0;
                        obj.move_x = +1;
                        break;
                    }
                }
            }

            for (let i = 0; !flagFindPlayer && i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++) {
                let downX = obj.pos_x;
                let downY = obj.pos_y + Math.floor(obj.move_y * obj.speed) + i * mapManager.tSize.y;
                let e = this.entityAtXY(obj, downX, downY);

                let ts = mapManager.getTilesetIdx(downX + obj.size_x/2, downY + obj.size_y/2);
                if (ts !== 1 && ts !== 421 && ts !== 505){
                    break;
                }

                if (e) {
                    if (e.type === 'player') {
                        flagFindPlayer = true;
                        obj.direction = 'down';
                        obj.move_y = (+1);
                        obj.move_x *= 0;
                        break;
                    }
                }
            }

            for (let i = 0; !flagFindPlayer && i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++) {
                let upX = obj.pos_x;
                let upY = obj.pos_y + Math.floor(obj.move_y * obj.speed) - i * mapManager.tSize.y;
                let e = this.entityAtXY(obj, upX, upY);

                let ts = mapManager.getTilesetIdx(upX + obj.size_x/2, upY + obj.size_y/2);
                if (ts !== 1 && ts !== 421 && ts !== 505){
                    break;
                }

                if (e) {
                    if (e.type === 'player') {
                        flagFindPlayer = true;
                        obj.direction = 'up';
                        obj.move_y = (-1);
                        obj.move_x *= 0;
                        break;
                    }
                }
            }


            for (let i = 0; i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++) {
                let nextX = obj.pos_x + Math.floor(obj.move_x * obj.speed) + i * mapManager.tSize.x * obj.move_x;
                let nextY = obj.pos_y + Math.floor(obj.move_y * obj.speed) + i * mapManager.tSize.y * obj.move_y;
                let e = this.entityAtXY(obj, nextX, nextY);

                let ts = mapManager.getTilesetIdx(nextX + obj.size_x/2, nextY + obj.size_y/2);
                if (ts !== 1 && ts !== 421 && ts !== 505){
                    break;
                }

                if (e) {
                    if (e.type === 'player') {
                        flagFindPlayer = false;
                        obj.fire();
                        return;
                    }
                }
            }
        }

        // if (obj.type === 'orc') {
        //     for (let i = 0; i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++) {
        //         let behindX = obj.pos_x + Math.floor(obj.move_x * obj.speed) + i * mapManager.tSize.x * obj.move_x * (-1);
        //         let behindY = obj.pos_y + Math.floor(obj.move_y * obj.speed) + i * mapManager.tSize.y * obj.move_y * (-1);
        //         let e = this.entityAtXY(obj, behindX, behindY);
        //
        //         let ts = mapManager.getTilesetIdx(behindX + obj.size_x/2, behindY + obj.size_y/2);
        //         if (ts !== 1 && ts !== 421 && ts !== 505){
        //             break;
        //         }
        //
        //         if (e) {
        //             if (e.type === 'player') {
        //                 if (obj.direction === 'left')
        //                     obj.direction = 'right';
        //                 else if (obj.direction === 'right')
        //                     obj.direction = 'left';
        //                 else if (obj.direction === 'up')
        //                     obj.direction = 'down';
        //                 else if (obj.direction === 'down')
        //                     obj.direction = 'up';
        //
        //                 obj.move_y *= (-1);
        //                 obj.move_x *= (-1);
        //                 return;
        //             }
        //         }
        //     }
        //
        //     for (let i = 0; i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++) {
        //         let leftX = obj.pos_x + Math.floor(obj.move_x * obj.speed) - i * mapManager.tSize.x;
        //         let leftY = obj.pos_y;
        //         let e = this.entityAtXY(obj, leftX, leftY);
        //
        //         let ts = mapManager.getTilesetIdx(leftX + obj.size_x/2, leftY + obj.size_y/2);
        //         if (ts !== 1 && ts !== 421 && ts !== 505){
        //             break;
        //         }
        //
        //         if (e) {
        //             if (e.type === 'player') {
        //                 if (obj.direction === 'up') {
        //                     obj.direction = 'left';
        //
        //                     obj.move_y *= (0);
        //                     obj.move_x = -1;
        //                 }
        //
        //                 break;
        //             }
        //         }
        //     }
        //
        //     for (let i = 0; i < Math.floor(mapManager.view.h / mapManager.tSize.y) / 2; i++) {
        //         let nextX = obj.pos_x + Math.floor(obj.move_x * obj.speed) + i * mapManager.tSize.x * obj.move_x;
        //         let nextY = obj.pos_y + Math.floor(obj.move_y * obj.speed) + i * mapManager.tSize.y * obj.move_y;
        //         let e = this.entityAtXY(obj, nextX, nextY);
        //
        //         let ts = mapManager.getTilesetIdx(nextX + obj.size_x/2, nextY + obj.size_y/2);
        //         if (ts !== 1 && ts !== 421 && ts !== 505){
        //             break;
        //         }
        //
        //         if (e) {
        //             if (e.type === 'player') {
        //                 obj.fire();
        //                 return;
        //             }
        //         }
        //     }
        // }


        if((ts === 1 || ts === 421 || ts === 505) && (e === null || e.type === 'bonus')){
            obj.pos_x = newX;
            obj.pos_y = newY;
        }else{
            return 'break';
        }

        return 'move';
    }

    entityAtXY(obj, x, y){
        for (let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i];
            if (e.name !== obj.name) {
                //пересекаются ли obj и e
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y)
                    continue;
                return e;
            }
        }
        return null;
    }
}