import { useNavigate } from 'react-router-dom';
import { useRef } from 'react'; 
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";

import './Landing.css';
import { shopItems } from '../../data/ShopData';
import { coins } from '../../data/UserData';
import { food } from '../../data/UserData';

const IDLE_MUSIC_SRC = '../../../public/assets/sfx/bg-music/idle/idle.mp3'; 

export default function Landing() {
    const { setIsDialogueActive, resetDialogue, isDialogueActive, advanceDialogue } = useDialogue();
    const navigate = useNavigate();

    const audioRef = useRef(null); 

    // Function to play the music on the first user interaction
    const playIdleMusic = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.loop = true;
            audio.volume = 0.5;
            // Play is called on the user action
            audio.play().catch(e => console.warn("Initial music playback failed:", e));
        }
    };

    // Start dialogue when user clicks Start by resetting the dialogue
    const startDialogue = () => {
        // Start the music loop
        playIdleMusic(); 

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
            <audio ref={audioRef} src={IDLE_MUSIC_SRC} preload="auto" />

            <div className="landing-container">
                <h1 className="gotchimon-title">gotchimon</h1>

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