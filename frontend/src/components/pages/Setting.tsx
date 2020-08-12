import React from 'react';
import MainTemplate from '../templates/Main';

const Setting: React.FC = () => {
    window.document.title = 'Settings - ghost';
    return (
        <MainTemplate title='Settings'>
            <p>Settings</p>
        </MainTemplate>
    );
};

export default Setting;