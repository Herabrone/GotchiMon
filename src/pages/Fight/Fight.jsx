import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";
import { updateLocalStorage } from '../../utils/localStorage';
import './Fight.css';
import { shopItems2 } from '../../data/ShopData';

export default function Fight() {
    const navigate = useNavigate();
    const { advanceDialogue, setIsDialogueActive } = useDialogue();

    const [isAttacking, setIsAttacking] = useState(false);
    const [enemyHurt, setEnemyHurt] = useState(false);
    const [enemyVisible, setEnemyVisible] = useState(true);
    const [shake, setShake] = useState(false);
    const [canAttack, setCanAttack] = useState(true);
    
    // Use ref to prevent multiple attack sequences
    const isAttackInProgress = useRef(false);

    // Initialize fight dialogue on mount
    useEffect(() => {
        setIsDialogueActive(true);
        advanceDialogue('FightBegin');
        
        return () => {
            setIsDialogueActive(false);
        };
    }, []); // Empty deps - only run on mount/unmount

    const handleAttack = () => {
        if (!canAttack || isAttackInProgress.current) {
            return;
        }
        
        isAttackInProgress.current = true;
        setCanAttack(false);
        setIsAttacking(true);
    
        // End dash → trigger hurt
        setTimeout(() => {
            setIsAttacking(false);
            setEnemyHurt(true);

            setShake(true);
            setTimeout(() => setShake(false), 250);
        }, 800);
    
        // Allow hurt animation to render, then show victory
        setTimeout(() => {
            setEnemyVisible(false);
            isAttackInProgress.current = false;
            
            // Use setTimeout to ensure state updates are complete
            setTimeout(() => {
                advanceDialogue('FightWon');
            }, 50);
        }, 1400);
    };

    const handleDialogueAction = (action, option) => {
        
        if (action === "Attack" && canAttack && !isAttackInProgress.current) {
            handleAttack();
        } else if (action === "ReturnToBase") {
            navigate('/base');
        } else if (action == "RewardCoin") {
            const currCoins = Number(localStorage.getItem("coins"));

            // update coins
            updateLocalStorage("coins", currCoins+1);

            // update shopItems
            updateLocalStorage("shopItems", shopItems2);
        }
    };

    /* Space key support */
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                const continueBtn = document.querySelector('.dialogue-options button');
                if (continueBtn) {
                    continueBtn.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <ScreenLayout>
            <div className="fight-container">

                <div className={`battle-area ${shake ? 'shake' : ''}`}>
                    {/* Player Monster */}
                    <div className={`player-monster ${isAttacking ? 'attacking' : ''}`}>
                        <div className="sprite dude-monster-idle"></div>
                    </div>

                    {/* Enemy Monster */}
                    {enemyVisible && (
                    <div className="enemy-monster">
                        <div
                            className={`sprite ${
                                enemyHurt
                                    ? 'pink-monster-hurt'
                                    : 'pink-monster-idle'
                            }`}
                        ></div>
                    </div> )}
                </div>

                {/* Dialogue System */}
                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    );
}