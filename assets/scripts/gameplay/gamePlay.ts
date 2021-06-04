
import {GameManager} from "../managers/GameManager"
import { GAME_MODE, END_POP_UP } from "../helper/constants";
import SoundManager from "../managers/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {

    private _cards = [];
    private _gridInfo = null;
    private _level  =  0;
    private _timer = null;
    private OpenCards =[];
    private cardsInPair =[];
    private levelData = null;
    private interval = null;
    private isTouchBlocked = false;
    private totalTime = 0;
    private groupOf = 2;
    

    private progresser = null;
   
    gameMode = '';

    gameStartAlert = null;
    gameEndAlert = null;
    optionLayer = null;

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.ProgressBar)
    timerBar : cc.ProgressBar = null;

    @property(cc.Layout)
    gameLayout : cc.Layout = null;

    @property(cc.Sprite)
    bouns = null;

    @property(cc.Prefab)
    startPopUp = null;

    @property(cc.Prefab)
    gameEndPopUp = null;


    @property(cc.AudioClip)
    correctAnswerAudio: cc.AudioClip = null;



    @property(cc.AudioClip)
    wrongAnswerAudiodFlip: cc.AudioClip = null;


    @property(cc.AudioClip)
    last5Sec: cc.AudioClip = null;


    @property(cc.AudioClip)
    clapping: cc.AudioClip = null;

    @property(cc.AudioClip)
    timesUp: cc.AudioClip = null;


    

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

     }

    start () {
        this.progresser = this.timerBar.node.getChildByName("bar");
        var animationClips = this.bouns.node.getComponent(cc.Animation);
        animationClips.on('finished', this.bounsAnimationCompleted, this);
       
    }


    onDisable(){
      clearInterval(this.interval)  ;
      this.OpenCards.length =0;
      this.cardsInPair.length =0;
      this.bouns.node.active = false; 
    }


    // SETTING UP UI

    setUpUI(level : number, gameMode:string, optionRef){
        this.gameLayout.node.active = false;
        this.gameMode = gameMode;
        this._level = level;
        this.levelData = GameManager.getInstance().getLevelData(this._level , this.gameMode);
        this.optionLayer = optionRef;
        console.log("called 1000 times", this.levelData , this._level );
        this.setUpAlerts();
        this.loadLevelImages();
        
       
        
    }
     loadLevelImages(){
        GameManager.getInstance()
        .loadLevelImages(this._level)
        .then((data) => {
          this.gameStartAlert.getComponent("gameStart").accept.interactable = true;
          this.groupOf =  this.levelData.groupOf;
          this.createAndShuffelCards();
          this._gridInfo = this.levelData.grid;
        
          this.setGrid();
          this.bouns.node.getChildByName("bonus").string = this.levelData.timer.bounsTime;
          
        })
        .catch((error) => {
          console.log("erorr", error);
        });
     }
    setUpAlerts (){

        let gameModeDetails = GameManager.getInstance().getModeInfo(this.gameMode);
        this.gameStartAlert = cc.instantiate(this.startPopUp);
        let timerTitle =  this.gameMode == GAME_MODE.PRACTICE ? 
        GameManager.getInstance().getString(GameManager.getInstance().getSelectedMode()):
        `${this.levelData.timer.totalTime}s`
        this.gameStartAlert.getComponent("gameStart").setProperties(this, this.gameMode,
            timerTitle, this.levelData.timer.memorizeTime,
             this.levelData.timer.bounsTime );
        this.gameEndAlert = cc.instantiate(this.gameEndPopUp);
        
        this.gameEndAlert.getComponent("gameEnd").setProperties(this, this.gameMode);
        this.node.parent.addChild(this.gameStartAlert,10);
        this.node.parent.addChild(this.gameEndAlert,10);
        this.gameEndAlert.active = false;
    }

    setGrid() {
        this.gameLayout.getComponent(cc.Widget).updateAlignment();
        this.gameLayout.node.removeAllChildren();
        let spacing = this.gameLayout.spacingX * this._gridInfo.col;
        let width = this.gameLayout.node.width - spacing;
        for(let i = 0; i < this._cards.length; i++){
            let card = cc.instantiate(this.cardPrefab);
            let blockSize = width / this._gridInfo.col;
            card.setScale(blockSize/card.width);
            card.getComponent("cards").setDelegate(this);
            card.getComponent("cards").setUpUI(this._cards[i].name, this._level, this.gameMode);
            this.gameLayout.node.addChild(card);
        }  
        
        this.optionLayer.active = false;    
    }

    createAndShuffelCards(){
        this._cards.length =0;
        for(let i =0; i<this.groupOf; i++){
            this._cards.push(...this.levelData.cards);
        }
    
        console.log("cards", this._cards);
        for(let index = this._cards.length-1; index>= 0; index--){
            let randomIndex = Math.floor(Math.random() * (index - 0) + 0);
            let swapElement = this._cards[randomIndex];
            let currentElement = this._cards[index];
            this._cards[index] = swapElement;
            this._cards[randomIndex] = currentElement;
        }

    }

    FlipAllCards(){
        
        for(let child of this.gameLayout.node.children){
            child.getComponent("cards").unreveal();
        }
    }


    startGameTimer (){
        if(this.gameMode != GAME_MODE.PRACTICE){
            this.progresser.width = 0;
            this.timerBar.progress = 0;
            this.timerBar.totalLength = this.timerBar.node.width;
        }
       
        this._timer = 0;
        let target = this;
        this.totalTime = this.levelData.timer.totalTime;
        console.log("total length", this.timerBar.totalLength, this.levelData.timer.totalTime);
        this.interval = setInterval(()=>{
            this._timer++;
            target.optionLayer.getComponent("options").updateTimer(this._timer , this.totalTime)
            if(this.gameMode != GAME_MODE.PRACTICE){
                this.timerBar.progress  = this._timer  / this.totalTime;
                Math.abs(this._timer  - this.totalTime) == 5
                 && 
                SoundManager.getInstance().playEffect(this.last5Sec, false);
                if(this._timer  == this.totalTime){
                    this.isTouchBlocked = true;
                    clearInterval(this.interval);  
                    this.endGame(false);
                }
            }
            
        }, 1000);
    }


    showCard(card){
        // console.log("shoow card of the game play", card);
        if(this.cardsInPair.length >= this.groupOf || this.isTouchBlocked){
            return;
        }
        card.getComponent("cards").reveal();
        this.cardsInPair.push(card);
        this.cardsInPair.length > 1 && this.isPair();
    }

    
    isPair(){
        let cards = [];
        cards.length = 0;
        for(let i=0; i< this.cardsInPair.length; i++){
            cards.push(this.cardsInPair[i].getComponent('cards'))
        }

        let isMatch  = true;
        for(let i =0; i< cards.length - 1; i++ ){
            if(cards[i].getCardName() !== cards[i+1].getCardName()){
                isMatch = false;
                break;
            }

        }
        if( isMatch ){
            if(this.cardsInPair.length != this.groupOf){
                return;
            }

            if(this.gameMode != GAME_MODE.PRACTICE){  
                this.playBounsAnimation();
                this.isTouchBlocked = true;
            }else{
                this.isTouchBlocked = true;
                this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(()=>{
                   for(let cardScipt of cards){
                    cardScipt.playCorrectAnimation();
                   }
                    this.isTouchBlocked = false;
                   })));

               
            }
            for(let cardScipt of cards){
                this.OpenCards.push(cardScipt.getCardName());
               }
            this.cardsInPair.length = 0;
            if(this.OpenCards.length == this._cards.length){
               this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(()=>{
                this.endGame(true);
               }))); 
            }

        }else{
            let target = this;
            this.isTouchBlocked = true;
            this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(()=>{
                for(let cardScipt of cards){
                    cardScipt.unreveal();
                    this.isTouchBlocked = false;
                }
                this.cardsInPair.length = 0;
            })));
          
        }

        console.log("play sound", this.correctAnswerAudio, isMatch);
        this.node.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc( ()=>{
            let clip = isMatch ? this.correctAnswerAudio : this.wrongAnswerAudiodFlip;
            SoundManager.getInstance().playEffect(clip, false);
        })));
    }


    endGame (isWon) {
         SoundManager.getInstance().stopAllSounds();
        clearInterval(this.interval);
        if(isWon){
            let isNewRecord = false;
            let levelInfo = JSON.parse(cc.sys.localStorage.getItem("LevelInfo"));
            let levels =  JSON.parse(levelInfo[this.gameMode]);
            // SoundManager.getInstance().playEffect(this.clapping, false);
            if(levels[this._level].time > this._timer){
                levels[this._level].time = this._timer;
                if(this._level < levels.length-1){
                    levels[this._level+1].isUnlock = true;
                }
                console.log("current level infp", levels[this._level].time, this._timer, JSON.parse(levelInfo[this.gameMode])[this._level].time);
                levelInfo[this.gameMode] = JSON.stringify(levels);
                cc.sys.localStorage.setItem("LevelInfo", JSON.stringify(levelInfo));
                isNewRecord = true;
            }
            this.gameEndAlert.getComponent("gameEnd").showPopUpFor(isNewRecord ? END_POP_UP.NEW_RECORD: END_POP_UP.CLEARD, this._level);
            this.gameEndAlert.active = true;
        }else{
            // SoundManager.getInstance().playEffect(this.timesUp, false);
            this.gameEndAlert.getComponent("gameEnd").showPopUpFor(END_POP_UP.FAILED,this._level);
            this.gameEndAlert.active = true;
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc( ()=>{
            let clip = isWon ? this.clapping : this.timesUp;
            SoundManager.getInstance().playEffect(clip, false);
        })));
        
    }

    // pop ups DELEGATE METHODS 
    onPlayAgain (){
        this.gameEndAlert.active = false;
        this.node.parent.getComponent("FacebookAudiance").showInterstital();
        this.node.parent.getComponent("home").onBack();
        console.log("level", this._level.toString());
        this.node.parent.getComponent("home").onLevelSelect( this._level.toString());
    }

    
    startGame(){
        this.progresser.width = this.timerBar.node.width;   
        this.timerBar.progress = 1;
        let target = this;
        let time = this.levelData.timer.memorizeTime;
        this.gameStartAlert.removeFromParent();
        target.optionLayer.getComponent("options").updateTimer(time, this.levelData.timer.totalTime)
        target.optionLayer.active = true;
        this.gameLayout.node.active = true;
        this.isTouchBlocked = true;
        this.interval = setInterval(()=>{
            target.optionLayer.getComponent("options").updateTimer(time, this.levelData.timer.totalTime)
            time--;
            this.timerBar.progress = time/this.levelData.timer.memorizeTime;
            if(time === -1){
                clearInterval(this.interval);
                target.isTouchBlocked = false;
                target.FlipAllCards();
                this.startGameTimer();
            }
        }, 1000);
    }


    onPlayAgainCancel(){
       //MARK : SHOW INTERSTIAL ADS;
       this.node.parent.getComponent("FacebookAudiance").showInterstital();
        this.gameEndAlert.active = false;
        this.gameEndAlert.removeFromParent();
        this.node.parent.getComponent("home").onBack();

    }

    gameEnded (){
        this.node.parent.getComponent("FacebookAudiance").showInterstital();
        this.gameEndAlert.removeFromParent();
        let level = GameManager.getInstance().getCurrentLevel();
        let totalLevelInMode = GameManager.getInstance().getLevelInfo(this.gameMode);
        console.log("level", level == totalLevelInMode.length -1 )
        if(level == totalLevelInMode.length -1){
        this.node.parent.getComponent("home").showFutureDetailsScreen();
        }else{
            this.node.parent.getComponent("home").onBack();
        }
       
        
        
    }

    // ANIMATION CALLBACKS :
1
    playBounsAnimation(){
        console.log("inside this play bouns animation");
        this.bouns.node.active = true;
        this.bouns.node.position  = new cc.Vec2(0,0);
        this.bouns.node.scale = 2;
        this.bouns.node.opacity = 255;
        this.bouns.node.getComponent(cc.Animation).play();

    }

    bounsAnimationCompleted (){
        this.bouns.node.active = false;
        this.totalTime += this.levelData.timer.bounsTime;
        console.log("bonys",this.levelData.timer, this.totalTime );
        this.optionLayer.getComponent("options").updateTimer(this._timer,  this.totalTime);
        this.isTouchBlocked = false;
    }


    







   

}
