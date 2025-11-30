import "./SelectEgg.css";
import { useDialogue } from "../../utils/dialogueContext";
import Dialogue from "../../components/Dialogue";
import { useNavigate } from "react-router-dom"; 
import ScreenLayout from "../../components/screenlayout";
import { useState, useEffect, useCallback, useRef } from "react";
import { updateLocalStorage } from "../../utils/localStorage";

// --- EGG 1 ---
import egg1 from "../../../public/assets/sprites/egg/egg-1/egg-1.png";
import egg1Descent from "../../../public/assets/sprites/egg/egg-1/egg-bounce-descent.png";

// --- EGG 2 ---
import egg2 from "../../../public/assets/sprites/egg/egg-2/egg-2.png";
import egg2Descent from "../../../public/assets/sprites/egg/egg-2/egg-2-bounce-descent.png";

// --- EGG 3 ---
import egg3 from "../../../public/assets/sprites/egg/egg-3/egg-3.png";
import egg3Descent from "../../../public/assets/sprites/egg/egg-3/egg-3-bounce-descent.png";

import crack1 from "../../../public/assets/sfx/egg-hatch/egg_crack.mp3";
import hatchSound from "../../../public/assets/sfx/egg-hatch/hatch_success.mp3";


// --- STATIC hatching sequence (We only use the final sprite here) ---
const finalMonsterSprite = "/assets/sprites/first_evo/Blue_Slime.png"; 

// We'll simulate the crack phases visually using the base image and shake effect,
// only swapping to the monster at the end.
// We keep an array length of 5 for phase indexing (0, 1, 2, 3, 4)
const PHASE_COUNT = 5;

const IDLE_MUSIC_SRC = '/../../../public/assets/sfx/bg-music/idle/idle.mp3';

