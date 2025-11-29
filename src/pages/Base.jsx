import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

import TextWriter from '../utils/TextWriter';

export default function Base() {

    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);

    const Feed_Button = () => {
        setShowMessage((prev) => !prev);
    };

    return (
        <>
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



            <div className="action-container"> //TODO: send to fight page
                    <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
            </div>


        </>
    )
}