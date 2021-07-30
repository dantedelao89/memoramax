// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameManager } from "../managers/GameManager";
import { GAME_TYPE } from "../helper/constants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelUIManager extends cc.Component {

    _delagate : null;
    @property(cc.Prefab)
    levelSelectionButton : cc.Prefab = null;

    @property(cc.SpriteFrame)
    unlocked : cc.Prefab = null;

    @property(cc.SpriteFrame)
    locked : cc.Prefab = null;


    @property(cc.Layout)
    layout : cc.Layout = null;

    @property(cc.Label)
    title : cc.Label = null;

    // onLoad () {}

    start () {

    }

    setDelegateComponent(delgate){
        this._delagate =  delgate;
    }


    populateLevels(startIndex){
        let levelInfo = GameManager.getInstance().getLevelData(startIndex);
 
        console.log("level info", levelInfo);
        this.setLeveltitle(levelInfo.gameType, levelInfo.groupOf)



        this.layout.node.removeAllChildren();
        let levels = GameManager.getInstance().getLevelInfo();
        let levelsInfo = JSON.parse(cc.sys.localStorage.getItem("LevelInfo"));
        let levelsInfoForMode = JSON.parse(levelsInfo.level);
        let endIndex = (startIndex + 10) > levels.length ? levels.length : (startIndex +10);
        for (let i = startIndex; i < endIndex; i++) {
            let button = cc.instantiate(this.levelSelectionButton);
            button.getChildByName("Background").getChildByName("title")
            .getComponent(cc.Label).getComponent("localiser").replaceValue(`${i+1}`);
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "levelUIManager";
            clickEventHandler.handler = "onLevelSelect";
            clickEventHandler.customEventData = i.toString();
            button.getComponent(cc.Button).clickEvents.push(clickEventHandler);
            if(levelsInfoForMode[i].isUnlock){
                button.getChildByName("Background").getComponent("cc.Sprite").spriteFrame = this.unlocked;
                button.getChildByName("lock").active = false;
                button.getComponent(cc.Button).interactable = true;
            }else{
                button.getChildByName("Background").getComponent("cc.Sprite").spriteFrame = this.locked;
                button.getChildByName("lock").active = true;
                button.getComponent(cc.Button).interactable = false;
            }
            this.layout.node.addChild(button);
          }
    }


    setLeveltitle(gameType, groupof){

        let keyString = "";

        switch(gameType){
            case GAME_TYPE.FIND:
                keyString = "find";
                break;
            case GAME_TYPE.MIRROR:
                keyString = "mirror";
                break;    
        }
        this.title.node.getComponent("localiser").key = keyString;
        console.log('keyString', keyString);
        this.title.node.getComponent("localiser").replaceValue(`${groupof}`);
        this.title.node.getComponent("localiser").setStringForKey();
    }

    onLevelSelect(event: Event, level: string){
        this._delagate.onLevelSelect(level);
    }


    openLocalisation(){
        this._delagate.openLocalisationPopUp();
    }

    // update (dt) {}
}
