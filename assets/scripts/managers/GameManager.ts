import { GAME_MODE} from "../helper/constants";

 export class GameManager{
    private static  _instance = null;
    private _gameConfig = null;
    private _levelsData = null;
    private _levelImages = null;
    private _currentSelectLanguage = "EN"; 
    private _languageData = null;
    private _selectedMode = GAME_MODE.PRACTICE;
    private _currentLevel = 0;
    private placementId = null;

    static getInstance(){
        if(!GameManager._instance){
           GameManager. _instance = new GameManager();
        }
        return GameManager._instance;
    }

    setAdIds(idObj){
        this.placementId = idObj;
    }

    loadGameConfig() {
        var target = this;
        return new Promise((resolve,reject)=> {
            if(target._gameConfig) {
                resolve(target._gameConfig);
            }else {
                cc.resources.load("GameMode/gameConfig", function(error, level) {
                    if(error){
                        console.log("error while loading json");
                        reject(error)
                    }else {
                        target._gameConfig        =   level["json"];
                        // console.log("data loadded", target._gameConfig);
                        resolve(target._gameConfig);
                    }
                })
            }
        });
    }


    loadLevels (){
        var target = this;
        return new Promise((resolve,reject)=> {
            if(target._levelsData) {
                resolve(target._levelsData);
            }else {
                cc.resources.load("Levels/levels", function(error, level) {
                    if(error){
                        console.log("error while loading json");
                        reject(error)
                    }else {
                        target._levelsData        =   level["json"];
                        // console.log("data loadded", target._levelsData);
                        resolve(target._levelsData);
                    }
                })
            }
        });
    }


    loadLanaguge(){
        return new Promise((resolve, reject) => {
            if (this._languageData) {
                resolve(this._languageData);
            } else {
                cc.loader.loadResDir("Languages" , cc.JsonAsset, (err: Error, data: any) => {
                    if (err) {
                        reject(err);
                        cc.error("langauge data error :" + err);
                    }else{
                        this._languageData = data;
                        // console.log("langauge data", this._languageData);
                    }
                    resolve(data);
                });
            }
        });
    }

    // data is in form  ,this._levelImages = {level [images]}
    loadLevelImages( levelNo): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._levelImages && this._levelImages.mode && this._levelImages.mode.level[levelNo]) {
                resolve(this._levelImages.level[levelNo]);
            } else {
                cc.loader.loadResDir(`Levels/Images/LEVEL${levelNo + 1}` , cc.SpriteFrame, (err: Error, data: any) => {
                    if (err) {
                        reject(err);
                        cc.error("loadLevelImages :" + err);
                    }else{
                        if(!this._levelImages){
                            this._levelImages = {};
                            this._levelImages.level = [];
                        }
                    
                            this._levelImages.level[levelNo] = data;
                        
                        // console.log("level images", this._levelImages, data);
                    }
                    resolve(this._levelImages.level[levelNo]);
                });
            }
        });
    }

    getSpriteFrame(mode, levelNo, name) {
        if(this._levelImages){
            let images = this._levelImages.level[levelNo];
            // console.log("images",images );
            const spriteFrame = images.find(item => item.name == name);
            // console.log("spriteFrames",spriteFrame, name );
            return spriteFrame;
        }
        

    }

    public getGameConfiguration(){
        if(this._gameConfig){  
            return this._gameConfig;
        }
    }

    public getModesInfo () {
        if(this._gameConfig){
            return this._gameConfig["gameMode"];
        }

    }

    getModeInfo (modeName) {
        if(this._gameConfig){
            return this._gameConfig["gameMode"].find(mode => mode.key == modeName);
        }

    }

    getLevelInfo(levelMode : string){
        if(this._levelsData){
            return this._levelsData[levelMode]["levels"];
        }
    }

    getLevelData(levelNo: number, levelMode : string){
        if(this._levelsData){
            return this._levelsData[levelMode]["levels"][levelNo];
        }

    }

    isImagesLoaded () :boolean {
        return this._levelsData? true : false;
    }

    getString(key:string): string {
        if(this._languageData){
            let language = this._languageData.find(item => item.name == this._currentSelectLanguage);
            // console.log("key", key, language);
            return language.json[key];
        }else{
            return "";
        }
    }

    changeCurrentLanguage(){
       
        this._currentSelectLanguage = cc.sys.localStorage.getItem("Language");
        console.log("change current Language", this._currentSelectLanguage);

    }

    setGameMode(mode){
        this._selectedMode  = mode;
    }
    
    getSelectedMode(){
        return  this._selectedMode;
    }

    setCurrentLevel(level){
     this._currentLevel = level;
    }

    getCurrentLevel(){
        return this._currentLevel;
    }


    // Ads Managment 

    showBannerAd(){

        // console.log("show BAnner");
        //     let banner = new cc.Ads.Banner(this.placementId.BANNER,cc.Ads.BANNER_POSITION.ALIGN_PARENT_BOTTOM);
        //     // cc.Ads.AdSettings.addTestDevice("808a2024-66bb-4d52-9804-3c905991f2b3");
        //     banner.on("onAdLoaded", () => {
        //         cc.log("banner onAdLoaded");
        //         // this.status_tips.string = "banner loaded";
        //     }, this);
    
        //     banner.on("onError", (eCode) => {
        //         cc.log("banner onError");
        //     }, this);
    
        //     banner.on("onAdClicked", () => {
        //         cc.log("banner onAdClicked");
        //     }, this);

        //     banner.show().then(() => {
        //         cc.log("banner show-------");
        //     }).catch((e) => {
        //         cc.log("banner reject ", e);
        //     });
    }
    
    showInterstitalAds(){
        //    let  interstital = new cc.Ads.Interstitial(this.placementId.INTERSTITIAL);
        //     // this.interstital = new cc.Ads.Interstitial("1982508651779400_1982509301779335");
        //     interstital.on("onInterstitialDisplayed", () => {
        //         cc.log("interstital onInterstitialDisplayed");
        //         // this.status_tips.string = "onInterstitialDisplayed";
        //     });
    
        //     interstital.on("onInterstitialDismissed", () => {
        //         cc.log("interstital onInterstitialDismissed");
        //         // this.status_tips.string = "onInterstitialDismissed";
        //     });
    
        //     interstital.on("onAdClicked", () => {
        //         cc.log("interstital onAdClicked");
        //         // this.status_tips.string = "onAdClicked";
        //     });
    
        //     interstital.on("onError",(error)=>{
        //         // this.status_tips.string = "onError";
        //     });
    
        //     interstital.loadAd().then(() => {
        //         return interstital.show();
        //     }).catch((e) => {
        //         cc.log("interstital catch", e);
        //     });
     }
    
       
    



    
}