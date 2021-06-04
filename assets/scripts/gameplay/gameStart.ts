import { GAME_MODE } from "../helper/constants";
import { GameManager } from "../managers/GameManager";
import SoundManager from "../managers/SoundManager";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {


    private _delegate = null;
    @property(cc.Label)
    timer: cc.Label = null;

    @property(cc.Label)
    prize: cc.Label = null;

    @property(cc.Label)
    instraction : cc.Label = null;

    @property(cc.Button)
    accept : cc.Button = null


    @property(cc.AudioClip)
    buttonPressed : cc.AudioClip = null;

    start () {

    }

    setProperties(delegate, gameMode, timerTitle, memoriseTime, bouns ){
        console.log("set properties",timerTitle ,gameMode );
        this._delegate = delegate;
        switch(gameMode){
            case GAME_MODE.PRACTICE:
                this.prize.node.active = false;
                break;
            default :
            this.prize.node.active = true;    
        }

      
        this.timer.getComponent('localiser').replaceValue(`${timerTitle}`);
        this.instraction.getComponent('localiser').replaceValue(`${memoriseTime}`);
        this.prize.getComponent('localiser').replaceValue(`${bouns}`);

        // // this.timer.string = `TIME : ${timerTitle}`;

        // let timerString  =  this.instraction.string.replace("%s", memoriseTime);
        // this.instraction.string = timerString;
    }


    onAccept(){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this._delegate.startGame();

    }

  
    // update (dt) {}
}
