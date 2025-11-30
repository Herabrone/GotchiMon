import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";
import { updateLocalStorage } from '../../utils/localStorage';
import './Fight.css';
import { shopItems2 } from '../../data/ShopData';

const FIGHT_BGM = '/../../../public/assets/sfx/bg-music/fight-scene/fight.mp3';
const ATTACK_SFX = '/../../../public/assets/sfx/fight/attack.mp3';
const DEATH_SFX = '/../../../public/assets/sfx/fight/death.mp3';

export default function Fight() {
    const navigate = useNavigate();
    const { advanceDialogue, setIsDialogueActive } = useDialogue();

    const [isAttacking, setIsAttacking] = useState(false);
    const [enemyHurt, setEnemyHurt] = useState(false);
    const [enemyVisible, setEnemyVisible] = useState(true);
    const [shake, setShake] = useState(false);
    const [canAttack, setCanAttack] = useState(true);
    
    // Audio refs
    const bgmRef = useRef(null);
    const attackSfxRef = useRef(null);
    const deathSfxRef = useRef(null);
    
    // Use ref to prevent multiple attack sequences
    const isAttackInProgress = useRef(false);

    // Initialize audio and fight dialogue on mount
    useEffect(() => {
        // Initialize audio elements
        bgmRef.current = new Audio(FIGHT_BGM);
        attackSfxRef.current = new Audio(ATTACK_SFX);
        deathSfxRef.current = new Audio(DEATH_SFX);

        // Play background music
        if (bgmRef.current) {
            bgmRef.current.loop = true;
            bgmRef.current.volume = 0.5;
            bgmRef.current.play().catch(e => {
                console.warn("Fight BGM failed to play:", e);
            });
        }

        // Initialize dialogue
        setIsDialogueActive(true);
        advanceDialogue('FightBegin');
        
        return () => {
            // Cleanup: stop all audio
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current.currentTime = 0;
            }
            if (attackSfxRef.current) {
                attackSfxRef.current.pause();
            }
            if (deathSfxRef.current) {
                deathSfxRef.current.pause();
            }
            setIsDialogueActive(false);
        };
    }, []);

    const handleAttack = () => {
        if (!canAttack || isAttackInProgress.current) {
            return;
        }
        
        isAttackInProgress.current = true;
        setCanAttack(false);
        setIsAttacking(true);

        // Play attack sound
        if (attackSfxRef.current) {
            attackSfxRef.current.currentTime = 0;
            attackSfxRef.current.volume = 0.7;
            attackSfxRef.current.play().catch(e => console.error("Attack SFX error:", e));
        }
    
        // End dash → trigger hurt
        setTimeout(() => {
            setIsAttacking(false);
            setEnemyHurt(true);

            setShake(true);
            setTimeout(() => setShake(false), 250);
        }, 800);
    
        // Play death sound and show victory
        setTimeout(() => {
            // Play death sound
            if (deathSfxRef.current) {
                deathSfxRef.current.currentTime = 0;
                deathSfxRef.current.volume = 0.7;
                deathSfxRef.current.play().catch(e => console.error("Death SFX error:", e));
            }

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
            // Check if this is the first fight completion
            const hasCompletedFirstFight = localStorage.getItem('hasCompletedFirstFight');
            if (!hasCompletedFirstFight || hasCompletedFirstFight === 'false') {
                localStorage.setItem('returnedFromFirstFight', 'true');
            }
            navigate('/base');
        } else if (action === "RewardCoin") {
            const currCoins = Number(localStorage.getItem("coins"));

            // update coins
            updateLocalStorage("coins", currCoins + 1);

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
                        </div>
                    )}
                </div>

                {/* Dialogue System */}
                <Dialogue onAction={handleDialogueAction} />
            </div>
        </ScreenLayout>
    );
}