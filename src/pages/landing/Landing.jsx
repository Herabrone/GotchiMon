import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";

import './Landing.css';
import { shopItems } from '../../data/ShopData';
import { coins } from '../../data/UserData';
import { food } from '../../data/UserData';

export default function Landing() {
    const { setIsDialogueActive, resetDialogue, isDialogueActive, advanceDialogue } = useDialogue();
    const navigate = useNavigate();

    // Start dialogue when user clicks Start by resetting the dialogue
    const startDialogue = () => {
        initializeLocalStorage();
        // reset to 'start' node and activate the dialogue
        if (typeof resetDialogue === 'function') {
            resetDialogue();
        } else {
            setIsDialogueActive(true);
        }
    };

    const handleDialogueAction = (action) => {
        if (action === "SelectEgg") {
            advanceDialogue();
            navigate("/select-egg"); 
        }
    };

    function initializeLocalStorage() {
        localStorage.clear();

        // initializing store
        localStorage.setItem("shopItems", JSON.stringify(shopItems));

        // initializing coins
        localStorage.setItem("coins", JSON.stringify(coins));

        // initializing food
        localStorage.setItem("food", JSON.stringify(1));
        
        // initializing monster state
        localStorage.setItem("monster_state", JSON.stringify(1));
    }

    return (
        <ScreenLayout>
            <div className="landing-container">
                <h1 className="gotchimon-title">GotchiMon</h1>

                {/* Show controls only when dialogue is not active */}
                {!isDialogueActive && (
                    <button onClick={startDialogue} className="start-button">
                        Start
                    </button>
                )}

                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    )
}