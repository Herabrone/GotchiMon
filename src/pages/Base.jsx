import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

export default function Base() {

    const navigate = useNavigate();

    return (
        <>
            <h1 style={{color: "black"}}>Base</h1>

            <h1 style={{color: "black"}}>text box for dialogue</h1>
            
            <div className="action-container">
                    <a onClick={() => {navigate("/")}} className="Feed_Button">Feed</a>
            </div>
            <div className="action-container">
                    <a onClick={() => {navigate("/")}} className="Fight_Button">Fight</a>
            </div>


        </>
    )
}