import "./SelectEgg.css";

import { useNavigate } from "react-router-dom";
import ScreenLayout from '../../components/screenlayout';

export default function SelectEgg() {

    const navigate = useNavigate();

    const eggs = [
        {name: "Egg 1", image: "image1"},
        {name: "Egg 2", image: "image2"},
        {name: "Egg 3", image: "image3"}
    ]

    return (
        <ScreenLayout>
            <div className="page-container">

            <h1 className="egg-select-title">Select an Egg!</h1>

                <div className="egg-select-container">
                    
                    {eggs.map((egg) => (
                        <div className="egg-container">
                            <span>{egg.image}</span>
                            <span>{egg.name}</span>
                        </div>
                    ))}

                </div>
                <div className="action-container">
                    <a onClick={() => {navigate("/")}} className="egg-select-back">Nevermind</a>
                </div>
            </div>
        </ScreenLayout>
    )
}