import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
  Card,
  CardBody,
  Col,
  Row,
  Badge,
} from "reactstrap";

const FBZOrderList = ({ orders = [], title = "Orders" }) => {

  const [filterText, setFilterText] = useState("");

  // =========================================
  // STATUS BADGE COLORS
  // =========================================

  const getStatusColor = (status) => {

    switch (status) {

      case "Pending":
        return "warning";

      case "Processing":
      case "Ready To Dispatch":
      case "Shipped":
      case "In Transit":
      case "Out For Delivery":
        return "info";

      case "Delivered":
        return "success";

      case "Cancelled":
      case "Refunded":
      case "Returned":
      case "Payment Failed":
        return "danger";

      default:
        return "secondary";
    }
  };

  // =========================================
  // TABLE COLUMNS
  // =========================================

  const columns = [

    {
      name: "#",
      selector: (row) => row.index,
      width: "70px",
    },

    {
      name: "Order ID",
      selector: (row) => row.orderUniqueId || "-",
      sortable: true,
      wrap: true,
    },

    {
      name: "Sub Order ID",
      selector: (row) => row.subOrderUniqueId || "-",
      sortable: true,
      wrap: true,
    },

    {
      name: "Product",
      selector: (row) => row.productInfo || "-",
      sortable: true,
      grow: 2,
      wrap: true,
    },

    {
      name: "SKU",
      selector: (row) => row.skuNo || "-",
      wrap: true,
    },

    {
      name: "Qty",
      selector: (row) => row.quantity || 0,
      center: true,
      width: "90px",
    },

    {
      name: "Amount",
      selector: (row) => `₹${Number(row.amount || 0).toFixed(2)}`,
      sortable: true,
      width: "120px",
    },

    {
      name: "Status",
      cell: (row) => (
        <Badge color={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
      sortable: true,
      width: "180px",
    },

    {
      name: "Created",
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "-",
      sortable: true,
      width: "140px",
    },
  ];

  // =========================================
  // FILTER
  // =========================================

  const filteredData = useMemo(() => {

    if (!filterText) return orders;

    return orders.filter((item) =>

      item.orderUniqueId
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||

      item.subOrderUniqueId
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||

      item.productInfo
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||

      item.skuNo
        ?.toLowerCase()
        .includes(filterText.toLowerCase())
    );

  }, [orders, filterText]);


  return (
    <div>

      {/* =========================================
          HEADER
      ========================================= */}

      <Row className="mb-3">

        <Col md="6">

          <h5 className="mb-0">
            {title}
          </h5>

        </Col>

        <Col md="6">

          <div className="d-flex justify-content-end gap-2">

            <input
              type="text"
              className="form-control w-50"
              placeholder="Search orders..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

            <CSVLink
              data={filteredData}
              filename={`${title}.csv`}
              className="btn btn-primary"
            >
              Export CSV
            </CSVLink>

          </div>

        </Col>

      </Row>


      {/* =========================================
          TABLE
      ========================================= */}

      <Card>

        <CardBody>

          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            striped
            persistTableHead
            noDataComponent="No Orders Found"
          />

        </CardBody>

      </Card>

    </div>
  );
};

export default FBZOrderList;