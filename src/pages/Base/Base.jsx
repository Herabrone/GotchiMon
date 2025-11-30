import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import './Base.css';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';

import { useDialogue } from "../../utils/dialogueContext";

// Import monster sprites
import monsterState1 from "../../../public/assets/sprites/first_evo/Blue_Slime.png";

export default function Base() {

    const navigate = useNavigate();
    const { currentNode, isDialogueActive, setIsDialogueActive } = useDialogue();
    const [isVisible, setIsVisible] = useState(false);
    const [food, setFood] = useState(0);
    const [coins, setCoins] = useState(0);
    const [monsterState, setMonsterState] = useState(1);

    // Load food count, coins, and monster state from localStorage
    useEffect(() => {
        const foodCount = JSON.parse(localStorage.getItem("food")) || 0;
        setFood(foodCount);
        
        const coinCount = JSON.parse(localStorage.getItem("coins")) || 1;
        setCoins(coinCount);
        
        const savedMonsterState = JSON.parse(localStorage.getItem("monster_state")) || 1;
        setMonsterState(savedMonsterState);
    }, []);

    // If we arrive on this page and the dialogue node was set to Base1,
    // make sure the dialogue UI is activated so the Base1 text appears.
    useEffect(() => {
        if (currentNode === 'Base1' && !isDialogueActive) {
            setIsDialogueActive(true);
        }
    }, [currentNode, isDialogueActive, setIsDialogueActive]);

    const Feed = () => {

        if (food > 0) {
            setFood(food - 1);
            localStorage.setItem("food", JSON.stringify(food - 1));
            setIsVisible(true); // Show the div
            setTimeout(() => {
            setIsVisible(false); // Hide the div after 1000ms (1 second)
            }, 1000);

            //TODO: Add feeding animation and sound effect here
        }

        
    };

    // Get the monster sprite based on state
    const getMonsterSprite = () => {
        switch(monsterState) {
            case 1:
                return monsterState1;
            // can add more cases for different monster states in the futuer
            default:
                return monsterState1;
        }
    };


    return (
        <ScreenLayout>
            

            {!isDialogueActive && (
                <>
                    <div className="resources-container">
                        <div className="food-display">
                            Food: {food}
                        </div>
                        <div className="coin-display">
                            Coins: {coins}
                        </div>
                    </div>

                    <div className="monster-display">
                        <img src={getMonsterSprite()} alt="Your Gotchimon" className="monster-sprite" />
                    </div>

                    {isVisible && (
                        <div className="yum-message">
                            Yummy!
                        </div>
                    )}

                    <div className="action-buttons">
                        <a className="Feed_Button" onClick={Feed}>Feed</a>
                        <a onClick={() => {navigate("/fight")}} className="Fight_Button">Fight</a>
                        <a onClick={()=> {navigate("/shop")}} className="Shop_Button">Shop</a>
                    </div>
                </>
            )}

            {/* Render Dialogue so dialogue can appear on this page */}
            <Dialogue />
            
        </ScreenLayout>
    )
}