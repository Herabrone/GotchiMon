import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import './Base.css';

import TextWriter from '../../utils/TextWriter';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';

import { useDialogue } from "../../utils/dialogueContext";

export default function Base() {

    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const { isDialogueActive } = useDialogue();
    const prevIsActiveRef = useRef(isDialogueActive);

    // When dialogue finishes (active -> inactive), show the message once
    useEffect(() => {
        if (prevIsActiveRef.current && !isDialogueActive) {
            setShowMessage(true);
        }
        prevIsActiveRef.current = isDialogueActive;
    }, [isDialogueActive]);

    const Feed_Button = () => {
        setShowMessage((prev) => !prev);
    };

    return (
        <ScreenLayout>
            <h1 style={{color: "black"}}>Base</h1>

            <div>
                <TextWriter text="This is a test for showing text one word at a time" delay={20} />
            </div>
            
            <div className="action-container"> 
                <a onClick={Feed_Button} className="Feed_Button">Feed</a> 
            </div>
            
            {showMessage ? (
                <div className="yum-message">YUM</div>
            ) : (
                <div style={{marginTop: 12}}>
                    <Dialogue />
                </div>
            )}

            <div className="action-container">
                <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
            </div>
        </ScreenLayout>
    )
}