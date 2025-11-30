const dialogueTree = {
    start:{
        text: "Hello! We're so excited for you to join us to get your first gotchimon!",
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
        text:"You have selected Egg 1! EGGcellent choice!",
        options: [
            {text: "...", next: "EggSelected1_1"}
        ],
    },
    EggSelected1_1:{
        text:"Tough crowd. Oh and the other eggs? Don't worry about them. They'll be my breakfast! Haha I'm just kidding of course. Bye now!",
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
        text:"Congratulations on hatching your first gotchimon! Always remember to feed and take care of it and it will take care of you! It will make you tons of money!",
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
        text:"Your gotchimon hatched!",
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
        text:"Your gotchimon is hatching!",
        options: [
            {text: "Continue", action: "HatchEgg", next: null}
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
        text:"Your gotchimon is hatching!",
        options: [
            {text: "Continue", action: "HatchEgg", next: null}
        ],
    },


    //First Feeding dialogue 
    FirstFeeding_01: {
        text: "YOU: Still hungry huh? Okay let's get some more food.",
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

    SecondFeeding_01: {
        text: "YOU: There you go, full yet?",
        options: [
            {text: "Continue", action: "firstEvolution", next: null}
        ],
    },
    // EVOLUTION NODES

    // First Evolution Nodes
    Evolution1:{
        text:"What?",
        options: [
            {text:"...", next: "Evolution1_0" }
        ],
    },
    Evolution1_0:{
        text:"Your gotchimon is evolving!",
        options: [] // No options - animation will play, then auto-advance to Evolution1_1
    },
    Evolution1_1:{
        text:"Your gotchimon evolved!",
        options: [
            {text:"Continue", action: "returnToBase", next: null }
        ],
    },

     // After first Evolution
    AfterFirstEvolution_01: {
        text: "YOU: Perfect, you've grown so fast!",
        options: [
            {text: "Continue", next: "AfterFirstEvolution_02"}
        ],
    },
    AfterFirstEvolution_02: {
        text: "YOU: Hungry again? I just fed you!",
        options: [
            {text: "Continue", next: "AfterFirstEvolution_03"}
        ],
    },
    AfterFirstEvolution_03: {
        text: "YOU: Okay fine, this is getting expensive though.",
        options: [
            {text: "Continue", action: "goToEmptyShop", next: "AfterFirstEvolution_04"}
        ],
    },
    AfterFirstEvolution_04: {
        text: "YOU: Well that's too bad, looks like they need more time to get more food.",
        options: [
            {text: "Continue", action: "ReturnToBase", next: "AfterFirstEvolution_05"}
        ],
    },
    AfterFirstEvolution_05: {
        text: "YOU: In the meantime let's make good on my initial investment! Let's go and fight!",
        options: [
            {text: "Continue", action: "FirstFight", next: null}
        ],
    },

    // SECOND EVOLUTION (Good/Bad path)
    ThirdFeeding_01: {
        text: "YOU: Wow! You sure ate that really quickly!",
        options: [
            {text: "Continue", action: "secondEvolution", next: null}
        ],
    },

    Evolution2:{
        text:"What's happening?!",
        options: [
            {text:"...", next: "Evolution2_0" }
        ],
    },
    Evolution2_0:{
        text:"Your gotchimon is evolving again!",
        options: [] // No options - animation will play, then auto-advance to Evolution2_1
    },
    Evolution2_1:{
        text:"Your gotchimon has reached it's final form!",
        options: [
            {text:"Amazing!", action: "returnToBase", next: null }
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
    ShopNotEnoughCoins: {
        text: "Please make sure you have enough coins!",
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

    AfterFirstFight_01: {
        text: "YOU: Only 1 coin? We're going to need to grind all night!",
        options: [
            {text: "Continue", next: "AfterFirstFight_02"}
        ],
    },
    AfterFirstFight_02: {
        text: "YOU: Let's see if the shop has more food.",
        options: [
            {text: "Continue",  action: "goToShopWithBadFood", next: null}
        ],
    },
    AfterFirstFight_03: {
        text: "YOU: Here you go, eat it slowly though...",
        options: [
            {text: "Continue",  next: null}
        ],
    },
    //Evolution 2 occurs
    afterSecondEvolution_GOOD_0:{
        text:"YOU: Wow, you evolve fast!",
        options: [
            {text: "Continue", next: "afterSecondEvolution_GOOD_1"}
        ],
    },
    afterSecondEvolution_GOOD_1:{
        text:"gotchimon: I'm ready to go off on my own...",
        options: [
            {text: "Continue", next: null}
        ],
    },
    //gotchimon leaves hapily

    afterSecondEvolution_BAD_0:{
        text:"YOU: Hey… are you okay? You seem… Different.",
        options: [
            {text: "Continue", next: "afterSecondEvolution_BAD_1"}
        ],
    },
    afterSecondEvolution_BAD_1:{
        text:"GOTCHIMON: What… what have you been feeding me…",
        options: [
            {text: "Continue", next: "afterSecondEvolution_BAD_2"}
        ],
    },
    afterSecondEvolution_BAD_2:{
        text:"GOTCHIMON: My… brothers…",
        options: [
            {text: "Continue", next: null}
        ],
    },
    //Gotchimon escapes?

    // Final dialogue nodes
    FinalStartG: {
        text: "YOU: Wow you evolve fast!",
        options: [
            {text: "Continue", next: "FinalResponseG"}
        ]
    },
    FinalResponseG: {
        text: "gotchimon: I'm ready to go off on my own!",
        options: [
            {text: "Continue", next: "FinalEndG"}
        ]
    },
    FinalEndG: {
        text: "Thank you for playing!",
        options: [
            {text: "Continue", action: "BackToStart", next: null}
        ]
    },

    FinalStartB_0: {
        text: "YOU: Hey… are you okay? You seem…",
        options: [
            {text: "Continue", next: "FinalStartB_1"}
        ]
    },
    FinalStartB_1: {
        text: "YOU: Different...",
        options: [
            {text: "Continue", next: "FinalResponseB_0"}
        ]
    },
    FinalResponseB_0: {
        text: "GOTCHIMON: What...",
        options: [
            {text: "Continue", next: "FinalResponseB_1"}
        ]
    },
    FinalResponseB_1: {
        text: "GOTCHIMON: What have you been feeding me?!?!",
        options: [
            {text: "Continue", next: "FinalResponseB_2"}
        ]
    },
    FinalResponseB_2: {
        text: "GOTCHIMON: My...",
        options: [
            {text: "Continue", next: "FinalResponseB_3"}
        ]
    },
    FinalResponseB_3: {
        text: "GOTCHIMON: Brothers?!?!",
        options: [
            {text: "Continue", next: "FinalEndB"}
        ]
    },
    FinalEndB: {
        text: "...",
        options: [
            {text: "Continue", action: "BackToStart", next: null}
        ]
    },
    
};

export default dialogueTree;