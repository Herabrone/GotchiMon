import React, { createContext, useContext, useState} from 'react';

const DialogueContext = createContext();

export function DialogueProvider({ children }) {
    const [currentNode, setCurrentNode] = useState('start');
    const [isDialogueActive, setIsDialogueActive] = useState(false);

    /*
        * Function to advance the dialogue to the next node
        * nextNode: the key of the next dialogue node
    */


    const advanceDialogue = (nextNode) => {
        if (nextNode) {
            setIsDialogueActive(true);
            setCurrentNode(nextNode);  
        } else {
            setIsDialogueActive(false);
            //assume if no nextNode, dialogue has ended
        }
    };

    //re sets the dialogue to the start
    const resetDialogue = () => {
        setCurrentNode('start');
        setIsDialogueActive(true);
    };

    // Provide the context values to children components
    return (
        <DialogueContext.Provider value={{ 
            currentNode, 
            isDialogueActive, 
            advanceDialogue, 
            resetDialogue, 
            setIsDialogueActive 
        }}>
            {children}
        </DialogueContext.Provider>
    );
}
   
export function useDialogue() {
    const context = useContext(DialogueContext);
    if (!context) {
        throw new Error('useDialogue must be used within DialogueProvider');
    }
    return context;
}