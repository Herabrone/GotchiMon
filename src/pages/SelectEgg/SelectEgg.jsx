import "./SelectEgg.css";
import { useDialogue } from "../../utils/dialogueContext";
import Dialogue from "../../components/Dialogue";

import { useNavigate } from "react-router-dom";
import ScreenLayout from "../../components/screenlayout";
import { useState, useEffect, useCallback } from "react";

// --- SOUND EFFECTS ---
import crack1 from "../../../public/assets/sfx/egg-hatch/egg_crack.mp3";
import hatchSound from "../../../public/assets/sfx/egg-hatch/hatch_success.mp3";

// --- STATIC egg phases ---
const eggPhases = [
    "/assets/sprites/egg/egg.gif",
    "/assets/sprites/egg/egg-crack-1.gif",
    "/assets/sprites/first-evo/Blue Slime.png"
];

const hatchSounds = [crack1, hatchSound];

export default function SelectEgg() {
    const navigate = useNavigate();

    const eggs = [
        { name: "Egg 1", image: "image1" },
        { name: "Egg 2", image: "image2" },
        { name: "Egg 3", image: "image3" }
    ];

    const { advanceDialogue, setIsDialogueActive, isDialogueActive } = useDialogue();

    // --- Hatching state ---
    const [isHatching, setIsHatching] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [shake, setShake] = useState(false);

    const selectEgg = (eggNumber) => {
        if (eggNumber === 1) {
            advanceDialogue("EggSelected1_0");
            setIsDialogueActive(true);
        }
    };

    // ----------------------------------------------------------
    // SPACEBAR HANDLER (React Compiler-safe)
    // ----------------------------------------------------------
    const handleKey = useCallback(
        (e) => {
            if (!isHatching) return;
            if (e.code !== "Space") return;

            setPhaseIndex((prev) => {
                const next = prev + 1;

                // Play correct audio
                const audio = new Audio(hatchSounds[prev]);
                audio.play();

                // Shake the screen on cracks
                if (prev < eggPhases.length - 1) {
                    setShake(true);
                    setTimeout(() => setShake(false), 300);
                }

                // Finished all hatch phases → navigate
                if (next >= eggPhases.length) {
                    setTimeout(() => navigate("/base"), 800);
                    return prev;
                }

                return next;
            });
        },
        [isHatching, navigate] // required by compiler
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
                            className="egg-hatching-sprite"
                            alt="egg hatching"
                        />
                        <p className="hatch-instruction">Press SPACE to hatch…</p>
                    </div>
                )}

                {/* Egg selection UI (only shown before dialogue/hatch) */}
                {!isDialogueActive && !isHatching && (
                    <>
                        <h1 className="egg-select-title">Select an Egg!</h1>

                        <div className="egg-select-container">
                            {eggs.map((egg) => (
                                <div
                                    key={egg.name}
                                    className="egg-container"
                                    onClick={() => selectEgg(1)}
                                >
                                    <span>{egg.image}</span>
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

                {/* Dialogue (trigger HatchEgg action) */}
                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    );
}
