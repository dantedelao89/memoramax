import {GameManager} from "../managers/GameManager";
import SoundManager from "../managers/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    private _cardName : string = "";
    private _isOpen : boolean = true;
    private _delagateScript : cc.Component = null;

    @property(cc.Sprite)
    image: cc.Sprite = null;

    @property(cc.Node)
    animationNode: cc.Node = null;


    @property(cc.Sprite)
    back: cc.Sprite = null;

    @property(cc.Sprite)
    front: cc.Sprite = null;

    @property(cc.AudioClip)
    cardFlip: cc.Node = null;


  





    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setDelegate(delegate:cc.Component){
        this._delagateScript = delegate;
    }

    setUpUI (spriteFrameKey, level, mode) {
        this._cardName = spriteFrameKey;
        console.log("card name", spriteFrameKey);
        this.image.spriteFrame= GameManager.getInstance().getSpriteFrame(mode, level, spriteFrameKey);
    }


    startAnimation(){

    }

    getCardName(){
        return this._cardName;
    }

    onCardClicked(){
        // console.log("showcards");
        if(!this._isOpen){
            this._delagateScript.showCard(this.node);
        }
      
        // this.reveal();
    }


   setFaceUp(showFace: boolean): void {
        this.back.node.active = !showFace;
        this._isOpen = showFace;
    }

    reveal( ): void {
        if(this._isOpen){
            return;
        }

        SoundManager.getInstance().playEffect(this.cardFlip,false);
        let callFunc1 = cc.callFunc(function () {
            this.setFaceUp(true);
        }, this);
        let callFunc2 = cc.callFunc(function () {
            // callFunc();
        }, this);
        let initialScale = 1;
        // console.log("initialScale", initialScale);
        let revealAction = cc.sequence(cc.scaleTo(0.1, 0, this.node.scale), callFunc1, cc.scaleTo(0.1, initialScale, initialScale));
        this.animationNode.runAction(revealAction);
    }


    unreveal ( ) {
        // console.log("un reveal animation");
        let callFunc1 = cc.callFunc(function () {
            this.setFaceUp(false);
        }, this);
        let unrevealAction = cc.sequence(cc.scaleTo(0.1, 0, 1), callFunc1, cc.scaleTo(0.1, 1, 1));
        this.animationNode.runAction(unrevealAction);
    }

    playCorrectAnimation(){
        let bounce = cc.scaleTo(0.1, 0.9,0.9).easing(cc.easeBounceInOut());
        let correctAnimation = cc.sequence(bounce, cc.delayTime(0.2), cc.scaleTo(0.1, 1, 1));
        this.animationNode.runAction(correctAnimation);
    }

    // update (dt) {}
}
