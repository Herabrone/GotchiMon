import React from 'react';
import '../styles/screen.css';

function ScreenLayout({ children }) {
    return (
        <div className="device">
            <div className="screen">
                {children}
            </div>
        </div>
    );
}

export default ScreenLayout;