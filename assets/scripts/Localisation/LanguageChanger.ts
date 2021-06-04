

import {LANGUAGES} from "../helper/constants"
import { GameManager } from "../managers/GameManager";
import SoundManager from "../managers/SoundManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class LangueChanger extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.AudioClip)
    buttonPressed: cc.Node = null;
    
    start () {

    }

    onLanguageChange(Event : Event, selected){
        SoundManager.getInstance().playEffect(this.buttonPressed, false);
        console.log("slected languaue", selected, LANGUAGES[selected], LANGUAGES[selected]);
        cc.sys.localStorage.setItem("Language", LANGUAGES[selected]);
        GameManager.getInstance().changeCurrentLanguage();
        cc.game.emit("onLanguageChanged");
        this.node.active = false;
      }

    // update (dt) {}
}
