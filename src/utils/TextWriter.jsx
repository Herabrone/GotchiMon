import React, { useState, useEffect } from 'react';

const TextWriter = ({ text, delay = 50 }) => {

    const chars = [...text];
    const [displayed, setDisplayed] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {  
        if (index < chars.length) {
            const timeout = setTimeout(() => {
                setDisplayed(prev => prev + chars[index]);
                setIndex(prev => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [index, chars, delay]);

    return (
        <span>
            {displayed}
        </span>
    );
};

export default TextWriter;
