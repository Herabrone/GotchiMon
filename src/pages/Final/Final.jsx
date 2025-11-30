import './Final.css';

import { useEffect } from "react";
import Dialogue from "../../components/Dialogue";
import ScreenLayout from "../../components/screenlayout";
import { useDialogue } from "../../utils/dialogueContext";
import { useNavigate } from "react-router-dom";

export default function Final() {

    const navigate = useNavigate();
    const { advanceDialogue } = useDialogue();

    const alignment = localStorage.getItem("monsterAlignment");
    const good = alignment === "good";

    const handleDialogueAction = (action) => {
        if (action === "BackToStart") {
            navigate('/');
        }
    };

    useEffect(() => {
        if (good) {
            advanceDialogue("FinalStartG");
        } else {
            advanceDialogue("FinalStartB_0");
        }
    }, [good]);

    return (
        <>
            <ScreenLayout>
                <div className="sprite-container">
                    <div className={good ? "good-idle-sprite" : "bad-idle-sprite"}></div>
                </div>
                <Dialogue onAction={handleDialogueAction}/>
            </ScreenLayout>
        </>
    )
}