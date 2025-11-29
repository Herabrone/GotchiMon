import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import './Base.css';

import TextWriter from '../../utils/TextWriter';
import ScreenLayout from '../../components/screenlayout';
import dialogueTree from '../../components/dialogueTree';

import { useDialogue } from "../../utils/dialogueContext";

export default function Base() {

    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);

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
                    <dialogue start="start" onEnd={() => setShowMessage(true)} />
                </div>
            )}

            <div className="action-container">
                <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
            </div>
        </ScreenLayout>
    )
}