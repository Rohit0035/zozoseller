import React, { useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import Logo from "../../assets/images/logo/logo.png"

import { FaUser, FaStore } from "react-icons/fa";

const SellerHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="sticky-top bg-white border-bottom shadow-sm">
            <Navbar
                expand="lg"
                light
                className="py-2"
                container
            >
                <NavbarBrand
                    href="/"
                    className="d-flex align-items-center me-lg-4"
                >
                    <img
                        src={Logo}
                        alt="Zozo Kart"
                        width="145"
                        height="55"
                        className="img-fluid"
                    />
                </NavbarBrand>
                <NavbarToggler
                    onClick={toggleNavbar}
                    className="border-0 shadow-none"
                />
                <Collapse isOpen={isOpen} navbar>
                    <Nav
                        navbar
                        className="align-items-lg-center mx-auto"
                    >

                        <NavItem>
                            <NavLink
                                href="#"
                                className="px-lg-3 py-2 fw-medium text-dark"
                            >
                                Home
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                href="#whysellus"
                                className="px-lg-3 py-2 fw-medium text-dark"
                            >
                                Why Sell With Us
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                href="#benefits"
                                className="px-lg-3 py-2 fw-medium text-dark"
                            >
                                Seller Benefits
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                href="#howitwork"
                                className="px-lg-3 py-2 fw-medium text-dark"
                            >
                                How It Works
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                href="#contctus"
                                className="px-lg-3 py-2 fw-medium text-dark"
                            >
                                Contact Us
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-lg-auto mt-3 mt-lg-0">
                        <a
                            href="/seller/login"
                            className="btn btn-primary px-4 border-none"
                        >
                            <FaUser className="me-2" />
                            Login
                        </a>
                        <a
                            href="/seller/register"
                            className="btn btn-primary px-4 fw-semibold border-none"
                        >
                            <FaStore className="me-2" />
                            Start Selling
                        </a>
                    </div>
                </Collapse>
            </Navbar>
        </header>
    );
};

export default SellerHeader;