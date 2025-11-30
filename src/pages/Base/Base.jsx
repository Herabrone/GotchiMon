import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react'; 
import './Base.css';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';

import { useDialogue } from "../../utils/dialogueContext";

// Import monster sprites
import monsterState1Sprite from '../../../public/assets/sprites/first_evo/Blue_Slime.png';
import monsterState2Sprite from '../../../public/assets/sprites/second_evo/Dude_Monster_Idle_4.png';
import goodMonsterSprite from '../../../public/assets/sprites/third_evo/Good_monster_Idle.png';
import badMonsterSprite from '../../../public/assets/sprites/third_evo/Bad_Monster_Idle.png';

// Volume Up
const VolumeUpIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a7 7 0 0 1 0 7.08"></path>
    </svg>
);

// Mute
const VolumeMuteIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="22" y1="9" x2="16" y2="15"></line>
        <line x1="16" y1="9" x2="22" y2="15"></line>
    </svg>
);

const IDLE_MUSIC_SRC = '/../../../public/assets/sfx/bg-music/idle/idle.mp3'; 
const EAT_SOUND_SRC = '/../../../public/assets/sfx/feed/eat.mp3'; 

export default function Base() {
    const navigate = useNavigate();
    const { currentNode, isDialogueActive, setIsDialogueActive, advanceDialogue } = useDialogue();
    const [isVisible, setIsVisible] = useState(false);
    const [food, setFood] = useState(0);
    const [coins, setCoins] = useState(0);
    const [monsterState, setMonsterState] = useState(1);
    const [hasFirstFed, setHasFirstFed] = useState(false);
    const [showShopButton, setShowShopButton] = useState(false);
    const [hasSecondFed, setHasSecondFed] = useState(false);
    const [hasThirdFed, setHasThirdFed] = useState(false);
    const [showFightButton, setShowFightButton] = useState(false);
    const [hasReturnedFromEvolution, setHasReturnedFromEvolution] = useState(false);
    const [hasReturnedFromSecondEvolution, setHasReturnedFromSecondEvolution] = useState(false);
    const [hasCompletedFirstFight, setHasCompletedFirstFight] = useState(false);
    const [isMuted, setIsMuted] = useState(
        () => {
            const savedMuteStatus = localStorage.getItem("isMuted");
            return savedMuteStatus ? JSON.parse(savedMuteStatus) : false;
        }
    );

    const audioRef = useRef(null); 
    const eatAudioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;

        const playMusic = () => {
            if (audio) {
                audio.loop = true;
                audio.volume = 0.5; 
                audio.currentTime = 0; 
                audio.muted = isMuted;

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

    // Sync mute state with audio element whenever isMuted changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
        localStorage.setItem("isMuted", JSON.stringify(isMuted));
    }, [isMuted]);

    // Function to toggle mute
    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

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
        
        const secondFedStatus = localStorage.getItem("hasSecondFed");
        setHasSecondFed(secondFedStatus ? JSON.parse(secondFedStatus) : false);
        
        const thirdFedStatus = localStorage.getItem("hasThirdFed");
        setHasThirdFed(thirdFedStatus ? JSON.parse(thirdFedStatus) : false);
        
        const fightButtonStatus = localStorage.getItem("showFightButton");
        setShowFightButton(fightButtonStatus ? JSON.parse(fightButtonStatus) : false);
        
        const firstFightStatus = localStorage.getItem("hasCompletedFirstFight");
        setHasCompletedFirstFight(firstFightStatus ? JSON.parse(firstFightStatus) : false);
    }, []);

    // Handle returning from evolution page - show appropriate dialogue
    useEffect(() => {
        if (monsterState === 2 && !hasReturnedFromEvolution) {
            const justEvolved = localStorage.getItem('justEvolved');
            if (justEvolved === 'true') {
                localStorage.removeItem('justEvolved');
                setHasReturnedFromEvolution(true);
                
                // Show "after first evolution" dialogue
                setTimeout(() => {
                    advanceDialogue('AfterFirstEvolution_01');
                    setIsDialogueActive(true);
                }, 500);
            }
        } else if (monsterState === 3) {
            navigate('/final');
        }
        
        // Handle returning from second evolution (final form)
        if (monsterState === 3 && !hasReturnedFromSecondEvolution) {
            const justEvolvedToFinal = localStorage.getItem('justEvolvedToFinal');
            if (justEvolvedToFinal === 'true') {
                localStorage.removeItem('justEvolvedToFinal');
                setHasReturnedFromSecondEvolution(true);
                
                // Check alignment and show appropriate dialogue
                const alignment = localStorage.getItem('monster_alignment') || 'good';
                setTimeout(() => {
                    if (alignment.includes('good')) {
                        advanceDialogue('afterSecondEvolution_GOOD_0');
                    } else {
                        advanceDialogue('afterSecondEvolution_BAD_0');
                    }
                    setIsDialogueActive(true);
                }, 500);
            }
        }
    }, [monsterState, hasReturnedFromEvolution, hasReturnedFromSecondEvolution, advanceDialogue, setIsDialogueActive]);

    // Handle returning from first fight - show AfterFirstFight dialogue
    useEffect(() => {
        const returnedFromFirstFight = localStorage.getItem('returnedFromFirstFight');
        if (returnedFromFirstFight === 'true' && !hasCompletedFirstFight) {
            localStorage.removeItem('returnedFromFirstFight');
            setHasCompletedFirstFight(true);
            localStorage.setItem('hasCompletedFirstFight', 'true');
            
            // Show "after first fight" dialogue
            setTimeout(() => {
                advanceDialogue('AfterFirstFight_01');
                setIsDialogueActive(true);
            }, 500);
        }
    }, [hasCompletedFirstFight, advanceDialogue, setIsDialogueActive]);

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
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 1000);

            if (eatAudioRef.current) {
                eatAudioRef.current.currentTime = 0;
                eatAudioRef.current.volume = 1.0;
                eatAudioRef.current.play().catch(e => console.error("Error playing SFX:", e));
            }

            // FIRST FEEDING - Initial feed after hatching
            if (!hasFirstFed) {
                setHasFirstFed(true);
                localStorage.setItem("hasFirstFed", "true");
                
                setTimeout(() => {
                    advanceDialogue('FirstFeeding_01');
                    setIsDialogueActive(true);
                }, 1500);
            }
            // SECOND FEEDING - Triggers first evolution (baby -> dude)
            else if (hasFirstFed && !hasSecondFed && monsterState === 1) {
                setHasSecondFed(true);
                localStorage.setItem("hasSecondFed", "true");
                
                setTimeout(() => {
                    advanceDialogue('SecondFeeding_01');
                    setIsDialogueActive(true);
                }, 1500);
            }
            // THIRD FEEDING - Triggers second evolution (dude -> good/bad)
            else if (monsterState === 2 && !hasThirdFed) {
                setHasThirdFed(true);
                localStorage.setItem("hasThirdFed", "true");
                
                // Set monster alignment based on last purchased food
                const lastFoodType = localStorage.getItem('last_food_type') || 'good';
                localStorage.setItem('monsterAlignment', lastFoodType);
                
                setTimeout(() => {
                    advanceDialogue('ThirdFeeding_01');
                    setIsDialogueActive(true);
                }, 1500);
            }
        }
    };

    // Show shop button after FirstFeeding_02 dialogue
    useEffect(() => {
        if (currentNode === 'FirstFeeding_02' && !showShopButton) {
            setShowShopButton(true);
            localStorage.setItem("showShopButton", "true");
        }
    }, [currentNode, showShopButton]);

    // Show fight button after AfterFirstEvolution_05 dialogue
    useEffect(() => {
        if (currentNode === 'AfterFirstEvolution_05' && !showFightButton) {
            setShowFightButton(true);
            localStorage.setItem("showFightButton", "true");
        }
    }, [currentNode, showFightButton]);

    const handleDialogueAction = (action) => {
        if (action === 'firstEvolution') {
            localStorage.setItem('justEvolved', 'true');
            // Set dialogue to Evolution1 before navigating
            advanceDialogue('Evolution1');
            setTimeout(() => {
                navigate('/evolution');
            }, 100);
        } else if (action === 'secondEvolution') {
            // Set dialogue to Evolution2 before navigating
            advanceDialogue('Evolution2');
            setTimeout(() => {
                navigate('/evolution');
            }, 100);
        } else if (action === 'returnToBase') {
            // Already at base, just close dialogue
            setIsDialogueActive(false);
        } else if (action === 'FirstFight') {
            navigate('/fight');
        } else if (action === 'goToEmptyShop') {
            // Mark that we're visiting empty shop
            localStorage.setItem('visitingEmptyShop', 'true');
            navigate('/shop');
        }
    };

    // Get the appropriate sprite based on monster state
    const getMonsterSprite = () => {
        switch(monsterState) {
            case 1:
                return 'slime-idle-sprite'; // CSS animation class
            case 2:
                return monsterState2Sprite;
            case 3:
                const alignment = localStorage.getItem('monster_alignment') || 'good';
                return alignment === 'good' ? goodMonsterSprite : badMonsterSprite;
            default:
                return 'slime-idle-sprite';
        }
    };

    const renderMonster = () => {
        if (monsterState === 1) {
            return <div className="slime-idle-sprite"></div>;
        } else {
            return <img src={getMonsterSprite()} alt="Gotchimon" className="monster-sprite-img" />;
        }
    };

    return (
        <ScreenLayout>
            <audio ref={audioRef} src={IDLE_MUSIC_SRC} preload="auto" /> 
            <audio ref={eatAudioRef} src={EAT_SOUND_SRC} preload="auto" />
            
            {(!isDialogueActive || 
              currentNode === 'FirstFeeding_01' || 
              currentNode === 'FirstFeeding_02' ||
              currentNode === 'AfterFirstEvolution_01' ||
              currentNode === 'AfterFirstEvolution_02' ||
              currentNode === 'AfterFirstEvolution_03' ||
              currentNode === 'AfterFirstEvolution_04' ||
              currentNode === 'AfterFirstEvolution_05') && (
                <>
                    <div className="resources-container">
                        <div className="food-display">
                            Food: {food}
                        </div>
                        <div className="coin-display">
                            Coins: {coins}
                        </div>
                    </div>

                    <button onClick={toggleMute} className="mute-button" title={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? <VolumeMuteIcon size={24} /> : <VolumeUpIcon size={24} />}
                    </button>

                    <div className="monster-display">
                        {renderMonster()}
                    </div>

                    {isVisible && (
                        <div className="yum-message">
                            Yummy!
                        </div>
                    )}

                    <div className="action-buttons">
                        <a className="Feed_Button" onClick={Feed}>Feed</a>
                        {showShopButton && (
                            <a onClick={() => {navigate("/shop")}} className="Shop_Button">Shop</a>
                        )}
                        {showFightButton && (
                            <a onClick={() => {navigate("/fight")}} className="Fight_Button">Fight</a>
                        )}
                    </div>
                </>
            )}

            {/* Render Dialogue so dialogue can appear on this page */}
            <Dialogue onAction={handleDialogueAction} />
            
        </ScreenLayout>
    );
}