// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private _delagateScript : null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    
    setDelegatScript(delegate){
        this._delagateScript =delegate;
    }

    onAccept(){
        this.node.active = false;
        this._delagateScript.onBack(); 
        
    }

    

    // update (dt) {}
}
