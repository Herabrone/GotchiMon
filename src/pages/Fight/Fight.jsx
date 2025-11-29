import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '../../components/screenlayout';
import TextWriter from '../../utils/TextWriter';
import './Fight.css';

export default function Fight() {
    const navigate = useNavigate();

    const [fightState, setFightState] = useState('begin');
    const [isAttacking, setIsAttacking] = useState(false);
    const [enemyHurt, setEnemyHurt] = useState(false);
    const [enemyVisible, setEnemyVisible] = useState(true);
    const [showText, setShowText] = useState(true);
    const [shake, setShake] = useState(false);

    const handleAttack = () => {
        if (fightState !== 'begin') return;
    
        setIsAttacking(true);
        setFightState('attacking');
        setShowText(false);
    
        // End dash → trigger hurt
        setTimeout(() => {
            setIsAttacking(false);
            setEnemyHurt(true);

            setShake(true);
            setTimeout(() => setShake(false), 250);
        }, 800);
    
        // Allow hurt animation to ACTUALLY render
        setTimeout(() => {
            setEnemyVisible(false);
            setEnemyHurt(true);
            setFightState('won');
            setShowText(true);
        }, 800 + 600); // dash + 1 hurt loop
    };

    const handleContinue = () => {
        if (fightState === 'won') {
            setShowText(false);
            setTimeout(() => {
                setFightState('reward');
                setShowText(true);
            }, 100);
        } else if (fightState === 'reward') {
            setShowText(false);
            setTimeout(() => {
                setFightState('complete');
                setShowText(true);
            }, 100);
        } else if (fightState === 'complete') {
            navigate('/base');
        }
    };

    /* Space key support */
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                if (fightState === 'begin') {
                    handleAttack();
                } else {
                    handleContinue();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [fightState]);

    const getTextboxMessage = () => {
        switch (fightState) {
            case 'begin':
                return 'Begin fight!';
            case 'attacking':
                return 'Attacking...';
            case 'won':
                return 'Fight is over, you won!';
            case 'reward':
                return 'Gold coin was dropped.';
            case 'complete':
                return 'Press space to return to base.';
            default:
                return '';
        }
    };

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

                {/* Text Box */}
                <div className="textbox">
                    <div className="text-content">
                        {showText && (
                            <TextWriter
                                text={getTextboxMessage()}
                                delay={30}
                            />
                        )}
                    </div>

                    <div className="button-area">
                        {fightState === 'begin' && (
                            <button
                                onClick={handleAttack}
                                className="fight-button"
                            >
                                Attack
                            </button>
                        )}

                        {(fightState === 'won' ||
                            fightState === 'reward' ||
                            fightState === 'complete') && (
                            <button
                                onClick={handleContinue}
                                className="fight-button"
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </ScreenLayout>
    );
}