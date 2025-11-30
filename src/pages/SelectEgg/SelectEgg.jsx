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

export default function SelectEgg() {
    const navigate = useNavigate();

    const eggs = [
        { name: "Egg 1", image: egg1 },
        { name: "Egg 2", image: egg2 },
        { name: "Egg 3", image: egg3 }
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

    const getRandomThreshold = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const selectEgg = (eggNumber) => {
        setSelectedEggIndex(eggNumber);
        if (eggNumber === 0) advanceDialogue("EggSelected1_0");
        if (eggNumber === 1) advanceDialogue("EggSelected2_0");
        if (eggNumber === 2) advanceDialogue("EggSelected3_0");
        setIsDialogueActive(true);
    };

    const handleKey = useCallback(
        (e) => {
            if (!isHatching) return;
            if (e.code !== "Space") return;

            // Prevent further input if final phase (blue slime) is showing
            if (phaseIndex >= eggPhases.length - 1) return;

            // Small shake for every press
            setShake(true);
            setTimeout(() => setShake(false), 100);

            // Play crack sound for feedback
            new Audio(crack1).play();

            setPressCount((prevCount) => {
                const newCount = prevCount + 1;

                if (newCount >= pressThreshold) {
                    setPhaseIndex((prevPhase) => {
                        const nextPhase = prevPhase + 1;

                        // Bigger shake on phase advance
                        setShake(true);
                        setTimeout(() => setShake(false), 300);

                        // Play hatch sound only for the final phase (blue slime)
                        if (nextPhase === eggPhases.length - 1) {
                            new Audio(hatchSound).play();
                        }

                        // Finished all phases → stop hatching & navigate
                        if (nextPhase >= eggPhases.length) {
                            setIsHatching(false);
                            setTimeout(() => navigate("/base"), 800);
                            return prevPhase;
                        }

                        // Reset press count and random threshold for next phase
                        setPressCount(0);
                        setPressThreshold(getRandomThreshold(10, 20));

                        return nextPhase;
                    });
                }

                return newCount;
            });
        },
        [isHatching, pressThreshold, phaseIndex, navigate]
    );

    useEffect(() => {
        if (!isHatching) return;

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isHatching, handleKey]);

    const handleDialogueAction = (action) => {
        if (action === "HatchEgg") {
            setIsHatching(true);
            setPhaseIndex(0);
            setPressCount(0);
            setPressThreshold(getRandomThreshold(10, 20)); // initialize first phase threshold
        }
    };

    return (
        <ScreenLayout>
            <div className={`page-container ${shake ? "shake" : ""}`}>
                {isHatching && (
                    <div className="egg-hatching-container">
                        <img
                            src={eggPhases[phaseIndex]}
                            className="egg-hatching-sprite selected-egg-img"
                            alt="egg hatching"
                        />
                        <p className="hatch-instructions">
                            {phaseIndex < eggPhases.length - 1
                                ? `Keep pressing SPACE to hatch… (${pressCount}/${pressThreshold})`
                                : "Your Gotchimon hatched!"}
                        </p>
                    </div>
                )}

                {!isDialogueActive && !isHatching && (
                    <>
                        <h2 className="egg-select-title">Select an Egg!</h2>
                        <div className="egg-select-container">
                            {eggs.map((egg, index) => (
                                <div className="egg-container" onClick={() => selectEgg(index)} key={index}>
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

                {isDialogueActive && !isHatching && (
                    <img src={eggs[selectedEggIndex].image} className="selected-egg-img" />
                )}

                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    );
}
