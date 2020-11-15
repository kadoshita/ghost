import React, { } from 'react';
import MainTemplate from '../templates/Main';
import { withRouter } from 'react-router-dom';

const Network: React.FC = () => {
    window.document.title = 'Network - ghost';
    return (
        <MainTemplate title='Network'>
            <p>Network</p>
        </MainTemplate>
    );
};

export default withRouter(Network);