import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import classnames from 'classnames';

const ManageSessions = () => {
  const [activeTab, setActiveTab] = useState('web');

  const webSessions = [
    { ip: '171.79.39.40', type: 'Seller Login', time: '25-06-2025 02:11:06', isCurrent: true },
    { ip: '171.79.40.126', type: 'Seller Login', time: '23-06-2025 11:18:11', isCurrent: false },
  ];

  const appSessions = [
    { ip: '192.168.1.10', type: 'App Login', time: '24-06-2025 15:32:18', isCurrent: false },
  ];

  const [sessions, setSessions] = useState({
    web: webSessions,
    app: appSessions,
  });

  const logoutSession = (ip, tab) => {
    const updated = sessions[tab].filter(s => s.ip !== ip);
    setSessions({ ...sessions, [tab]: updated });
  };

  const logoutAllOtherSessions = (tab) => {
    const current = sessions[tab].filter(s => s.isCurrent);
    setSessions({ ...sessions, [tab]: current });
  };

  const renderTable = (tab) => (
    <Table bordered hover responsive className="mb-0">
      <thead className="table-light">
        <tr>
          <th>IP Address</th>
          <th>Login Type</th>
          <th>Login Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {sessions[tab].map((session, index) => (
          <tr key={index}>
            <td>{session.ip}</td>
            <td>{session.type}</td>
            <td>{session.time}</td>
            <td>
              {session.isCurrent ? (
                <span className="text-muted">Current Session</span>
              ) : (
                <Button color="link" size="sm" onClick={() => logoutSession(session.ip, tab)}>
                  Logout Session
                </Button>
              )}
            </td>
          </tr>
        ))}
        {sessions[tab].length === 0 && (
          <tr>
            <td colSpan="4" className="text-center text-muted">No active sessions found.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  return (
    <div className="py-2">
      <Row>
        <Col md="12">
          <Card className="bg-light border-0">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Manage Sessions</h6>
                <Button color="primary" size="sm" onClick={() => logoutAllOtherSessions(activeTab)}>
                  Logout Other {activeTab === 'web' ? 'Web' : 'App'} Sessions
                </Button>
              </div>

              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 'web' })}
                    onClick={() => setActiveTab('web')}
                    style={{ cursor: 'pointer' }}
                  >
                    Web Session
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 'app' })}
                    onClick={() => setActiveTab('app')}
                    style={{ cursor: 'pointer' }}
                  >
                    App Session
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="mt-3">
                <TabPane tabId="web">{renderTable('web')}</TabPane>
                <TabPane tabId="app">{renderTable('app')}</TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManageSessions;