export default function SelectEgg() {
    const navigate = useNavigate();
    const { advanceDialogue, setIsDialogueActive, isDialogueActive, currentNode } = useDialogue();

    const audioRef = useRef(null); 
    
    useEffect(() => {
        const audio = audioRef.current;

        const playMusic = () => {
            if (audio) {
                audio.loop = true;
                audio.volume = 0.5; 
                audio.currentTime = 0; 

                audio.play().catch(e => {
                    console.warn("Select Egg Page BGM failed to play automatically:", e);
                });
            }
        };

        playMusic();

        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, []); 

    const eggs = [
        { name: "Egg 1", still: egg1, descent: egg1Descent, isAvailable: true },
        { name: "Egg 2", still: egg2, descent: egg2Descent, isAvailable: false }, // Locked (DLC)
        { name: "Egg 3", still: egg3, descent: egg3Descent, isAvailable: false } // Locked (DLC)
    ];

    const [selectedEggIndex, setSelectedEggIndex] = useState(0);
    const [isHovering, setIsHovering] = useState([false, false, false]);
    const [bounceState, setBounceState] = useState(["still", "still", "still"]);

    // --- Hatching state ---
    const [isHatching, setIsHatching] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [shake, setShake] = useState(false);

    // --- Press state (Game Mechanic) ---
    const [pressCount, setPressCount] = useState(0);
    const [pressThreshold, setPressThreshold] = useState(0);

    const getRandomThreshold = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const selectEgg = (eggNumber) => {
        // Prevent selection if the egg is not available (locked)
        if (!eggs[eggNumber].isAvailable) {
            console.log(`Egg ${eggNumber + 1} is locked!`);
            return; 
        }

        setSelectedEggIndex(eggNumber);

        // Advance dialogue based on selection
        if (eggNumber === 0) advanceDialogue("EggSelected1_0");
        if (eggNumber === 1) advanceDialogue("EggSelected2_0");
        if (eggNumber === 2) advanceDialogue("EggSelected3_0");

        updateLocalStorage("myEgg", eggs[eggNumber]);
        
        // FIX for triple-click issue: Delay dialogue activation slightly.
        setTimeout(() => {
            setIsDialogueActive(true);
        }, 50); 
    };

    const handleKey = useCallback((e) => {
        // Only run if hatching and space is pressed
        if (!isHatching || e.code !== "Space") return;
        
        // Don't process if already at the end
        if (phaseIndex >= PHASE_COUNT - 1) return; // Use PHASE_COUNT

        setShake(true);
        setTimeout(() => setShake(false), 100);
        new Audio(crack1).play();

        setPressCount((prev) => {
            const newCount = prev + 1;

            if (newCount >= pressThreshold) {
                // Threshold met, advance to next crack phase
                setPhaseIndex((prevPhase) => {
                    const next = prevPhase + 1;

                    setShake(true);
                    setTimeout(() => setShake(false), 300);

                    if (next === PHASE_COUNT - 1) { // Check against PHASE_COUNT
                        new Audio(hatchSound).play();
                        // Wait 2 seconds then navigate
                        setTimeout(() => {
                            setIsHatching(false);
                            advanceDialogue('Base1');
                            setIsDialogueActive(true);
                            navigate('/base');
                        }, 2000);
                    }

                    if (next >= PHASE_COUNT) { // Check against PHASE_COUNT
                        return prevPhase;
                    }

                    // Reset counters for next phase
                    setPressCount(0);
                    setPressThreshold(getRandomThreshold(10, 20));
                    return next;
                });
            }
            return newCount;
        });
    }, [isHatching, pressThreshold, phaseIndex, navigate]);

    // Attach Key Listener for Hatching
    useEffect(() => {
        if (!isHatching) return;
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isHatching, handleKey]);

    // When dialogue advances to Base1, navigate to the base page
    useEffect(() => {
        if (currentNode === 'Base1') {
            navigate('/base');
        }
    }, [currentNode, navigate]);

    const handleDialogueAction = (action) => {
        if (action === "HatchEgg") {
            // Only start hatching if not already hatching
            if (!isHatching) {
                setIsDialogueActive(false);
                setIsHatching(true);
                setPhaseIndex(0);
                setPressCount(0);
                setPressThreshold(getRandomThreshold(10, 20));
            }
        }
    };

    // --- Bounce Animation Loop ---
    useEffect(() => {
        const interval = setInterval(() => {
            setBounceState((prev) =>
                prev.map((state, i) => {
                    // Only bounce if hovering AND egg is available
                    if (!isHovering[i] || !eggs[i].isAvailable) return "still"; 
                    return state === "still" ? "descent" : "still";
                })
            );
        }, 300);
        return () => clearInterval(interval);
    }, [isHovering, eggs]);

    const getEggSprite = (i) => {
        const egg = eggs[i];
        const state = bounceState[i];

        if (!isHovering[i] || !egg.isAvailable) return egg.still;
        if (state === "descent") return egg.descent;

        return egg.still;
    };

    let currentHatchingSprite = "";
    if (isHatching) {
        if (phaseIndex < PHASE_COUNT - 1) {
            // Use the still sprite of the selected egg for all cracking phases
            currentHatchingSprite = eggs[selectedEggIndex].still;
        } else if (phaseIndex === PHASE_COUNT - 1) {
            // Use the final monster sprite
            currentHatchingSprite = finalMonsterSprite;
        }
    }


    return (
        <ScreenLayout>
            <audio ref={audioRef} src={IDLE_MUSIC_SRC} preload="auto" /> 
            <div className={`page-container ${shake ? "shake" : ""}`}>
                {/* --- HATCHING SCREEN --- */}
                {isHatching && (
                    <div className="egg-hatching-container">
                        <img
                            // Source is now determined dynamically based on phaseIndex
                            src={currentHatchingSprite} 
                            className="egg-hatching-sprite selected-egg-img"
                            alt="egg hatching"
                        />
                        <p className="hatch-instructions">
                            {phaseIndex < PHASE_COUNT - 1 // Check against PHASE_COUNT
                                ? `Keep pressing SPACE to hatch… (${pressCount}/${pressThreshold})`
                                : "Your Gotchimon hatched!"}
                        </p>
                    </div>
                )}

                {/* --- SELECTION SCREEN --- */}
                {!isDialogueActive && !isHatching && (
                    <>
                        <h2 className="egg-select-title">Select an Egg!</h2>
                        <div className="egg-select-container">
                            {eggs.map((egg, index) => {
                                const isLocked = !egg.isAvailable;
                                return (
                                <div
                                    className={`egg-container ${isLocked ? 'egg-locked' : ''}`}
                                    key={index}
                                    // Only allow hover/bounce on unlocked eggs
                                    onMouseEnter={!isLocked ? () => setIsHovering(prev => {
                                        const arr = [...prev];
                                        arr[index] = true;
                                        return arr;
                                    }) : null}
                                    onMouseLeave={!isLocked ? () => setIsHovering(prev => {
                                        const arr = [...prev];
                                        arr[index] = false;
                                        return arr;
                                    }) : null}
                                    // Only allow click on unlocked eggs
                                    onClick={() => !isLocked && selectEgg(index)}
                                >
                                    {isLocked && <span className="egg-locked-text">DLC Available!</span>} 
                                    <div className={`egg-fixed-box ${!isLocked && bounceState[index] === "descent" ? "egg-descent" : ""}`}>
                                        <img src={getEggSprite(index)} alt={egg.name} className="egg-sprite" />
                                    </div>
                                    <span>{egg.name}</span>
                                </div>
                            )})}
                        </div>
                        <div className="action-container">
                            <a onClick={() => navigate("/")} className="egg-select-back">Nevermind</a>
                        </div>
                    </>
                )}

                {/* --- DIALOGUE ACTIVE --- */}
                {isDialogueActive && !isHatching && (
                    <img src={eggs[selectedEggIndex].still} className="selected-egg-img" alt="selected egg" />
                )}

                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    );
}