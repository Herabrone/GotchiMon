import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react'; 
import './Base.css';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';

import { useDialogue } from "../../utils/dialogueContext";

// Import monster sprites
import monsterState1 from "../../../public/assets/sprites/first_evo/Blue_Slime.png";
const IDLE_MUSIC_SRC = '/../../../public/assets/sfx/bg-music/idle/idle.mp3'; 

export default function Base() {

    const navigate = useNavigate();
    const { currentNode, isDialogueActive, setIsDialogueActive, advanceDialogue } = useDialogue();
    const [isVisible, setIsVisible] = useState(false);
    const [food, setFood] = useState(0);
    const [coins, setCoins] = useState(0);
    const [monsterState, setMonsterState] = useState(1);
    const [hasFirstFed, setHasFirstFed] = useState(false);
    const [showShopButton, setShowShopButton] = useState(false);

    const audioRef = useRef(null); 

    useEffect(() => {
        const audio = audioRef.current;

        const playMusic = () => {
            if (audio) {
                audio.loop = true;
                audio.volume = 0.5; 
                audio.currentTime = 0; 

                audio.play().catch(e => {
                    console.warn("Base Page BGM failed to play automatically. User interaction needed:", e);
                });
            }
        };

        playMusic();

        // Cleanup: Stop the music when navigating away from the Base page
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, []); 


    // Load food count, coins, and monster state from localStorage
    useEffect(() => {
        const foodCount = localStorage.getItem("food");
        setFood(foodCount ? parseInt(JSON.parse(foodCount)) : 0);
        
        const coinCount = localStorage.getItem("coins");
        setCoins(coinCount ? parseInt(JSON.parse(coinCount)) : 1);
        
        const savedMonsterState = localStorage.getItem("monster_state");
        setMonsterState(savedMonsterState ? parseInt(JSON.parse(savedMonsterState)) : 1);
        
        const firstFedStatus = localStorage.getItem("hasFirstFed");
        setHasFirstFed(firstFedStatus ? JSON.parse(firstFedStatus) : false);
        
        const shopButtonStatus = localStorage.getItem("showShopButton");
        setShowShopButton(shopButtonStatus ? JSON.parse(shopButtonStatus) : false);
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
            localStorage.setItem("food", (food - 1).toString());
            setIsVisible(true); // Show the div
            setTimeout(() => {
            setIsVisible(false); // Hide the div after 1000ms (1 second)
            }, 1000);

            // Check if this is the first feeding
            if (!hasFirstFed) {
                setHasFirstFed(true);
                localStorage.setItem("hasFirstFed", "true");
                
                // Trigger FirstFeeding dialogue after a short delay
                setTimeout(() => {
                    advanceDialogue('FirstFeeding_01');
                    setIsDialogueActive(true);
                }, 1500);
            }

            //TODO: Add feeding animation and sound effect here
        }

        
    };

    // Show shop button after FirstFeeding_02 dialogue
    useEffect(() => {
        if (currentNode === 'FirstFeeding_02' && !showShopButton) {
            setShowShopButton(true);
            localStorage.setItem("showShopButton", "true");
        }
    }, [currentNode, showShopButton]);

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
            <audio ref={audioRef} src={IDLE_MUSIC_SRC} preload="auto" /> 
            
            {(!isDialogueActive || currentNode === 'FirstFeeding_01' || currentNode === 'FirstFeeding_02') && (
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
                        {showShopButton && (
                            <a onClick={()=> {navigate("/shop")}} className="Shop_Button">Shop</a>
                        )}
                    </div>
                </>
            )}

            {/* Render Dialogue so dialogue can appear on this page */}
            <Dialogue />
            
        </ScreenLayout>
    )
}