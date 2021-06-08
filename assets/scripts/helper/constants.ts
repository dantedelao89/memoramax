// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export const enum GAME_SCREEN {
    MODE_SELECTION = 1,
    LEVEL_SELECTION,
    GAME_PLAY
}


export const  GAME_MODE = {
     PRACTICE :"practice",
     NORMAL : "normal",
     MEDIUM : "medium",
     HARD : "hard"
}

export const enum END_POP_UP {
    NEW_RECORD = 1,
    CLEARD,
    FAILED
}

export const LANGUAGES = {
    ENGLISH : "EN",
    SPANISH : "ES"
}

export const GAME_LINK ={
    URL : "https://play.google.com/store/apps/details?id=com.game.memoramax"
}
