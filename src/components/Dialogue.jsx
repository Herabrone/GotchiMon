import React from 'react';
import dialogueTree from './dialogueTree';
import TextWriter from '../utils/TextWriter';
import { useDialogue } from '../utils/dialogueContext';

export default function Dialogue() {
    const {currentNode, isDialogueActive, advanceDialogue} = useDialogue();

    if (!isDialogueActive){
        return null;
    }

    const node = dialogueTree[currentNode];

    if (!node) {
        return <div className="error-message">Dialogue node not found.</div>;
    }

    return (
        <div className="dialogue">
            <div className="dialogue-text">
                <TextWriter text={node.text} delay={20} />
            </div>

            <div className="dialogue-options">
                {node.options?.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => advanceDialogue(opt.next)}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    );
}