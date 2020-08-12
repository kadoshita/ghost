import React from 'react';
import MainTemplate from '../templates/Main';

const Home: React.FC = () => {
    window.document.title = 'Home - ghost';
    return (
        <MainTemplate title='Home'>
            <p>Home</p>
        </MainTemplate>
    )
};

export default Home;