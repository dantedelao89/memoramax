import { GAME_MODE, END_POP_UP } from "../helper/constants";
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
export default class GameEnd extends cc.Component {


    private _delegate = null;
    @property(cc.Label)
    header: cc.Label = null;

    @property(cc.Label)
    level: cc.Label = null;

    @property(cc.Label)
    remarks : cc.Label = null;

    @property(cc.Label)
    mode : cc.Label = null

    @property(cc.Button)
    accept : cc.Button = null

    @property(cc.Node)
    newRecord : cc.Node = null;

    @property(cc.Node)
    timesUp : cc.Node = null;



    @property(cc.Node)
    passed : cc.Node = null;

    @property(cc.AudioClip)
    buttonPressed : cc.AudioClip = null;


    start () {

    }

    setProperties(delegate, gameMode ){
        this._delegate = delegate;
        // this.mode = gameMode.toUpper();
    }



    onAccept(){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this._delegate.gameEnded();

    }

    onPlayAgain (){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this._delegate.onPlayAgain();
    }

    onCancel(){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this._delegate.onPlayAgainCancel();
    }

    showPopUpFor(type : END_POP_UP, level){
        this.level.node.getComponent("localiser").replaceValue(`${level+1}`);
        this.level.node.getComponent("localiser").setStringForKey();

        let currentMode  = GameManager.getInstance().getSelectedMode();
        console.log("current mode", currentMode);
        this.mode.string = GameManager.getInstance().getString(currentMode);

        this.newRecord.active = false;
        this.timesUp.active = false;
        this.passed.active = false;
        switch(type){
            case END_POP_UP.CLEARD: 
            this.passed.active = true;
                break;
            case END_POP_UP.FAILED:
                this.timesUp.active = true;
                break;
            case END_POP_UP.NEW_RECORD:
                this.newRecord.active = true;
                break;        
        }

    }

  
    // update (dt) {}
}
