import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Input, Row, Col } from 'reactstrap';
import { FaBoxOpen } from 'react-icons/fa';

const StepthreeList = () => {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        setData([
            {
                vertical: 'sari',
                sku: 'alocateSKU234',
                createdOn: 'Jan 14, 2022 04:58PM',
                lastProcessed: 'Jan 14, 2022 05:18PM',
                actionLink: '#'
            },
            {
                vertical: 'sari',
                sku: 'alocateSKU55',
                createdOn: 'Jan 14, 2022 04:58PM',
                lastProcessed: 'Jan 14, 2022 05:18PM',
                actionLink: '#'
            },
            {
                vertical: 'sari',
                sku: 'alocateSKU27',
                createdOn: 'Jan 14, 2022 04:58PM',
                lastProcessed: 'Jan 14, 2022 05:18PM',
                actionLink: '#'
            }
        ]);
    }, []);

    const columns = [
        { name: 'Vertical', selector: row => row.vertical, sortable: true },
        { name: 'SKU ID', selector: row => row.sku, sortable: true },
        { name: 'Created On', selector: row => row.createdOn, sortable: true },
        { name: 'Last Processed', selector: row => row.lastProcessed, sortable: true },
        {
            name: 'Actions',
            cell: row => <a href={row.actionLink} target="_blank" rel="noreferrer">View on FLIPKART</a>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    const filteredData = data.filter(item =>
        item.sku.toLowerCase().includes(filterText.toLowerCase()) ||
        item.vertical.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            {data.length === 0 ? (
                <div className="text-start pd">
                    <p>You have no successful listings. Go to step 1 or step 2.</p>
                    <FaBoxOpen size={64} color="#007bff" />
                </div>
            ) : (
                <>
                    <Row className="mb-3 align-items-center mt-5">
                        <Col md={4}>
                            <Input
                                type="text"
                                placeholder="Search by SKU or Vertical"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </Col>
                        <Col md={8} className="text-end">
                            <Button color="primary">Manage Listing</Button>
                        </Col>
                    </Row>

                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        striped
                        highlightOnHover
                        responsive
                        noHeader
                    />
                </>
            )}
        </>
    );
};

export default StepthreeList;
