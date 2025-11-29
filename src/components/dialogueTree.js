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
        text:"You have selected Egg 1! EGGcelent choice haha!",
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
        text:"...",
        options: [
            {text: "Continue", action: "HatchEgg", next: "EggSelected1_3"}
        ],
    },
    EggSelected1_3:{
        text:"Your egg is hatching!",
        options: [
            {text: "Continue", next: "EggSelected1_4"}
        ],
    },
    EggSelected1_4:{
        text:"...",
        options: [
            {text: "Continue", action: "HatchEgg", next: "Base1"}
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
};

export default dialogueTree;