// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import {GameManager}  from '../managers/GameManager'

const {ccclass, property} = cc._decorator;


@ccclass
export default class DailyRewards extends cc.Component {
    
    @property(cc.Label)
    giftLabel: cc.Label = null;

    @property(cc.Node)
    wrappedNode: cc.Node = null;

    @property(cc.Node)
    claimNode: cc.Node = null;

    delgateScript = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setDelegate(delegate){
        this.delgateScript = delegate;
    }

    onRewardPicked(){
        this.wrappedNode.active = false;
        this.claimNode.active = true;
        this.giftLabel.string = `+ ${5}`;   
    }

    onAccept(){
        let  hintCount = JSON.parse(cc.sys.localStorage.getItem("hint"));
        hintCount +=5; // for now will add new once done
        cc.sys.localStorage.setItem("hint", JSON.stringify(hintCount));
        cc.sys.localStorage.setItem("rewardClaimDate", GameManager.getInstance().getCurrentDate());
        // open last played level
        this.delgateScript.onRewardCollected()
        this.node.active = false;
    }
    // update (dt) {}
}
