import { useNavigate } from "react-router-dom";
import "./SelectEgg.css";

export default function SelectEgg() {

    const navigate = useNavigate();

    return (
        <>
            <div className="page-container">

            <h1 className="egg-select-title">Select an Egg!</h1>

                <div className="egg-select-container">
                    
                    <div>
                        Egg 1
                    </div>

                    <div>
                        Egg 2
                    </div>

                    <div>
                        Egg 3
                    </div>
                </div>
                <div className="action-container">
                    <a onClick={() => {navigate("/")}} className="egg-select-back">Nevermind</a>
                </div>
            </div>
        </>
    )
}