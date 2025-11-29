import { useNavigate } from "react-router-dom";
import "./SelectEgg.css";

import ScreenLayout from '../../components/screenlayout';

export default function SelectEgg() {

    const navigate = useNavigate();

    return (
        <ScreenLayout>
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
        </ScreenLayout>
    )
}