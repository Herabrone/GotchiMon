import React, { useState, useEffect, useRef } from 'react';

const TextWriter = ({ text, delay = 50, soundSrc = null, onComplete = () => {}, textWriterRef = null }) => {
    const chars = [...text];
    const [displayed, setDisplayed] = useState("");
    const [index, setIndex] = useState(0);
    const audioRef = useRef(null); 
    const isFinished = index >= chars.length;

    // --- 1. Control Function for External Skip ---
    const finishTyping = () => {
        setDisplayed(text);
        setIndex(chars.length);
        
        // Stop audio immediately upon skip
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Expose the finishTyping function to the parent via the ref
    useEffect(() => {
        if (textWriterRef) {
            textWriterRef.current = finishTyping;
        }
    }, [textWriterRef, text]);

    // --- 2. Audio Control Effect (Now Looping) ---
    useEffect(() => {
        let audio;
        if (soundSrc) {
            audio = new Audio(soundSrc);
            audioRef.current = audio;
            
            // 🔥 FIX: Set audio to loop so the 6-second track repeats for long text
            audio.loop = true; 
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                // Prevent unhandled promise rejection if autoplay is blocked
                playPromise.catch(() => {});
            }
        }

        // Cleanup: Stop and release the audio when component unmounts or text changes
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [soundSrc, text]); // Dependency on 'text' ensures audio restarts for new dialogue

    // --- 3. Typing Effect Logic ---
    useEffect(() => {
        let timeout;

        if (index < chars.length) {
            timeout = setTimeout(() => {
                setDisplayed(prev => prev + chars[index]);
                setIndex(prev => prev + 1);
            }, delay);
        } else if (index > 0 && isFinished) {
            // Text finished naturally. Stop the audio loop and call onComplete.
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            onComplete();
        }

        // Cleanup: Clear timeout when component unmounts or index updates
        return () => clearTimeout(timeout);
    }, [index, chars, delay, onComplete, isFinished, text]);

    return <span>{displayed}</span>;
};

export default TextWriter;