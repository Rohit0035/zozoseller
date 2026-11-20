
import React, { useRef, useState } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Collapse,
    Button,
    Input
} from "reactstrap";

const ListDropUpload = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedOption, setExpandedOption] = useState(null);
    const fileRef = useRef(null);

    const options = [
        "View Recent Uploads",
        "Upload Listing File",
        "Upload Catalog File",
        "Upload Variant Grouping File"
    ];

    const handleOptionClick = (option) => {
        setExpandedOption(
            expandedOption === option ? null : option
        );
    };

    return (
        <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} className="ms-2">
            <DropdownToggle caret color="primary" size="sm"
                className=" py-1 px-2">
                Uploads
            </DropdownToggle>

            <DropdownMenu className="p-2">
                {options.map((option) => (
                    <div key={option}>
                        <DropdownItem
                            style={{ fontSize: '14px' }}
                            toggle={false}
                            onClick={() => handleOptionClick(option)}
                            className="d-flex justify-content-between align-items-center"
                        >

                            {option}
                            <span>
                                {expandedOption === option ? "⌄" : "›"}
                            </span>
                        </DropdownItem>

                        <Collapse isOpen={expandedOption === option}>
                            <div className="px-3 py-2">
                                {option === "View Recent Uploads" ? (
                                    <Button color="light" size="sm">
                                        View Uploads
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            color="light"
                                            size="sm"
                                            className="border"
                                            onClick={() => fileRef.current?.click()}
                                        >
                                            Select File
                                        </Button>

                                        <Input
                                            type="file"
                                            innerRef={fileRef}
                                            hidden
                                            onChange={(e) => {
                                                console.log(e.target.files[0]);
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </Collapse>
                    </div>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default ListDropUpload;
