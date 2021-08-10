// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameManager } from "../managers/GameManager";
import SoundManager from "../managers/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PrivacyPolicy extends cc.Component {

    @property(cc.Label)
    pLabel: cc.Label = null;


    @property(cc.Label)
    layout: cc.Label = null;


    @property(cc.Label)
    header: cc.Label = null;

    isTerm :boolean =  false;

    stringArray: string[] = [];
    
  @property(cc.AudioClip)
  buttonPressed: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        console.log("on load is called");
    }

    start () {
        console.log("on start called");
    }

    onEnable(){
       
    }




    onBack(){
        this.node.active = false;
    }


     setTerm(loader){
        this.isTerm = true;
        this.header.string = GameManager.getInstance().getString("termAndConditions")
        this.stringArray= GameManager.getInstance().getString("terms");
        this.addRemainingLabel()
       

     }

     
     setPrivacy(loader){
         this.header.string = GameManager.getInstance().getString("privacyPolicyTitle")
        this.isTerm = false;
        this.stringArray= GameManager.getInstance().getString("privacyInformation");
        this.addRemainingLabel()
     }



     addRemainingLabel(){
        this.pLabel.string = this.stringArray.reduce((a,b) => a+b, "");
        console.log("sreting", this.stringArray);
     }


    onBackAnimationEnd(){
        console.log("called");
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        this.node.active = false;    
    }

    openLink (){
       let url =  this.isTerm ? "https://docs.google.com/document/d/12RJd81VYPFEyNzqEyg1g5EmGlJGAxenEiC3ls-mltVQ/edit":
        "https://docs.google.com/document/d/1cE961cfk3GJ70BfWmswVd5Spl_70XduWoZTMP9jvizk/edit#heading=h.4ox8fqtrw08x"
        cc.sys.openURL(url);
    }
}
