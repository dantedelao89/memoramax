import { GAME_MODE , GAME_TYPE} from "../helper/constants";
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
    gameName: cc.Label = null;

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

    setProperties(delegate, gameType, groupof){
        let keyString = "";
        switch(gameType){
            case GAME_TYPE.FIND:
                keyString = "find";
                break;
            case GAME_TYPE.MIRROR:
                keyString = "mirror";
                break;    
        }
        this.gameName.node.getComponent("localiser").key = keyString;
        console.log('keyString', keyString);
        this.gameName.node.getComponent("localiser").replaceValue(`${groupof}`);
        this._delegate = delegate;
        // console.log("key is", `instructionsFor${ keyString}${groupof}`, this.instraction.string);
        this.instraction.getComponent('localiser').key = `instructionsFor${ keyString}${groupof}`
        this.instraction.getComponent('localiser').setStringForKey();
    }


    onAccept(){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this._delegate.stopTutorials();

    }

  
    // update (dt) {}
}
