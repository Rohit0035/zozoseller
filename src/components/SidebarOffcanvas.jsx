import React, { useEffect } from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody
} from 'reactstrap';
import sidebarMenu from '../data/sidebarMenu';
import { Link, useLocation } from 'react-router-dom';
import LogoLg from '../assets/images/logo-lg.png'

import '../assets/styles/sidebarmobile.css'
export default function SidebarOffcanvas({ isOpen, toggle }) {
  const location = useLocation();

  // Auto-close on route change
  useEffect(() => {
    toggle();
  }, [location.pathname]);

  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="start" className="mobile-sidebar">
      <OffcanvasHeader toggle={toggle}>
        <img src={LogoLg} alt="Zozo logo" width="120px" />
      </OffcanvasHeader>
      <OffcanvasBody>
        <ul className="list-unstyled sidebar-list">
          {sidebarMenu.map((item, index) => (
            <li key={index}>
              <span>{item.label}</span>
              {item.submenu && (
                <ul>
                  {item.submenu.map((sub, i) => (
                    <li key={i}>
                      <Link to={sub.path}>{sub.label}</Link>
                      {sub.children && (
                        <ul>
                          {sub.children.map((child, ci) => (
                            <li key={ci}>
                              <Link to={child.path}>{child.label}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </OffcanvasBody>
    </Offcanvas>
  );
}
