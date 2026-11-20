
import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge
} from "reactstrap";

const ListDropActions = () => {
  return (
    <UncontrolledDropdown>
      <DropdownToggle
        caret
        color="primary"
        size="sm"
        className="ms-2 py-1 px-2"
      >
        Actions <Badge color="danger" className="ms-1  ">New</Badge>
      </DropdownToggle>

      <DropdownMenu end className="shadow-sm">
        <DropdownItem header>
          Growth
        </DropdownItem>

        <DropdownItem>
          Run Ad Campaign <Badge color="info" className="ms-1">New</Badge>
        </DropdownItem>

        <DropdownItem header>
          Operational
        </DropdownItem>

        <DropdownItem disabled>
          Archive Selected
        </DropdownItem>

        <DropdownItem disabled>
          Deactivate Selected
        </DropdownItem>

        <DropdownItem disabled>
          Create Settlement Plan for Selected
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ListDropActions;
