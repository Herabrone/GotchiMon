import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import './Evolution.css';
import ScreenLayout from '../../components/screenlayout';
import Dialogue from '../../components/Dialogue';
import { useDialogue } from "../../utils/dialogueContext";

// Import sprites - matching Base.jsx import paths
import babyIdle from '../../../public/assets/sprites/first_evo/Blue_Slime.png';
import dudeIdle from '../../../public/assets/sprites/second_evo/Dude_Monster_Idle_4.png';
import goodMonster from '../../../public/assets/sprites/third_evo/Good_monster_Idle.png';
import badMonster from '../../../public/assets/sprites/third_evo/Bad_Monster_Idle.png';

export default function Evolution() {
    const navigate = useNavigate();
    const { currentNode, advanceDialogue, isDialogueActive, setIsDialogueActive } = useDialogue();
    
    const [monsterState, setMonsterState] = useState(1);
    const [currentSprite, setCurrentSprite] = useState(babyIdle);
    const [hasEvolved, setHasEvolved] = useState(false);

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
        } else if (savedState === 2) {
            setCurrentSprite(dudeIdle);
        }
    }, []);

    // Trigger evolution when dialogue reaches Evolution1_0 or Evolution2_0
    useEffect(() => {
        console.log('Current node changed to:', currentNode);
        
        if ((currentNode === 'Evolution1_0' || currentNode === 'Evolution2_0') && !hasEvolved) {
            console.log('Triggering evolution at node:', currentNode);
            setHasEvolved(true);
            
            // Wait a moment, then evolve
            setTimeout(() => {
                evolveMonster();
            }, 1500);
        }
    }, [currentNode, hasEvolved]);

    const evolveMonster = () => {
        const newState = monsterState + 1;
        console.log('Evolving! Old state:', monsterState, '→ New state:', newState);
        
        if (newState === 2) {
            // First evolution: baby -> dude
            setCurrentSprite(dudeIdle);
            console.log('Evolved to Dude Monster');
        } else if (newState === 3) {
            // Second evolution: dude -> good/bad
            const alignment = localStorage.getItem('monster_alignment') || 'good';
            setCurrentSprite(alignment === 'good' ? goodMonster : badMonster);
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

    return (
        <ScreenLayout>
            <div className="evolution-container">
                <div className="evolution-sprite-container">
                    <img 
                        src={currentSprite} 
                        alt="Gotchimon" 
                        className="evolution-sprite"
                    />
                </div>
            </div>

            {/* Render dialogue system */}
            <Dialogue onAction={handleDialogueAction} />
        </ScreenLayout>
    );
}