
import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Input,
  Label,
  InputGroup,
  InputGroupText,
} from "reactstrap";

import ProImg from "../../assets/images/seller/pro-1.jpg";

const products = [
  {
    id: 1,
    name: "ZIPRAVEL Teal & Black Graphic Gym and Travel Duffle Bag",
    fsn: "DFBHRPFWA2HNAMB5",
    sku: "ZRGBS326002D",
    image: ProImg,
  },
  {
    id: 2,
    name: "ZIPRAVEL Voyager Multi-Pocket Duffle Bag Gym Duffle Bag",
    fsn: "DFBHRP83H9QFAHXC",
    sku: "ZRTBS326002B",
    image: ProImg,
  },
  {
    id: 3,
    name: "ZIPRAVEL Premium Black Faux Leather Weekender Bag",
    fsn: "DFBHRPFZYVZNPZA6B",
    sku: "ZRTBS326001B",
    image: ProImg,
  },
  {
    id: 4,
    name: "ZIPRAVEL Executive Travel Leather Duffle Bag",
    fsn: "DFBHRP7MUZB86Z6C",
    sku: "ZRTBS326001A",
    image: ProImg,
  },
];

const AddVariantSidebar = ({
  isOpen,
  toggle,
  onContinue,
}) => {
  const [search, setSearch] = useState("ZRGBS326002D");
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.fsn} ${product.sku}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedProduct) {
      onContinue?.(selectedProduct);
    }
  };

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      style={{ width: "800px", maxWidth: "100%" }}
    >
      {/* HEADER */}
      <OffcanvasHeader toggle={toggle}>
        Add variant to a parent product
      </OffcanvasHeader>

      <OffcanvasBody className="p-4 position-relative">

        <Label className="small mb-2">
          Please enter parent product details
        </Label>

        {/* SEARCH */}
        <InputGroup className="mb-4" style={{ maxWidth: "330px" }}>
          <Input
            placeholder="Search product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <InputGroupText className="bg-white">
            <i className="ri-search-line fs-5"></i>
          </InputGroupText>
        </InputGroup>

        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                role="button"
                className={`d-flex align-items-center gap-3 p-3 mb-2 rounded ${
                  selectedProduct?.id === product.id
                    ? "bg-light"
                    : ""
                }`}
              >
                <Input
                  type="radio"
                  name="parentProduct"
                  checked={selectedProduct?.id === product.id}
                  onChange={() => setSelectedProduct(product)}
                />

                <img
                  src={product.image}
                  alt={product.name}
                  width="75"
                  height="65"
                  className="object-fit-contain bg-white"
                />

                <div className="overflow-hidden">
                  <div className="small text-dark text-truncate">
                    {product.name}
                  </div>

                  <small className="text-secondary d-block">
                    FSN - {product.fsn}
                  </small>

                  <small className="text-secondary d-block">
                    SKU - {product.sku}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-secondary py-4">
              No products found
            </div>
          )}
        </div>

        <div className="position-absolute bottom-0 start-0 w-100 bg-white p-3 text-end">
          <Button
            color="primary"
            disabled={!selectedProduct}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>

      </OffcanvasBody>
    </Offcanvas>
  );
};

export default AddVariantSidebar;
