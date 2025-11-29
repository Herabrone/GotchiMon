import React from 'react';
import '../styles/screen.css';

function ScreenLayout({ children }) {
    return (
        <div className="tamagotchi-device">
            <div className="tamagotchi-screen">
                {children}
            </div>
        </div>
    );
}

export default ScreenLayout;