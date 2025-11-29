import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import './Base.css';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';

import { useDialogue } from "../../utils/dialogueContext";

export default function Base() {

    const navigate = useNavigate();
    const { currentNode, isDialogueActive, setIsDialogueActive } = useDialogue();
    const [isVisible, setIsVisible] = useState(false);

    // If we arrive on this page and the dialogue node was set to Base1,
    // make sure the dialogue UI is activated so the Base1 text appears.
    useEffect(() => {
        if (currentNode === 'Base1' && !isDialogueActive) {
            setIsDialogueActive(true);
        }
    }, [currentNode, isDialogueActive, setIsDialogueActive]);

    const Feed = () => {

        // TODO: Feeing logic and effect

        setIsVisible(true); // Show the div
        setTimeout(() => {
        setIsVisible(false); // Hide the div after 1000ms (1 second)
        }, 1000);
    };


    return (
        <ScreenLayout>
            <h1 style={{color: "black"}}>Base</h1>

            {!isDialogueActive && (
                <>
                    <div className="action-container">
                        <a className="Feed_Button" onClick={Feed}>Feed</a>
                    </div>
                    
                    {isVisible && (
                        <div className="yum-message">
                            Yummy!
                        </div>
                    )}

                    <div className="action-container">
                        <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
                    </div>
                </>
            )}

            {/* Render Dialogue so dialogue can appear on this page */}
            <Dialogue />
            
        </ScreenLayout>
    )
}