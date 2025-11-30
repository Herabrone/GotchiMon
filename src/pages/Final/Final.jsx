import { useEffect } from "react";
import Dialogue from "../../components/Dialogue";
import ScreenLayout from "../../components/screenlayout";
import { useDialogue } from "../../utils/dialogueContext";
import { useNavigate } from "react-router-dom";

export default function Final() {

    const navigate = useNavigate();
    const { advanceDialogue } = useDialogue();

    //const ending = localStorage.getItem("ending");
    const ending = 1;

    const handleDialogueAction = (action) => {
        if (action === "BackToStart") {
            navigate('/');
        }
    };

    useEffect(() => {
        if (ending === 0) {
            advanceDialogue("FinalStartG");
        } else if (ending === 1) {
            advanceDialogue("FinalStartB_0");
        }
    }, []);

    return (
        <>
            <ScreenLayout>
                <div style={{fontSize: "100px"}}>Mon image here</div>

                <Dialogue onAction={handleDialogueAction}/>
            </ScreenLayout>
        </>
    )
}