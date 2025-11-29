import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

import TextWriter from '../utils/TextWriter';

export default function Base() {

    const navigate = useNavigate();

    return (
        <>
            <h1 style={{color: "black"}}>Base</h1>

            <div>
                <TextWriter text="This is a test for showing text one word at a time" delay={100} />
            </div>
            
            <div className="action-container">
                    <a onClick={() => {navigate("/")}} className="Feed_Button">Feed</a>
            </div>
            <div className="action-container">
                    <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
            </div>


        </>
    )
}