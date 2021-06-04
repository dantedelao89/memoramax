export default class SoundManager{
    private static instance :   SoundManager; 
   
    _musicClip : cc.AudioClip = null;
    static getInstance() : SoundManager {
        if(!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    init(musicClip){
        this._musicClip = musicClip;
    }

    playMusic(loop:boolean){
        console.log("play music", this._musicClip);
         cc.audioEngine.playMusic(this._musicClip, loop);
         cc.audioEngine.setMusicVolume(0.6);
         
    }
    
    stopMusic(){
        cc.audioEngine.stopMusic();
    
    }

    playEffect(clipName, loop){
        console.log("play clip",cc.sys.localStorage.getItem("Sound"));
        if(JSON.parse(cc.sys.localStorage.getItem("Sound"))){
            var audioNo = cc.audioEngine.play(clipName, loop,1)
            return audioNo;
             
        }
       
    }

    stopAllSounds(){
        cc.audioEngine.stopAllEffects();
       
    }  

}