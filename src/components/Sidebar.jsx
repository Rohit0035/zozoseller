// Sidebar.jsx
import React from 'react';
import { Nav, NavbarBrand, NavItem } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/sidebar.css';
import LogoSm from '../assets/images/logo.png';
import sidebarMenu from '../data/sidebarMenu';

export default function Sidebar({ collapsed, isOpen, onClose }) {
  const location = useLocation();

  return (
    <div className={`custom-sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-overlay d-md-none" onClick={onClose}></div>
      <Nav vertical>
        <NavbarBrand className='mt-2 mb-3 px-2 d-none d-lg-block text-center'>
          <img src={LogoSm} alt="Zozo-logo" width="50px" />
        </NavbarBrand>

        {sidebarMenu.map((item, index) => (
          <NavItem key={index} className="sidebar-item">
            <div className="sidebar-link">
              <div className="icon">{item.icon}</div>
              <span className="label">{item.label}</span>

              {/* Render hover menu if submenu exists */}
              {item.submenu && (
                <div className="hover-menu">
                  {item.submenu.map((sub, i) => (
                    <div key={i} className="hover-item text-start">
                      <Link to={sub.path} className="text-decoration-none">
                        {sub.label}
                      </Link>

                      {/* If child submenu exists */}
                      {sub.children && (
                        <div className="child-menu">
                          {sub.children.map((child, ci) => (
                            <Link
                              key={ci}
                              to={child.path}
                              className="child-item  text-decoration-none"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No submenu - direct path */}
              {!item.submenu && item.path && (
                <Link
                  to={item.path}
                  className="stretched-link position-absolute top-0 bottom-0 start-0 end-0"
                />
              )}
            </div>
          </NavItem>
        ))}
      </Nav>
    </div>
  );
}
