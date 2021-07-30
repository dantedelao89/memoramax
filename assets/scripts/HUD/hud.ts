import { GAME_SCREEN } from "../helper/constants";
import SoundManager from "../managers/SoundManager";
import { GameManager } from "../managers/GameManager";



const {ccclass, property} = cc._decorator;

@ccclass
export default class HUD extends cc.Component {

    @property(cc.SpriteFrame)
    volumeUp : cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    volumeDown : cc.SpriteFrame = null;

    @property(cc.Button)
    volume: cc.Button = null;

    @property(cc.Label)
    selectMode: cc.Label = null;

    @property(cc.Button)
    back: cc.Button = null;

    @property(cc.Button)
    setting: cc.Button = null;

    @property(cc.Button)
    level: cc.Button = null;

    @property(cc.AudioClip)
    backButtonAudio : cc.AudioClip = null;

    @property(cc.AudioClip)
    buttonAudio : cc.AudioClip = null;


    private delegate;


    start(){
        this.updateVolumeIcon();
    }
    setDelegate (delegate) {
        console.log("delegate", delegate);
        this.delegate = delegate;
    }

    onBack(){
        SoundManager.getInstance().playEffect(this.backButtonAudio, false);
        this.delegate.onBack();
    }


    changeVolume(event : Event){
        if(JSON.parse(cc.sys.localStorage.getItem("Sound"))){
            SoundManager.getInstance().stopAllSounds();
            cc.sys.localStorage.setItem("Sound", false);      
        }else{
            //  SoundManager.getInstance().playMusic(true);
             cc.sys.localStorage.setItem("Sound", true)
             
        }

        this.updateVolumeIcon();
        
    }

    setVisiblity(gameScreen : GAME_SCREEN){
        this.volume.node.active = true;
        this.setting.node.active = true;
        this.level.node.active = true;
    }

    updateVolumeIcon(){
        let sprite = this.volume.node.getChildByName("Background").getComponent(cc.Sprite);
        sprite.spriteFrame = JSON.parse(cc.sys.localStorage.getItem("Sound")) ? this.volumeUp: this.volumeDown;
    }

    onSetting(){
        SoundManager.getInstance().playEffect(this.buttonAudio, false);
        this.delegate.openSettings();

    }

    onLevelSelection(){
        SoundManager.getInstance().playEffect(this.buttonAudio, false);
        this.delegate.showLevelSelection();
    }



}
