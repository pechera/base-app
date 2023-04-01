import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/Store';

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { username } = useUserStore();

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand
                    onClick={() => navigate('/dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    BASE APP
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#">Menu 1</Nav.Link>
                        <Nav.Link href="#">Menu 2</Nav.Link>
                        <Nav.Link href="#">Menu 3</Nav.Link>
                        <Nav.Link href="#">Menu 4</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown
                            id="nav-dropdown-profile"
                            title={username || 'John Doe'}
                            menuVariant="light"
                        >
                            <NavDropdown.Item
                                onClick={() => navigate('/profile')}
                            >
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => navigate('/logout')}
                                className="text-danger"
                            >
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
