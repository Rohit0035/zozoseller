import React from 'react';
import {
  Navbar, NavbarBrand, Button, UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { FaBars } from 'react-icons/fa';
import LogoLg from '../assets/images/logo-lg.png'
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { IoMdAlert } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaLongArrowAltRight } from "react-icons/fa";
export default function Header({ toggleSidebar, toggleCollapse }) {
  return (
    <>
      <Navbar className="border-bottom bg-white justify-content-between sticky-top">
        <div className="d-lg-none d-flex align-items-center">
          <Button color="link" className="d-lg-none" onClick={toggleSidebar}>
            <FaBars color="#02339a" />
          </Button>
          <NavbarBrand className="mb-0 h1 ms-2 d-lg-none">
            <img src={LogoLg} alt="Zozo logo" width="100px" />
          </NavbarBrand>
        </div>
        <div className="d-none d-lg-block">
          <Button color="#02339a" onClick={toggleCollapse}>
            <FaBars size={20} color="#02339a" />
          </Button>
        </div>
        <div className="d-flex gap-1">
          <UncontrolledDropdown>
            <DropdownToggle
              color="light"
              className="d-flex align-items-center border-0 bg-transparent"
            >
              <FaBell size={20} color="#fc0" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem header>Notifications</DropdownItem>
              <DropdownItem>New message received</DropdownItem>
              <DropdownItem>Server rebooted</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>View all notifications</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          {/* Profile Dropdown */}
          <UncontrolledDropdown>
            <DropdownToggle
              // caret
              color="light"
              className="d-flex align-items-center border-0 bg-transparent"
            >
              <FaUserCircle size={20} color="#02339a" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem header>JOHN SMITH</DropdownItem>
              <DropdownItem divider />
              <DropdownItem tag={Link} to="/Profile">My Account</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>

        {/* <NavbarBrand className="mb-0 h1">DEFAULT</NavbarBrand> */}
        <div className='text-center w-100 bg-light py-2 mt-1'>
          <IoMdAlert size={22} className='me-2' color='#fc0' />
          <small>
            Provide and verify your bank details to receive payments on your orders
          </small>
          <Link className='px-2' to="#">
            Provide bank detail
            <FaLongArrowAltRight size={22} className='text-primary ms-2' />
          </Link>
        </div>
      </Navbar>
    </>

  );
}
