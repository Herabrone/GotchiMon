import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import "./SelectEgg.css";
import { useDialogue } from "../../utils/dialogueContext";
import Dialogue from '../../components/Dialogue';
import ScreenLayout from '../../components/screenlayout';

export default function SelectEgg() {

    const navigate = useNavigate();

    const { currentNode, advanceDialogue, setIsDialogueActive, isDialogueActive } = useDialogue();

    const selectEgg = (eggNumber) => {
        // Logic to select the egg and trigger the appropriate dialogue node
        if (eggNumber === 1) {
            // move dialogue to the EggSelected1_0 node and show it
            advanceDialogue('EggSelected1_0');
            //TODO: Maybe add more egg selections here if we have the time to do so
            setIsDialogueActive(true);
        }
    };

    // When dialogue advances to Base1, navigate to the base page
    useEffect(() => {
        if (currentNode === 'Base1') {
            navigate('/base');
        }
    }, [currentNode, navigate]);

    const handleDialogueAction = (action) => {
        if (action === 'HatchEgg') {
            // TODO: add egg hatching effects here
        }
    };

    return (
        <ScreenLayout>
            <div className="page-container">

                {!isDialogueActive && (
                    <>
                        <h1 className="egg-select-title">Select an Egg!</h1>

                        <div className="egg-select-container">

                        {/*have all eggs be option 1 for now we can change the number to indicate the different paths the users can go down*/}
                            <div>
                                <a onClick={() => {selectEgg(1)}} className="select-egg1">Egg 1</a>
                            </div>

                            <div>
                                <a onClick={() => {selectEgg(1)}} className="select-egg1">Egg 2</a>
                            </div>

                            <div>
                                <a onClick={() => {selectEgg(1)}} className="select-egg1">Egg 3</a>
                            </div>

                        </div>
                        <div className="action-container">
                            <a onClick={() => {navigate("/")}} className="egg-select-back">Nevermind</a>
                        </div>
                    </>
                )}

                {/* Render dialogue so the egg-hatching dialogue can appear on this page */}
                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    )
}