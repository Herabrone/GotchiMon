import React, { useState, useRef } from 'react';
import dialogueTree from './dialogueTree';
import TextWriter from '../utils/TextWriter';
import { useDialogue } from '../utils/dialogueContext';
import textScrollSfx from '../../public/assets/sfx/bg-music/text-scroll/text-scroll.mp3';

export default function Dialogue({ onAction }) {
    const { currentNode, isDialogueActive, advanceDialogue } = useDialogue();
    const [isWritingComplete, setIsWritingComplete] = useState(false);
    const textWriterRef = useRef(null); 
    const pendingOptionRef = useRef(null); 

    if (!isDialogueActive) return null;

    const node = dialogueTree[currentNode];
    if (!node) return <div className="error-message">Missing dialogue node: {currentNode}</div>;

    const handleAdvance = (opt) => {
        setIsWritingComplete(false);
        pendingOptionRef.current = null;
        
        if (opt.action && typeof onAction === 'function') {
            onAction(opt.action, opt);
        }

        if (Object.prototype.hasOwnProperty.call(opt, 'next')) {
            advanceDialogue(opt.next);
        }
    }

    const handleWritingComplete = (optToAdvance) => {
        setIsWritingComplete(true);
        if (optToAdvance) {
            handleAdvance(optToAdvance);
        }
    };

    const handleOption = (opt) => {
        if (!isWritingComplete && textWriterRef.current) {
            pendingOptionRef.current = opt;
            textWriterRef.current(); 
        } else {
            handleAdvance(opt);
        }
    };

    return (
        <div className="dialogue">
            <div className="dialogue-text">
                <TextWriter 
                    key={currentNode} 
                    text={node.text} 
                    delay={20} 
                    soundSrc={textScrollSfx} 
                    onComplete={() => handleWritingComplete(pendingOptionRef.current)} 
                    textWriterRef={textWriterRef} 
                />
            </div>

            <div className="dialogue-options">
                {node.options?.map((opt, i) => ( 
                    <button key={i} onClick={() => handleOption(opt)}>
                        {opt.text ?? opt.action ?? 'Continue'}
                    </button>
                ))}
                
                {!node.options && (
                    <button onClick={() => handleOption(node)}>
                        Continue
                    </button>
                )}
            </div>
        </div>
    );
}