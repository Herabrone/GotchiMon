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


// --- hatching sequence ---
const eggPhases = [
    [
    "/assets/sprites/egg/egg.gif",
    "/assets/sprites/egg/egg-1/egg-crack-1.gif",
    "/assets/sprites/egg/egg-1/egg-crack-2.gif",
    "/assets/sprites/egg/egg-1/egg-crack-3.gif",
    "/assets/sprites/first_evo/Blue_Slime.png"
    ],

    [
    "/assets/sprites/egg/egg-2/egg-2.png",
    "/assets/sprites/egg/egg-2/egg-2-crack-1.png",
    "/assets/sprites/egg/egg-2/egg-2-crack-2.png",
    "/assets/sprites/egg/egg-2/egg-2-crack-2.png",
    "/assets/sprites/first_evo/Red_Slime.png"
    ],

    [
    "/assets/sprites/egg/egg-3/egg-3.png",
    "/assets/sprites/egg/egg-3/egg-3-crack-1.png",
    "/assets/sprites/egg/egg-3/egg-3-crack-1.png",
    "/assets/sprites/egg/egg-3/egg-3-crack-2.png",
    "/assets/sprites/first_evo/Gray_Slime.png"
    ],
]
const hatchPhaseCount = eggPhases[0].length;

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
        { id: 1, name: "Egg 1", still: egg1, descent: egg1Descent },
        { id: 2, name: "Egg 2", still: egg2, descent: egg2Descent },
        { id: 3, name: "Egg 3", still: egg3, descent: egg3Descent }
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
        if (phaseIndex >= hatchPhaseCount - 1) return;

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

                    if (next === hatchPhaseCount - 1) {
                        new Audio(hatchSound).play();
                        // Wait 2 seconds then navigate
                        setTimeout(() => {
                            setIsHatching(false);
                            advanceDialogue('Base1');
                            setIsDialogueActive(true);
                            navigate('/base');
                        }, 2000);
                    }

                    if (next >= hatchPhaseCount) {
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
                    if (!isHovering[i]) return "still";
                    return state === "still" ? "descent" : "still";
                })
            );
        }, 300);
        return () => clearInterval(interval);
    }, [isHovering]);

    const getEggSprite = (i) => {
        const egg = eggs[i];
        const state = bounceState[i];

        if (!isHovering[i]) return egg.still;
        if (state === "descent") return egg.descent;

        return egg.still;
    };

    return (
        <ScreenLayout>
            <audio ref={audioRef} src={IDLE_MUSIC_SRC} preload="auto" /> 
            <div className={`page-container ${shake ? "shake" : ""}`}>
                {/* --- HATCHING SCREEN --- */}
                {isHatching && (
                    <div className="egg-hatching-container">
                        <img
                            src={eggPhases[selectedEggIndex][phaseIndex]}
                            className="egg-hatching-sprite selected-egg-img"
                            alt="egg hatching"
                        />
                        <p className="hatch-instructions">
                            {phaseIndex < hatchPhaseCount - 1
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
                            {eggs.map((egg, index) => (
                                <div
                                    className="egg-container"
                                    key={index}
                                    onMouseEnter={() => setIsHovering(prev => {
                                        const arr = [...prev];
                                        arr[index] = true;
                                        return arr;
                                    })}
                                    onMouseLeave={() => setIsHovering(prev => {
                                        const arr = [...prev];
                                        arr[index] = false;
                                        return arr;
                                    })}
                                    onClick={() => selectEgg(index)}
                                >
                                    <div className={`egg-fixed-box ${bounceState[index] === "descent" ? "egg-descent" : ""}`}>
                                        <img src={getEggSprite(index)} alt={egg.name} className="egg-sprite" />
                                    </div>
                                    <span>{egg.name}</span>
                                </div>
                            ))}
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