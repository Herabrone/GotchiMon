import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";

import './Landing.css';

export default function Landing() {
    const { setIsDialogueActive, resetDialogue, isDialogueActive } = useDialogue();
    const navigate = useNavigate();

    // Start dialogue when user clicks Start by resetting the dialogue
    const startDialogue = () => {
        // reset to 'start' node and activate the dialogue
        if (typeof resetDialogue === 'function') {
            resetDialogue();
        } else {
            setIsDialogueActive(true);
        }
    };

    const handleDialogueAction = (action) => {
        if (action === "SelectEgg") {
           navigate("/select-egg");
        }
    };

    return (
        <ScreenLayout>
            <div className="landing-container">
                <h1 className="gotchimon-title">GotchiMon</h1>

                {/* Show controls only when dialogue is not active */}
                {!isDialogueActive && (
                    <button onClick={startDialogue} className="start-button">
                        Start
                    </button>
                )}

                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    )
}