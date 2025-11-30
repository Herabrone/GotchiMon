import "./SelectEgg.css";
import { useDialogue } from "../../utils/dialogueContext";
import Dialogue from "../../components/Dialogue";

import { useNavigate } from "react-router-dom";
import ScreenLayout from "../../components/screenlayout";
import { useState, useEffect, useCallback } from "react";

import egg1 from "../../../public/assets/sprites/egg/egg-1/egg-1.png";
import egg2 from "../../../public/assets/sprites/egg/egg-2/egg-2.png";
import egg3 from "../../../public/assets/sprites/egg/egg-3/egg-3.png";

// --- SOUND EFFECTS ---
import crack1 from "../../../public/assets/sfx/egg-hatch/egg_crack.mp3";
import hatchSound from "../../../public/assets/sfx/egg-hatch/hatch_success.mp3";

// --- STATIC egg phases ---
const eggPhases = [
    "/assets/sprites/egg/egg.gif",
    "/assets/sprites/egg/egg-crack-1.gif",
    "/assets/sprites/egg/egg-crack-2.gif",
    "/assets/sprites/egg/egg-crack-3.gif",
    "/assets/sprites/first_evo/Blue_Slime.png"
];

const hatchSounds = [crack1, hatchSound];

export default function SelectEgg() {
    const navigate = useNavigate();

    const eggs = [
        {name: "Egg 1", image: egg1},
        {name: "Egg 2", image: egg2},
        {name: "Egg 3", image: egg3}
    ];
    const [selectedEggIndex, setSelectedEggIndex] = useState(0);

    const { advanceDialogue, setIsDialogueActive, isDialogueActive } = useDialogue();

    // --- Hatching state ---
    const [isHatching, setIsHatching] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [shake, setShake] = useState(false);

    // --- Press tracking and RNG ---
    const [pressCount, setPressCount] = useState(0);
    const [pressThreshold, setPressThreshold] = useState(0);

    // Helper to generate random number between min and max (inclusive)
    const getRandomThreshold = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const selectEgg = (eggNumber) => {
        setSelectedEggIndex(eggNumber);
        if (eggNumber === 0) advanceDialogue("EggSelected1_0");
        if (eggNumber === 1) advanceDialogue("EggSelected2_0");
        if (eggNumber === 2) advanceDialogue("EggSelected3_0");
        setIsDialogueActive(true);
    };

    // ----------------------------------------------------------
    // SPACEBAR HANDLER
    // ----------------------------------------------------------
    const handleKey = useCallback(
        (e) => {
            if (!isHatching) return;
            if (e.code !== "Space") return;

            setPressCount((prevCount) => {
                const newCount = prevCount + 1;

                if (newCount >= pressThreshold) {
                    setPhaseIndex((prevPhase) => {
                        const nextPhase = prevPhase + 1;

                        // Play correct audio
                        const audio = new Audio(hatchSounds[prevPhase]);
                        audio.play();

                        // Shake the screen on cracks
                        if (prevPhase < eggPhases.length - 1) {
                            setShake(true);
                            setTimeout(() => setShake(false), 300);
                        }

                        // Finished all hatch phases → navigate
                        if (nextPhase >= eggPhases.length) {
                            setTimeout(() => navigate("/base"), 800);
                            return prevPhase;
                        }

                        // Reset press count and set new threshold for next phase
                        setPressCount(0);
                        setPressThreshold(getRandomThreshold(10, 20));

                        return nextPhase;
                    });
                }

                return newCount;
            });
        },
        [isHatching, pressThreshold, navigate]
    );

    // Add/remove key event listener
    useEffect(() => {
        if (!isHatching) return;

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isHatching, handleKey]);

    // ----------------------------------------------------------
    // Dialogue actions (trigger hatch)
    // ----------------------------------------------------------
    const handleDialogueAction = (action) => {
        if (action === "HatchEgg") {
            setIsHatching(true);
            setPhaseIndex(0);
            setPressCount(0);
            setPressThreshold(getRandomThreshold(10, 20)); // Initialize first phase threshold
        }
    };

    return (
        <ScreenLayout>
            <div className={`page-container ${shake ? "shake" : ""}`}>
                {/* Render hatching animation */}
                {isHatching && (
                    <div className="egg-hatching-container">
                        <img
                            src={eggPhases[phaseIndex]}
                            className="egg-hatching-sprite selected-egg-img"
                            alt="egg hatching"
                        />
                        <p className="hatch-instructions">
                            {phaseIndex < eggPhases.length - 1
                                ? "Press SPACE to hatch…"
                                : "Your Gotchimon hatched!"}
                        </p>
                    </div>
                )}

                {/* Egg selection UI (only shown before dialogue/hatch) */}
                {!isDialogueActive && !isHatching && (
                    <>
                        <h2 className="egg-select-title">Select an Egg!</h2>
                        <div className="egg-select-container">
                            {eggs.map((egg, index) => (
                                <div className="egg-container" onClick={() => selectEgg(index)}>
                                    <img src={egg.image} alt={egg.name} />
                                    <span>{egg.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="action-container">
                            <a onClick={() => navigate("/")} className="egg-select-back">
                                Nevermind
                            </a>
                        </div>
                    </>
                )}

                {isDialogueActive && (
                    <img src={eggs[selectedEggIndex].image} className="selected-egg-img" />
                )}

                {/* Dialogue (trigger HatchEgg action) */}
                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    );
}
