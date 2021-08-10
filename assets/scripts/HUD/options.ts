const {ccclass, property} = cc._decorator;

import {END_POP_UP, GAME_SCREEN} from "../helper/constants"
import { GameManager } from "../managers/GameManager";
@ccclass
export default class Options extends cc.Component {

    private _delegateScript : null;
  
    @property(cc.Label)
    timer: cc.Label = null;

    @property(cc.Label)
    gameMode: cc.Label = null;


    @property(cc.Label)
    hint: cc.Label = null;

    @property(cc.Label)
    clues: cc.Label = null;

    @property(cc.Button)
    clueButton: cc.Button = null;
  

    start () {

    }

    setDelegate (delegate) {
        this._delegateScript = delegate;
        this.updateHindText();
        
    }

    updateHindText(){
        let hintCount = cc.sys.localStorage.getItem("hint");
        this.hint.string = `${hintCount}`;

        let clueCount = cc.sys.localStorage.getItem("clue");
        this.clues.string = `${clueCount}`;

        this.clueButton.interactable = true;
    }

    setUpUI (screen : GAME_SCREEN, gameMode: string) {
        console.log("options", screen, gameMode);
        let mode = GameManager.getInstance().getString(gameMode);
        this.gameMode.string = mode;
        this.deactiveAllNodes();
       

        switch(screen){
            case GAME_SCREEN.HOME:
                // this.more.node.active = false;
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
        // this.more.node.active = false;
    }


    updateTimer(time, totalTime){
        let timeString = GameManager.getInstance().getString("time")
        timeString = timeString.replace("%s", "");
        this.timer.string = `${timeString}${time}/${totalTime}`;
    }


    onHint(){
        
        if(this._delegateScript.isTutorialPlaying()){
            return;
        }
        // add extra five time and update local storage 
        let hintCount = JSON.parse(cc.sys.localStorage.getItem("hint"));
        console.log("hint", hintCount);
        if(hintCount > 0 ){
            this._delegateScript.playBounsAnimation();
            cc.sys.localStorage.setItem("hint", hintCount-1);
            this.hint.string = `${hintCount-1}`;
        }else{
            this._delegateScript.showHintPopUP(END_POP_UP.FOR_HIT);
        }

    }

    onClue(){
        if(this._delegateScript.isTutorialPlaying()){
            return;
        }
        let clueCount = JSON.parse(cc.sys.localStorage.getItem("clue"));
        if(clueCount > 0 ){
            cc.sys.localStorage.setItem("clue", clueCount-1);
            this.clues.string = `${clueCount-1}`;
            this.clueButton.interactable = false;
            this._delegateScript.openPairCards();
            this.clueButton.node.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(()=>{
                this.clueButton.interactable = true;
            })));

        }else{
            this._delegateScript.showHintPopUP(END_POP_UP.FOR_CLUE);
        }

    }


  

    

  


   
    
  

    // update (dt) {}
}
