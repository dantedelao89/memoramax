// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import {GAME_SCREEN} from "../helper/constants"
import { GameManager } from "../managers/GameManager";
@ccclass
export default class Options extends cc.Component {

    private _delegateScript : null;
  
    @property(cc.Label)
    timer: cc.Label = null;

    @property(cc.Label)
    gameMode: cc.Label = null;


    @property(cc.Button)
    more: cc.Button = null;



    start () {

    }

    setDelegate (delegate) {
        this._delegateScript = delegate;
    }

    setUpUI (screen : GAME_SCREEN, gameMode: string) {
        console.log("options", screen, gameMode);
    
        let mode = GameManager.getInstance().getString(gameMode);
        this.gameMode.string = mode;
        this.deactiveAllNodes();

        switch(screen){
            case GAME_SCREEN.MODE_SELECTION:
                this.more.node.active = true;
                break;
            case GAME_SCREEN.LEVEL_SELECTION:
             
                break;
             case GAME_SCREEN.GAME_PLAY:
                this.timer.node.active = true;
                this.gameMode.node.active = true;
                 break;
        }
    }

    deactiveAllNodes (){
        this.timer.node.active = false;
        this.gameMode.node.active = false;
        this.more.node.active = false;
    }


    updateTimer(time, totalTime){
        let timeString = GameManager.getInstance().getString("time")
        timeString = timeString.replace("%s", "");
        this.timer.string = `${timeString}${time}/${totalTime}`;
    }


    openModeMenu(){
        this._delegateScript.openMoreInfoPopUp();

    }


    

  


   
    
  

    // update (dt) {}
}
