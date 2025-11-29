import React, { useState, useEffect } from 'react';

const TextWriter = ({ text, delay = 200 }) => {

    const words = text.split(' ');
    const [displayedText, setDisplayedText] = useState([]);
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {  
        if (wordIndex < words.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => [...prev, words[wordIndex]]);
                setWordIndex(prev => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [wordIndex, words, delay]);

    return (
        <span>
            {displayedText.map((word, index) => (
                <span key={index} style={{ marginRight: '0.5em' }}>{word}</span>
            ))}
        </span>
    );
};

export default TextWriter;
