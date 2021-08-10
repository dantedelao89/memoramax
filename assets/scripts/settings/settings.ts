// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SoundManager from "../managers/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Settings extends cc.Component {

    @property(cc.Node)
    languagePopUp: cc.Node = null;



    @property(cc.AudioClip)
    buttonPressed: cc.AudioClip = null;


    delegatScript = null;

    start () {

    }

    
    init(delegate){
        this.delegatScript = delegate;
    }


    openLocalisationPopUp(){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
         this.languagePopUp.active = true;
    }


    openTermAndConditions(){
        this.delegatScript.openTermAndConditions();
    }


    openPrivacyPolicy(){

        this.delegatScript.openPrivacyPolicy();

    }

    onShare(){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this.delegatScript.onShare();
    }

    closeAllPopUps(){
        this.languagePopUp.active = false;
    }








    // update (dt) {}
}
