# MemoraMax Game

Picture Match game

**Teachnology Stack**

_Game_ : Cocos creator (2.4.5)

_Ads_ : facebook live audiance

_Native Sharing_ : sdkbox


# Configure

## How to add more levels
1.   __Add new level folder inside Images folder__ 

MemoryGame
└── asstes
    └── resources
        └── Levels
            ├── Images
            |     |__ LEVEL#
            |
            |__level.json    

Here # means the numeric value to be replaced 

2. __Add entry of the level in level.json file__

   level.json has normal and practice mode place the following object inside the level array of any of these two mode. 

   these are the fields which are required in the level info. 

           {
                  "id" : 0,  
              "cards":[
                  {"name":  "strawberry"},
                  {"name":  "shoe"},
                  {"name":  "motorcycle"},
                  {"name":  "icecream"},
                  {"name":  "flower"},
                  {"name":  "ball"}
              ],
              "grid":{
                  "col" : 3,
                  "row":4
              },
              "timer":{
                "memorizeTime" : 5,
                "totalTime":0
                ""bounsTime":0
              },
              "groupOf" :2
             
           },

     each level should have :
      **id**  usually it's one number less then the #(from LEVEL#)

     **cards** should have all the images name which are present inside the LEVEL# foler without extension(png,jpg etc);

     **grid**  how images should be shown

     **timer**  memorizeTime : how much time should be given to memorize all cards

                totalTime : how much time should be given to play the game ( this will be zero in case of pratice mode )
                bonus time : how much time will be given to user when one match is made

     **groupOf**  how the grouping  of cards is done(how much card we can open at one time)


**it's adviced not to add levels in between already existing levels**



## How to change Add Ids

   Open cocos creator and in the Projet chose project settings In project setting chose services and change AppID to yours app id 

   In the FacebookAudiance.js file change the ids of  BANNER, INTERSTITIAL, which is present in the PLACEMENT_IDS. Change ids based on the device you want to show ads on ANDROID or IOS 

FacebookAudiance.js is present in 
   MemoryGame
└── asstes
    └── scripts
        └── managers
            ├── FacebookAudiance.js
            |__ LanguageManager.js
            |__ SoundManager.js

        




## How to change title or words 
 
 To change title or words in the game change the values in the JSON files. Langauge json files are present inside 

 MemoryGame
└── asstes
    └── resources
        └── Language
            ├── EN.json
            |__ ES.json

in EN.json we have English words and in ES.json we have esponal words. Make sure that both of the files have same key values        
  Ex:  "howToPlay" : "HOW TO PLAY",      in EN.json
       "howToPlay" : "CÓMO JUGAR",      in ES.json
        key is howToPlay


















