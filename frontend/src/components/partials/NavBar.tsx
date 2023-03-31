import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    Container,
    Nav,
    Navbar,
    Button,
    NavDropdown,
    Dropdown,
} from 'react-bootstrap';

const NavBar: React.FC = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/dashboard">BASE APP</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#">Menu 1</Nav.Link>
                        <Nav.Link href="#">Menu 2</Nav.Link>
                        <Nav.Link href="#">Menu 3</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                    </Nav>
                    {/* <Nav>
                        <NavDropdown
                            id="nav-dropdown-profile"
                            title={username || 'John Doe'}
                            menuVariant="light"
                        >
                            <NavDropdown.Item href="/profile">
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/pricing">
                                Pricing
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                href="/logout"
                                className="text-danger"
                            >
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav> */}
                    <Nav>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
