import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react';
import './Evolution.css';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";

// Import sprites - matching Base.jsx import paths
import babyIdle from '../../../public/assets/sprites/first_evo/Baby_Monster_Idle.png';
import dudeIdle from '../../../public/assets/sprites/second_evo/Dude_Monster_Idle_4.png';
import goodMonster from '../../../public/assets/sprites/third_evo/Good_Monster_Idle.png';
import badMonster from '../../../public/assets/sprites/third_evo/Bad_Monster_Idle.png';

// Sound effects
const EVOLVE_SOUND = '/../../../public/assets/sfx/evolution/evolve.mp3';
const SUCCESS_SOUND = '/../../../public/assets/sfx/evolution/success.mp3';

export default function Evolution() {
    const navigate = useNavigate();
    const { currentNode, advanceDialogue, isDialogueActive, setIsDialogueActive } = useDialogue();
    
    const [monsterState, setMonsterState] = useState(1);
    const [currentSprite, setCurrentSprite] = useState(babyIdle);
    const [hasEvolved, setHasEvolved] = useState(false);
    const [useAnimatedSprite, setUseAnimatedSprite] = useState(true);

    const evolveAudioRef = useRef(null);
    const successAudioRef = useRef(null);

    // Load current monster state and set initial sprite
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('monster_state')) || 1;
        setMonsterState(savedState);
        
        console.log('Evolution page loaded. Monster state:', savedState);
        console.log('Current dialogue node:', currentNode);
        console.log('Is dialogue active?', isDialogueActive);
        
        // Make sure dialogue is active when we arrive
        if (!isDialogueActive) {
            console.log('Activating dialogue...');
            setIsDialogueActive(true);
        }
        
        // Set sprite based on current state (before evolution)
        if (savedState === 1) {
            setCurrentSprite(babyIdle);
            setUseAnimatedSprite(true); // Baby uses CSS animation
        } else if (savedState === 2) {
            setCurrentSprite(dudeIdle);
            setUseAnimatedSprite(true); // Dude uses CSS animation
        }
    }, []);

    // Initialize audio
    useEffect(() => {
        evolveAudioRef.current = new Audio(EVOLVE_SOUND);
        successAudioRef.current = new Audio(SUCCESS_SOUND);
        
        return () => {
            if (evolveAudioRef.current) {
                evolveAudioRef.current.pause();
                evolveAudioRef.current = null;
            }
            if (successAudioRef.current) {
                successAudioRef.current.pause();
                successAudioRef.current = null;
            }
        };
    }, []);

    // Trigger evolution when dialogue reaches Evolution1_0 or Evolution2_0
    useEffect(() => {
        console.log('Current node changed to:', currentNode);
        
        if ((currentNode === 'Evolution1_0' || currentNode === 'Evolution2_0') && !hasEvolved) {
            console.log('Triggering evolution at node:', currentNode);
            setHasEvolved(true);
            
            // Play evolve sound
            if (evolveAudioRef.current) {
                evolveAudioRef.current.volume = 0.5;
                evolveAudioRef.current.play().catch(() => {
                    console.log('Could not play evolve sound');
                });
            }
            
            // Wait a moment, then evolve
            setTimeout(() => {
                evolveMonster();
            }, 1500);
        }
    }, [currentNode, hasEvolved]);

    const evolveMonster = () => {
        const newState = monsterState + 1;
        console.log('Evolving! Old state:', monsterState, '→ New state:', newState);
        
        // Stop evolve sound
        if (evolveAudioRef.current) {
            evolveAudioRef.current.pause();
            evolveAudioRef.current.currentTime = 0;
        }
        
        // Play success sound
        if (successAudioRef.current) {
            successAudioRef.current.volume = 0.5;
            successAudioRef.current.play().catch(() => {
                console.log('Could not play success sound');
            });
        }
        
        if (newState === 2) {
            // First evolution: baby -> dude
            setCurrentSprite(dudeIdle);
            setUseAnimatedSprite(true); // Dude uses CSS animation
            console.log('Evolved to Dude Monster');
        } else if (newState === 3) {
            // Second evolution: dude -> good/bad
            const alignment = localStorage.getItem('monsterAlignment') || 'good';
            setCurrentSprite(alignment.includes("good") ? goodMonster : badMonster);
            setUseAnimatedSprite(true); // Final forms use CSS animation
            console.log('Evolved to final form:', alignment);
        }
        
        // Save new state
        localStorage.setItem('monster_state', JSON.stringify(newState));
        setMonsterState(newState);
        
        // Advance to "evolved!" dialogue after sprite changes
        setTimeout(() => {
            if (newState === 2) {
                advanceDialogue('Evolution1_1');
            } else if (newState === 3) {
                advanceDialogue('Evolution2_1');
            }
        }, 1000);
    };

    // Handle dialogue actions
    const handleDialogueAction = (action) => {
        console.log('Dialogue action received:', action);
        
        if (action === 'returnToBase') {
            console.log('Returning to base...');
            navigate('/base');
        }
    };

    // Render the appropriate sprite
    const renderSprite = () => {
        if (monsterState === 1 && useAnimatedSprite) {
            // Baby slime with CSS animation
            return <div className="baby-slime-evolution-sprite"></div>;
        } else if (monsterState === 2 && useAnimatedSprite) {
            // Dude monster with CSS animation
            return <div className="dude-evolution-sprite"></div>;
        } else if (monsterState === 3 && useAnimatedSprite) {
            // Final form with CSS animation
            const alignment = localStorage.getItem('monsterAlignment') || 'good';
            return <div className={alignment.includes("good") ? 'good-evolution-sprite' : 'bad-evolution-sprite'}></div>;
        }
        
        // Fallback to static image
        return (
            <img 
                src={currentSprite} 
                alt="Gotchimon" 
                className="evolution-sprite-static"
            />
        );
    };

    return (
        <ScreenLayout>
            <div className="evolution-container">
                <div className="evolution-sprite-container">
                    {renderSprite()}
                </div>
            </div>

            {/* Render dialogue system */}
            <Dialogue onAction={handleDialogueAction} />
        </ScreenLayout>
    );
}