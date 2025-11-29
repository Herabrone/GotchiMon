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
    

};

export default dialogueTree;