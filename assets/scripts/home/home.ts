import { GameManager } from "../managers/GameManager";
import { GAME_MODE, GAME_SCREEN, GAME_LINK } from "../helper/constants";
import SoundManager from "../managers/SoundManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
  gameScreen: GAME_SCREEN = GAME_SCREEN.MODE_SELECTION;
  hudLayer: cc.Node;
  gameMode: string = "";
  opitonLayer: cc.Node;

  futureDetails : cc.Node;

  @property(cc.Prefab)
  gameModeBtn: cc.Prefab = null;

  @property(cc.Layout)
  modeLayout: cc.Layout = null;

  @property(cc.Prefab)
  options: cc.Prefab = null;

  @property(cc.Prefab)
  hud: cc.Prefab = null;

  @property(cc.Node)
  howToPlayPopUp: cc.Node = null;

  @property(cc.Node)
  languagePopUp: cc.Node = null;

  @property(cc.Node)
  modeSelectionNode: cc.Node = null;

  @property(cc.Node)
  levelSelectionNode: cc.Node = null;

  @property(cc.Node)
  gameplayNode: cc.Node = null;

  @property(cc.Layout)
  scrollViewLayout: cc.Layout = null;

  @property(cc.Prefab)
  levelHolderPrefab: cc.Prefab = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.AudioClip)
  musicClip: cc.AudioClip = null;

  @property(cc.Node)
  moreInfo: cc.Node = null;


  @property(cc.Node)
  privacyPolicy: cc.Node = null;

  @property(cc.AudioClip)
  buttonPressed: cc.Node = null;

  @property(cc.Node)
  bottomBar: cc.Node = null;

  @property(cc.Prefab)
  futureDetailsPrefab: cc.Prefab = null;


  onLoad() {

    if (!cc.sys.localStorage.getItem("Language")) {
      cc.sys.localStorage.setItem("Language", "ES");
    }  
  }
  start() {

    this.languagePopUp.zIndex = 7;
    this.howToPlayPopUp.zIndex =7;
    this.moreInfo.zIndex =7;
    this.privacyPolicy.zIndex = 7;
    var animationClips =  this.gameplayNode.getComponent(cc.Animation)
    // console.log("animation clips",animationClips );
    // animationClips.on('finished', this.onLevelAnimationCompleted, this);

    GameManager.getInstance()
    .loadGameConfig()
    .then((data) => {
      console.log("data loded successfully", data);
      GameManager.getInstance()
        .loadLevels()
        .then((data) => {
          GameManager.getInstance().loadLanaguge().then((data)=>{
            GameManager.getInstance().changeCurrentLanguage();
            cc.game.emit("onLanguageChanged");
            this.setupUI();
            this.setLevelInfoInLS();
          }).catch((error)=>{
            console.log("error", error);
          })
         
        })
        .catch((error) => {
          console.log("erorr", error);
        });
    })
    .catch((error) => {
      console.log("error while loading resources");
    });


    // GameManager.getInstance().showBannerAd();
    cc.debug.setDisplayStats(false);
      SoundManager.getInstance().init(this.musicClip);
    if (!cc.sys.localStorage.getItem("Sound")) {
      cc.sys.localStorage.setItem("Sound", false);
    } 


    if(cc.sys.isMobile){
      console.log("inside this event handel");
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (ev) => {
        console.log("inSide this 120  line number", ev.keyCode);
        if (ev.keyCode === cc.macro.KEY.back) {
           this.onBack();
        }
      })
    }

  }

  setupUI() {

    this.setupModes();
    this.setOptions();
    this.setHud();
    this.modeSelectionNode.zIndex = 5;
    this.futureDetails = cc.instantiate(this.futureDetailsPrefab);
    this.futureDetails.zIndex = 6;
    this.futureDetails.active = false;
    this.futureDetails.getComponent("gameFutureDetails").setDelegatScript(this);
    this.node.addChild( this.futureDetails)
  

    // MARK: SHOWING BANNER ADS
    this.node.getComponent("FacebookAudiance").showBanner();
    if(cc.sys.isMobile){
      sdkbox.PluginShare.init();
    }
    
    

    // this.gameplayNode.zIndex = 5;
    // this.levelSelectionNode.zIndex =5;
  }

  onAnimationEnd (){
    console.log("animation ended");
  }

  setupModes() {
    let spaceingY = [150, 70, 30, 20, 10];
    let modes = GameManager.getInstance().getModesInfo();
    console.log("modes", modes);
    this.modeLayout.spacingY = spaceingY[modes.length - 1];
    for (let mode of modes) {
      let button = cc.instantiate(this.gameModeBtn);
      
      button.getChildByName("title").getComponent(cc.Label).string = mode.title;
      button.getChildByName("title").getComponent("localiser").key = mode.key;
      let clickEventHandler = new cc.Component.EventHandler();
      clickEventHandler.target = this.node;
      clickEventHandler.component = "home";
      clickEventHandler.handler = "onModeSelect";
      clickEventHandler.customEventData = mode.key;
      console.log("button has been created",mode.key );
      button.getComponent(cc.Button).clickEvents.push(clickEventHandler);
      this.modeLayout.node.addChild(button);
    }
  }

  setOptions() {
    this.opitonLayer = cc.instantiate(this.options);
    this.opitonLayer
    .getComponent("options").setDelegate(this);
    this.opitonLayer
      .getComponent("options")
      .setUpUI(this.gameScreen, this.gameMode);
    this.node.addChild(this.opitonLayer);
    this.opitonLayer.zIndex = 5;
  }

  setHud() {
    this.hudLayer = cc.instantiate(this.hud);
    this.node.addChild(this.hudLayer);
    this.hudLayer.getComponent("hud").setDelegate(this);
    this.hudLayer.zIndex = 1;
    this.hudLayer.getComponent("hud").setVisiblity(this.gameScreen);
  }

  onModeSelect(event: Event, mode: string) {
    console.log("mode", mode);
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    GameManager.getInstance().setGameMode(mode);
    console.log("onMode selectons", event, mode);
    this.modeSelectionNode.active = false;
  
    this.gameMode = mode;
    this.showLevelSelection();
  }



  showLevelSelection(){
    this.levelSelectionNode.active = true;  
    this.setLevelSelectionScreen(this.gameMode);
    this.gameScreen = GAME_SCREEN.LEVEL_SELECTION;
    this.upadteHuds();
    this.enabledMoreGamesButton(  GameManager.getInstance().getGameConfiguration().isMoreGameAvilable);
    // this.levelSelectionNode.getComponent(cc.Animation).play("moveIn");
 
  }

  //button callbacks:
  showHowToPlayPopUp() {
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    this.howToPlayPopUp.active = true;
    this.howToPlayPopUp.getChildByName("Post").getComponent(cc.Animation).play();
  }

  removeHowToPlayPopUp() {
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    this.howToPlayPopUp.active = false;
  }

  setLevelSelectionScreen(mode: string) {
    let levels = GameManager.getInstance().getLevelInfo(mode);
    this.scrollViewLayout.node.removeAllChildren();

    let totalFrame = Math.ceil(levels.length / 10);
    for(let i = 0; i <  totalFrame; i++){
      let levelHolder = cc.instantiate(this.levelHolderPrefab);
      levelHolder.getComponent("levelUIManager").setDelegateComponent(this);
      levelHolder.getComponent("levelUIManager").populateLevels(i * 10);
      this.scrollViewLayout.node.addChild(levelHolder);
    }

    if(totalFrame == 1){
      this.scrollViewLayout.node.children[0].width = 1000;
      this.scrollViewLayout.node.getComponent(cc.Widget).isAlignHorizontalCenter = true;
      this.scrollViewLayout.getComponent(cc.Widget).updateAlignment();
      this.scrollViewLayout.updateLayout();
    }else{
      this.scrollViewLayout.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
      this.scrollViewLayout.getComponent(cc.Widget).updateAlignment();
    }

    let levelsInfo = JSON.parse(cc.sys.localStorage.getItem("LevelInfo"));
    let levelsInfoForMode = JSON.parse(levelsInfo[mode]);

    let lastUnlockedLevel = 0;
    for(let item of levelsInfoForMode){
      if(!item.isUnlock){
        break;
      }
      lastUnlockedLevel++;
    }


    // move scrollView to last played frame;
    let frame = Math.ceil(lastUnlockedLevel/10);
    let offset = this.scrollView.getScrollOffset();
    let offsetPercent = (frame - 1) * (1 / (this.scrollViewLayout.node.childrenCount - 1));
    // this.currentPageIndexInScrollview = pageNo;
    // this.scrollView.scrollToPercentHorizontal(offsetPercent,0.01, false);     
    this.levelSelectionNode.getComponent(cc.Animation).play("moveIn");

  }

  onBack() {
    
     if (this.gameScreen == GAME_SCREEN.LEVEL_SELECTION ) {
        // this.levelSelectionNode.getComponent(cc.Animation).play("moveOut"); EaseBounces
        this.levelSelectionNode.active = false;
        this.modeSelectionNode.active = true;
        this.gameScreen = GAME_SCREEN.MODE_SELECTION;
        this.upadteHuds();
      } else if(this.gameScreen == GAME_SCREEN.GAME_PLAY){
        this.gameplayNode.active = false;
        this.levelSelectionNode.active = true;
        this.setLevelSelectionScreen(this.gameMode);
        this.modeSelectionNode.active = false;
        this.gameScreen = GAME_SCREEN.LEVEL_SELECTION;
        this.upadteHuds(); 
      }else{
        cc.game.end()
      }

  }

  upadteHuds() {
    this.opitonLayer
      .getComponent("options")
      .setUpUI(this.gameScreen, this.gameMode);
    this.hudLayer.getComponent("hud").setVisiblity(this.gameScreen);
  }

  onLevelSelect( level: string) {
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    GameManager.getInstance().setCurrentLevel(parseInt(level));
    this.gameScreen = GAME_SCREEN.GAME_PLAY;
    this.levelSelectionNode.active = false;
    this.modeSelectionNode.active = false
    this.gameplayNode.active = true;
    this.gameplayNode
    .getComponent("gamePlay")
    .setUpUI( GameManager.getInstance().getCurrentLevel(), this.gameMode, this.opitonLayer);
    // let anim =  this.gameplayNode.getComponent(cc.Animation).play("gameMoveIn");
    this.upadteHuds();
  }


  onLevelAnimationCompleted(){
    if(this.gameScreen == GAME_SCREEN.GAME_PLAY){
   
    }
  }

  /**
   * 
   * 
   * data is stored in this mannor in the local storage
   * LevelInfo = {
   * "practice" :[{time :100, isUnlock : true} , ... ]  
   * "normal" :[{time :100, isUnlock : true} , ... ]  
   *  * }
   * 
   */

  setLevelInfoInLS(){


    if (!cc.sys.localStorage.getItem("LevelInfo")) {
      cc.sys.localStorage.setItem("LevelInfo", JSON.stringify({}));
    }

    let levelInfo = JSON.parse(cc.sys.localStorage.getItem("LevelInfo"));
    
    let modes = GameManager.getInstance().getModesInfo();
    console.log("inside ti",modes );
    for (let mode of modes) {
    
        let totalLevels = GameManager.getInstance().getLevelInfo(mode.key).length;
        let levelObj = {time :500, isUnlock : false}
       if(!levelInfo[mode.key]) {
        let levelObjectArray =[];
        for(let i = 0; i< totalLevels; i++){
          levelObjectArray[i] = Object.assign({id: i}, levelObj);
        }
         levelObjectArray[0].isUnlock = true;
         console.log(levelObjectArray[0]===levelObjectArray[1]);
         levelInfo[mode.key] = JSON.stringify(levelObjectArray); 
       }else{

        // New Level added in the json file
         let levelArray = JSON.parse(levelInfo[mode.key]);
         if(levelArray.length < totalLevels){
          let difference = GameManager.getInstance().getLevelInfo(mode.key).filter(item => ! levelArray.some(data => data.id == item.id));
          let timeArray = [];
          for(let i =0; i< difference.length; i++){
           timeArray[i] = Object.assign({id :difference[i].id }, levelObj);
          }
          console.log("time ArraY", timeArray);
          levelArray.push(...timeArray);
          console.log("time ArraY", levelArray);
          
        }else{
          // OLD Level removed from the json file
          let difference = levelArray.filter(item => ! GameManager.getInstance().getLevelInfo(mode.key).some(data => data.id == item.id));
          console.log("difference", difference);
          for(let i = 0; i< difference.length; i++){
            let index = levelArray.findIndex(item => item.id == difference[i].id);
            console.log("index", index);
            if(index !=-1){
               levelArray.splice(index, 1);
            }
           }
         }
          console.log("level Daata", levelArray);
          levelArray[0].isUnlock = true;
          levelInfo[mode.key] = JSON.stringify(levelArray);
         }
       
       }
    console.log("levelObjectArray", levelInfo);
    cc.sys.localStorage.setItem("LevelInfo", JSON.stringify(levelInfo));
  }

  openLocalisationPopUp(){
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
     this.languagePopUp.active = true;
  }



  onShare(){
    if(cc.sys.isBrowser){
      return;
    }
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    var shareInfo = {};
    shareInfo.text = GameManager.getInstance().getString("textToShare");
    shareInfo.title = GameManager.getInstance().getString("titleOfShare");
    //shareInfo.image = "path/to/image"
   shareInfo.link = GAME_LINK.URL ;  // link of game
   sdkbox.PluginShare.nativeShare(shareInfo);  

  }

  onMoreGames(){
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    cc.sys.openURL(GAME_LINK.URL);
  }

  openMoreInfoPopUp(){
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    console.log('inside this');
    this.moreInfo.active = true;
  }

  hideMoreInfoPopUp(){
    // SoundManager.getInstance().playEffect(this.buttonPressed, false);
    this.moreInfo.active = false;
  }

  showPrivacyPolicy(){
    // this.playLoader();
    SoundManager.getInstance().playEffect(this.buttonPressed, false);
    this.moreInfo.active = false;
    this.privacyPolicy.active = true;
  }

  enabledMoreGamesButton(isActive){
    this.moreInfo.getChildByName("Background").getChildByName("buttonLayout").getChildByName("moreGames").active = isActive;
    this.bottomBar.getChildByName("moreGames").active = isActive;
  }


  showFutureDetailsScreen(){
    this.futureDetails.active = true;
  }



 
  // playLoader(){
  //   this.loaderNode.active = true;
  //   this.loaderNode.getChildByName("loadingImage").getComponent(cc.Animation).play();
  // }

  // stopLoader(){
  //   this.loaderNode.active = false;
  // }

  // update (dt) {}
}
