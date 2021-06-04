// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameManager } from "../managers/GameManager";

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
        this.title.node.getComponent("localiser").replaceValue(`${(startIndex/10) + 1}`)
        this.title.node.getComponent("localiser").setStringForKey();
        this.layout.node.removeAllChildren();
        let mode = GameManager.getInstance().getSelectedMode();
        let levels = GameManager.getInstance().getLevelInfo(mode);
        let levelsInfo = JSON.parse(cc.sys.localStorage.getItem("LevelInfo"));
        let levelsInfoForMode = JSON.parse(levelsInfo[mode]);
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

    onLevelSelect(event: Event, level: string){
        this._delagate.onLevelSelect(level);
    }


    openLocalisation(){
        this._delagate.openLocalisationPopUp();
    }

    // update (dt) {}
}
