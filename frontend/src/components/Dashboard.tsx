import React from 'react';
import NavBar from './partials/NavBar';
import { Container } from 'react-bootstrap';

const Dashboard: React.FC = () => {
    return (
        <div>
            <NavBar />
            <Container>Dashboard</Container>
        </div>
    );
};

export default Dashboard;
