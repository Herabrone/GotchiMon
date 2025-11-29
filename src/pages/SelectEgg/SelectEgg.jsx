import "./SelectEgg.css";
import { useDialogue } from "../../utils/dialogueContext";
import Dialogue from '../../components/Dialogue';

import { useNavigate } from "react-router-dom";
import ScreenLayout from '../../components/screenlayout';

export default function SelectEgg() {

    const navigate = useNavigate();

    const eggs = [
        {name: "Egg 1", image: "image1"},
        {name: "Egg 2", image: "image2"},
        {name: "Egg 3", image: "image3"}
    ]
    const { advanceDialogue, setIsDialogueActive, isDialogueActive } = useDialogue();

    const selectEgg = (eggNumber) => {
        // Logic to select the egg and trigger the appropriate dialogue node
        if (eggNumber === 1) {
            // move dialogue to the EggSelected1_0 node and show it
            advanceDialogue('EggSelected1_0');
            setIsDialogueActive(true);
        }
    };

    const handleDialogueAction = (action) => {
        if (action === 'HatchEgg') {
            // TODO: add egg hatching effects here
            // After the hatching/dialogue finishes navigate to base
            navigate('/base');
        }
    };

    return (
        <ScreenLayout>
            <div className="page-container">

                {!isDialogueActive && (
                    <>
                        <h1 className="egg-select-title">Select an Egg!</h1>

                        <div className="egg-select-container">
                    
                            {eggs.map((egg) => (
                                <div className="egg-container" onClick={() => selectEgg(1)}>
                                    {/*have all eggs be option 1 for now we can change the number to indicate the different paths the users can go down*/}
                                    <span>{egg.image}</span>
                                    <span>{egg.name}</span>
                                </div>
                            ))}

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