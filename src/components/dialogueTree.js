const dialogueTree = {
    start:{
        text: "Hello! Were so exited for you to join us at get your first GotchiMon!",
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
    EggSelected1_0:{
        text:"You have selected Egg 1! A great choice!",
        options: [
            {text: "Continue", next: "EggSelected1_1"}
        ],
    }, // add more eggs later
    EggSelected1_1:{
        text:"...",
        options: [
            {text:"Continue", next: "EggSelected1_2" }
        ],
    },
     EggSelected1_2:{
        text:"Your GotchiMon is hatching!",
        options: [
            {text: "Continue", action: "HatchEgg", next: null}
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
            {text: "Continue", next: "FightComplete"}
        ],
    },
    FightComplete: {
        text: "Press space to return to base.",
        options: [
            {text: "Continue", action: "ReturnToBase", next: null}
        ],
    },

};

export default dialogueTree;