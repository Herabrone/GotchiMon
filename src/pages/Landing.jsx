import React from 'react';
import ScreenLayout from '../components/screenlayout';
import Dialogue from '../components/Dialogue';
import { useDialogue } from "../utils/dialogueContext";

export default function Landing() {
     const { setIsDialogueActive } = useDialogue();

    // Start the dialogue when the component mounts
    React.useEffect(() => {
        setIsDialogueActive(true);
    }, [setIsDialogueActive]);

    return (
        <ScreenLayout>
            <h1>Start menu</h1>
            <Dialogue />
        </ScreenLayout>
    )
}