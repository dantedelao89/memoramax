import { GAME_MODE } from "../helper/constants";
import { GameManager } from "../managers/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Localiser extends cc.Component {
    private _replaceValue : string = "";
    @property({type :String, tooltip : "key of string that to be localise"})
    key = "";

    onLoad(){
        // console.log("on start", this.key);
        cc.game.on('onLanguageChanged', ()=>{
            // console.log("language has changed");
            this.setStringForKey();
        } )
        this.setStringForKey();
    }

    replaceValue(value){
        // console.log("value to replace", value,this.key);
        this._replaceValue = value;
    }

    setStringForKey(){
        // console.log("ke11y", this.key,  GameManager.getInstance().getString(this.key),this._replaceValue);
        this.node.getComponent(cc.Label).string = GameManager.getInstance().getString(this.key);
        if(this._replaceValue.length > 0){
            let tempString =  this.node.getComponent(cc.Label).string.replace("%s",this._replaceValue );
            this.node.getComponent(cc.Label).string = tempString;
        }  
    }
}