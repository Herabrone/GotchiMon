import React from 'react';
import dialogueTree from './dialogueTree';
import TextWriter from '../utils/TextWriter';
import { useDialogue } from '../utils/dialogueContext';

export default function Dialogue({ onAction }) {
    const { currentNode, isDialogueActive, advanceDialogue } = useDialogue();

    // Don't render when dialogue is inactive
    if (!isDialogueActive) return null;

    const node = dialogueTree[currentNode];
    if (!node) return <div className="error-message">Missing dialogue node: {currentNode}</div>;

    const handleOption = (opt) => {
        // Emit action to parent if defined
        if (opt.action && typeof onAction === 'function') {
            onAction(opt.action, opt);
        }

        // Advance to next node if provided, otherwise end dialogue
        if (Object.prototype.hasOwnProperty.call(opt, 'next')) {
            advanceDialogue(opt.next);
        } else {
            advanceDialogue(null);
        }
    };

    return (
        <div className="dialogue">
            <div className="dialogue-text">
                <TextWriter text={node.text} delay={20} />
            </div>

            <div className="dialogue-options">
                {node.options?.map((opt, i) => (
                    <button key={i} onClick={() => handleOption(opt)}>
                        {opt.text ?? opt.action ?? 'Continue'}
                    </button>
                ))}
            </div>
        </div>
    );
}