// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { GameManager } from "../managers/GameManager";
import { NetworkManager } from "../managers/NetworkManager";
import { API_END_POINTS, REQUEST_TYPE } from "../managers/NetworkConfig";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {


   start(){
    NetworkManager.getInstance().init();
    if(!cc.sys.localStorage.getItem("hasLaunchedBeforev2")){
        cc.sys.localStorage.clear();
          cc.sys.localStorage.setItem("hasLaunchedBeforev2", true)
      }
  
  
      if (!cc.sys.localStorage.getItem("Language")) {
        cc.sys.localStorage.setItem("Language", "ES");
      }  
  
      if(!cc.sys.localStorage.getItem("hasTermAccepted")){
        cc.sys.localStorage.setItem("hasTermAccepted", false);
      }
  
  
      if(!cc.sys.localStorage.getItem("lastPlayedLevel")){
        cc.sys.localStorage.setItem("lastPlayedLevel", 0);
      }
  
  
      if(!cc.sys.localStorage.getItem("hint")){
        cc.sys.localStorage.setItem("hint", 3);
      }


      if(!cc.sys.localStorage.getItem("clue")){
        cc.sys.localStorage.setItem("clue", 3);
      }


      if(!cc.sys.localStorage.getItem("rewardClaimDate")){
        cc.sys.localStorage.setItem("rewardClaimDate", new Date(98,1,1).toDateString());
      }

      cc.debug.setDisplayStats(false);
      

      console.log("isonline", cc.sys.getNetworkType());
      if (cc.sys.getNetworkType() == cc.sys.NetworkType.LAN || cc.sys.getNetworkType() == cc.sys.NetworkType.WWAN) {
        NetworkManager.getInstance().sendRequest(API_END_POINTS.GET_TIME, 
          REQUEST_TYPE.GET, {},
          (data, error) => {
            if(data) {
              let parseData = JSON.parse(data);
              let date = parseData.currentDateTime;
              let day = date.split("T")[0];
              GameManager.getInstance().setCurrentDate(day);
            }
            console.log("isonline data", data);
            this.startLoading();
          },
          (error, data) =>{
            console.log("isonline error", error, data);
            GameManager.getInstance().setCurrentDate( cc.sys.localStorage.getItem("rewardClaimDate"));
            this.startLoading();
          },true);
      }else{
        console.log("new network saving local time");
        GameManager.getInstance().setCurrentDate( cc.sys.localStorage.getItem("rewardClaimDate"));
        this.startLoading();
      }
    
     
   }

   startLoading(){
    GameManager.getInstance().loadGameConfig()
    .then(()=>  GameManager.getInstance().loadLevels())
    .then(()=> GameManager.getInstance().loadLanaguge())
    .then(()=>{
      GameManager.getInstance().changeCurrentLanguage();
      return GameManager.getInstance().loadLevelImages(JSON.parse(cc.sys.localStorage.getItem("lastPlayedLevel")));
    })
    .then(() => {console.log("Data has been loaded")
      cc.director.loadScene('home');
    })
    .catch((error)=> console.error("Error while loading resources", error));
   }


   
}
