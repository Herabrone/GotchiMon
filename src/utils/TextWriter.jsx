import React, { useState, useEffect, useRef } from 'react';

const TextWriter = ({ text, delay = 50, soundSrc = null, onComplete = () => {}, textWriterRef = null }) => {
    const chars = [...text];
    const [displayed, setDisplayed] = useState("");
    const [index, setIndex] = useState(0);
    const audioRef = useRef(null); 

    const finishTyping = () => {
        setDisplayed(text);
        setIndex(chars.length);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        if (textWriterRef) {
            textWriterRef.current = finishTyping;
        }
    }, [textWriterRef, text]);

    useEffect(() => {
        if (soundSrc) {
            audioRef.current = new Audio(soundSrc);
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [soundSrc]);

    useEffect(() => {
        let timeout;

        if (index < chars.length) {
            timeout = setTimeout(() => {
                setDisplayed(prev => prev + chars[index]);
                setIndex(prev => prev + 1);
            }, delay);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            onComplete();
        }

        return () => clearTimeout(timeout);
    }, [index, chars, delay, onComplete]);

    return <span>{displayed}</span>;
};

export default TextWriter;