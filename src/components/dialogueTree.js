const dialogueTree = {
    start:{
        text: "Hello! Were so excited for you to join us at get your first GotchiMon!",
        options: [
            {text: "Continue", next: "Nursery01"},
        ],
    },
    Nursery01: {
        text:"We have three choices for you! There are no bad choices, but some people say some are better than others!",
        options: [
            {text: "Show me the choices", action: "SelectEgg"}
        ],
    },

    // EGG 1
    EggSelected1_0:{
        text:"You have selected Egg 1! EGGcelent choice!",
        options: [
            {text: "...", next: "EggSelected1_1"}
        ],
    },
    EggSelected1_1:{
        text:"Tough crowd. Oh and the other eggs? Don't worry about them. They'll be my breakfast! Haha Im just kidding of course. Bye now!",
        options: [
            {text:"Continue", next: "EggSelected1_2" }
        ],
    },
     EggSelected1_2:{
        text:"Press SPACE repeatedly to hatch your egg!",
        options: [
            {text: "Start Hatching", action: "HatchEgg"}
        ],
    },
    
    //Dialogue converges for egg choices here to give more instructions
    Base1:{
        text:"Congratulations! On hatching your first GotchiMon. Always remember to feed and take care of it! And it will take care of you! By making you tons of money!",
        options: [
            {text: "Continue", next: "Base2"}
        ],
    },
    Base2:{
        text:"Now feed your gotchimon! It looks hungry!",
        options:[
            {text:"...", next: null}
        ]
    },
    EggHatched:{
        text:"Your GotchiMon hatched!",
        options: [
            {text: "Continue", action: "HatchEgg", next: null}
        ]
    },

    // EGG 2
    EggSelected2_0:{
        text:"You have selected Egg 2! A wonderful choice!",
        options: [
            {text: "Continue", next: "EggSelected1_1"}
        ],
    },
    EggSelected2_1:{
        text:"...",
        options: [
            {text:"Continue", next: "EggSelected1_2" }
        ],
    },
     EggSelected2_2:{
        text:"Your GotchiMon is hatching!",
        options: [
            {text: "Continue", action: "HatchEgg", next: null}
        ],
    },
    Evolution1:{
        text:"Your Gotchimon is evolving!",
        options: [
            {text:"Continue", next: "Evolution1_1" }
        ],
    },
    Evolution1_1:{
        text:"Your Gotchimon evolved!",
        options: [
            {text:"Continue", next: null }
        ],
    },

    // EGG 3
    EggSelected3_0:{
        text:"You have selected Egg 3! An amazing choice!",
        options: [
            {text: "Continue", next: "EggSelected1_1"}
        ],
    },
    EggSelected3_1:{
        text:"...",
        options: [
            {text:"Continue", next: "EggSelected1_2" }
        ],
    },
     EggSelected3_2:{
        text:"Your GotchiMon is hatching!",
        options: [
            {text: "Continue", action: "HatchEgg", next: null}
        ],
    },


    //First Feeding dialogue 
    FirstFeeding_01: {
        text: "YOU: Still hungry huh? Okay lets get some more food ",
        options: [
            {text: "Continue", next: "FirstFeeding_02"}
        ],
    },
    FirstFeeding_02: {
        text: "Enter the shop to buy more food!",
        options: [
            {text: "Continue", next: null}
        ],
    },


    // Fight dialogue nodes
    FightBegin: {
        text: "Begin fight!",
        options: [
            {text: "Attack", action: "Attack"}
        ],
    },
    FightAttacking: {
        text: "Attacking...",
        options: [], // No options during attack animation
    },
    FightWon: {
        text: "Fight is over, you won!",
        options: [
            {text: "Continue", next: "FightReward"}
        ],
    },
    FightReward: {
        text: "Gold coin was dropped.",
        options: [
            {text: "Continue", action: "RewardCoin", next: "FightComplete"}
        ],
    },
    FightComplete: {
        text: "Please return to base.",
        options: [
            {text: "Continue", action: "ReturnToBase", next: null}
        ],
    },

    // Shop Dialogue nodes
    ShopStart: {
        text: "Select your food then checkout to purchase. If you change your mind, click on the selected item in your cart to remove it.",
        options: [
            {text: "Ok", action: "Ok", next: null}
        ],
    },
    ShopComplete: {
        text: "Thank you for shopping! Enjoy :)",
        options: [
            {text: "Back to Base", action: "ReturnToBase", next: null}
        ],
    },
    
};

export default dialogueTree;