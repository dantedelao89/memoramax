const { ccclass, property } = cc._decorator;

@ccclass
export default class AdManager extends cc.Component {

    delegate : null;

    private static _instance : AdManager = null!;
    public static getInstance(){
        if(!AdManager._instance){
            AdManager._instance = new AdManager();
        }
        return AdManager._instance;
    }


    public init(){  
      sdkbox.PluginAdMob.init();
      sdkbox.PluginAdMob.setListener(this);
      let target = this;
      sdkbox.PluginAdMob.setListener({
        adViewDidReceiveAd: function(name) {
            console.log("add has been loaded", name)
            // if(name == 'banner'){
            //     target.showBanner();
            // }
        },
        adViewDidFailToReceiveAdWithError: function(name, msg) {
            // target.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
        },
        adViewWillPresentScreen: function(name) {
            console.log("adViewWillPresentScreen game ", name)
        },
        adViewDidDismissScreen: function(name) {
            console.log("adViewDidDismissScreen game ", name)
            target.delegate.adHasbeenShown();
            // target.showInfo('adViewDidDismissScreen name=' + name);
        },
        adViewWillDismissScreen: function(name) {
            console.log("back game ", name)
            // target.showInfo('adViewWillDismissScreen=' + name);
        },
        adViewWillLeaveApplication: function(name) {
            console.log("adViewWillLeaveApplication game ", name)
        }
    });

    }
    public cacheAds(adName){
        sdkbox.PluginAdMob.cache(adName);
    }

    public setTestDevice(device :string){
        sdkbox.PluginAdMob.setTestDevices(device);
    }

    public showBanner(){
        console.log("show banner ads");
       if(sdkbox.PluginAdMob.isAvailable('banner')){
        sdkbox.PluginAdMob.show('banner');
        console.log("show banner ads");
       }else{
        console.log("not avilable banner ads");
        sdkbox.PluginAdMob.cache('banner');
       } 
    }

    public showInterstital(inforeToNode){
        this.delegate = inforeToNode;
        if(sdkbox.PluginAdMob.isAvailable('gameover')){
            sdkbox.PluginAdMob.show('gameover');
              return true;
           }else{
               console.log("chacheing add");
               sdkbox.PluginAdMob.cache('gameover');
               return false;
           } 
       
    }

    public isAdAvailable(){
        if(sdkbox.PluginAdMob.isAvailable('gameover')){
            return true;
        }else{
            sdkbox.PluginAdMob.cache('gameover');
            return false;
        }
    }
}
