import React from 'react';
import MainTemplate from '../templates/Main';

const Detail: React.FC = () => {
    window.document.title = 'Detail - ghost';
    return (
        <MainTemplate title='Detail'>
            <p>Detail</p>
        </MainTemplate>
    );
};

export default Detail;