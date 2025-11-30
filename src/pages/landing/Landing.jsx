import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";

import './Landing.css';
import { shopItems } from '../../data/ShopData';
import { coins } from '../../data/UserData';

export default function Landing() {
    const { setIsDialogueActive, resetDialogue, isDialogueActive } = useDialogue();
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
           navigate("/select-egg");
        }
    };

    function initializeLocalStorage() {
        // initialize store
        localStorage.clear();
        localStorage.setItem("shopItems", JSON.stringify(shopItems));
        localStorage.setItem("coins", JSON.stringify(coins));
    }

    return (
        <ScreenLayout>
            <h1 className="gotchimon-title">GotchiMon</h1>

            {/* Show controls only when dialogue is not active */}
            
            {!isDialogueActive && (
                <>
                    <div className='start-button'>
                        <a onClick={startDialogue} className="start">Start</a>
                    </div>

                    <div className='exit-button'>
                        <a onClick={() => {navigate("/")}} className="exit">Exit</a>
                    </div>
                </>
            )}

            <Dialogue onAction={handleDialogueAction} />
        </ScreenLayout>
    )
}