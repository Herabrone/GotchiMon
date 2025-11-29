const dialogueTree = {
    start:{
        text: "Hello! Were so excited to have you",
        options: [
            {text: "Next...", next: "Nursery01"},
        ],
    },
    Nursery01: {
        text:"We have three choices for you! There are no bad choices, but some people say some are better than others!",
        options: [
            {text: "Show me the choices", next: "Nursery02"},
        ],
    },
    Nursery02: {
        text: "Great choice!",
        options: [
            {text: "Go back", next: "start"},
        ],
    },
};

export default dialogueTree;