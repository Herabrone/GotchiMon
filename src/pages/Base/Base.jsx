import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import './Base.css';

import TextWriter from '../../utils/TextWriter';
import ScreenLayout from '../../components/screenlayout';

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
                <TextWriter text="This is a test for showing text one word at a time" delay={70} />
            </div>
            
            <div className="action-container"> 
                <a onClick={Feed_Button} className="Feed_Button">Feed</a> 
            </div>
            {showMessage && (
                <div className="yum-message">YUM</div>
            )}

            <div className="action-container">
                <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
            </div>
        </ScreenLayout>
    )
}