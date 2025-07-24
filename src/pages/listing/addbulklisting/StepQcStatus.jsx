import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import { FaBoxOpen } from 'react-icons/fa';

const StepQcStatus = () => {
    const [data, setData] = useState([]); // 

    const columns = [
        { name: 'Catalog Name', selector: row => row.name, sortable: true },
        { name: 'Status', selector: row => row.status, sortable: true },
        { name: 'Uploaded By', selector: row => row.uploadedBy },
        { name: 'Date', selector: row => row.date }
    ];

    return (
        <div>
            {data.length === 0 ? (
                <div className="text-start py-5">
                    <p>You have not created catalogs for a QC. Go to step 1 to create your catalog.</p>
                    <FaBoxOpen size={64} color="#007bff" />
                    <div className="mt-3">
                        {/* <Button color="primary">Back to Upload</Button> */}
                    </div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    striped
                    highlightOnHover
                    responsive
                    noHeader
                />
            )}
        </div>
    );
};

export default StepQcStatus;
