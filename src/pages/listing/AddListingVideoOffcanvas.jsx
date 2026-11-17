
import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
} from "reactstrap";
import ProImg from "../../assets/images/seller/pro-1.jpg"


const products = [
  {
    id: 1,
    name: "ZIPRAVEL Voyager Multi-Pocket Duffle Bag Gym Duffle Bag",
    category: "Duffel_bag",
    fsn: "DFBHRP83H9QFAHXC",
    sku: "ZRTBS326002B",
    image: ProImg,
  },
  {
    id: 2,
    name: "ZIPRAVEL Premium Black Faux Leather Weekender Bag",
    category: "Duffel_bag",
    fsn: "DFBHRPFZYVZNPZA6B",
    sku: "ZRTBS326001B",
    image: ProImg,
  },
  {
    id: 3,
    name: "ZIPRAVEL Executive Travel Leather Duffle Bag",
    category: "Duffel_bag",
    fsn: "DFBHRP7MUZB86Z6C",
    sku: "ZRTBS326001A",
    image: ProImg,
  },
  {
    id: 4,
    name: "ZIPRAVEL Unisex Blue Travel & Gym Duffle Bag",
    category: "Duffel_bag",
    fsn: "DFBHRP9T6K5DSZMZ",
    sku: "ZRTBS326002E",
    image: ProImg,
  },
];

export default function AddListingVideoOffcanvas({
  isOpen,
  toggle,
}) {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("Duffel Bag");
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter(
      (file) =>
        file.type === "video/mp4" &&
        file.size <= 100 * 1024 * 1024
    );

    setVideoFiles((previous) =>
      [...previous, ...validFiles].slice(0, 2)
    );

    event.target.value = "";
  };

  const closeOffcanvas = () => {
    setStep(1);
    setVideoFiles([]);
    toggle();
  };

  return (
    <>
      <Offcanvas
        isOpen={isOpen}
        toggle={closeOffcanvas}
        direction="end"
        style={{ width: "750px", maxWidth: "100%" }}
      >
        <OffcanvasHeader toggle={closeOffcanvas}>
          Add Listing Video
        </OffcanvasHeader>

        <OffcanvasBody>
          {/* STEP 1: SELECT LISTING */}
          {step === 1 && (
            <>
              <Label className="small text-st">
                Select Listing
              </Label>

              <div className="mb-4">
                <Input
                  placeholder="Search Listing"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div
                className="overflow-auto"
                style={{ maxHeight: "calc(100vh - 190px)" }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="d-flex align-items-center gap-3 p-2 mb-3 rounded bg-light"
                    role="button"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Input
                      type="radio"
                      name="listing"
                      checked={selectedProduct?.id === product.id}
                      onChange={() => setSelectedProduct(product)}
                    />

                    <img
                      src={product.image}
                      alt={product.name}
                      width="65"
                      height="65"
                      className="object-fit-contain bg-white"
                    />

                    <div className="overflow-hidden">
                      <div className="text-st text-truncate small">
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
                ))}
              </div>

              <div className="position-absolute bottom-0 end-0 p-3 bg-white w-100 text-end">
                <Button
                  color="primary"
                  disabled={!selectedProduct}
                  onClick={() => setStep(2)}
                >
                  Proceed with this Listing
                </Button>
              </div>
            </>
          )}

          {/* STEP 2: UPLOAD VIDEO */}
          {step === 2 && (
            <>
              <Label className="small text-st">
                Selected Listing
              </Label>

              <div className="d-flex align-items-center gap-3 mb-4">
                <img
                  src={ProImg}
                  alt={selectedProduct.name}
                  width="65"
                  height="65"
                  className="object-fit-contain"
                />

                <div className="flex-grow-1">
                  <small className="text-st">
                    {selectedProduct.category}
                  </small>

                  <div>{selectedProduct.name}</div>

                  <a
                    href="#"
                    className="text-st"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(1);
                    }}
                  >
                    {selectedProduct.fsn}
                  </a>
                </div>

                <Button
                  color="link"
                  onClick={() => setStep(1)}
                >
                  Remove
                </Button>
              </div>

              <div className="border border-primary border-dashed rounded p-4 text-center mb-3">
                <Label
                  for="videoUpload"
                  className="btn btn-primary"
                >
                  Upload Video
                </Label>

                <Input
                  id="videoUpload"
                  type="file"
                  accept="video/mp4"
                  multiple
                  hidden
                  onChange={handleVideoUpload}
                />

                <div className="small text-secondary mt-3">
                  <span>• Max 2 videos allowed per product</span>
                  <span className="mx-2">•</span>
                  <span>Allowed Format: MP4</span>
                  <span className="mx-2">•</span>
                  <span>Max file size: 100 MB per video</span>
                  <span className="mx-2">•</span>
                  <span>Allowed Aspect ratio: 3:4 or 9:16</span>
                </div>

                <div className="small text-secondary mt-2">
                  • Minimum resolution: 720 × 960 px
                  <span className="mx-2">•</span>
                  Allowed Video Length/Duration: 5 sec – 2 min
                </div>

                <Button
                  color="link"
                  className="mt-3 text-decoration-none"
                  onClick={() => setGuidelinesOpen(true)}
                >
                  ⓘ View QC Guidelines
                </Button>
              </div>

              {videoFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="d-flex justify-content-between border rounded p-2 mb-2"
                >
                  <span className="small text-truncate">
                    {file.name}
                  </span>
                  <Button
                    close
                    onClick={() =>
                      setVideoFiles((previous) =>
                        previous.filter((_, i) => i !== index)
                      )
                    }
                  />
                </div>
              ))}

              <div className="position-absolute bottom-0 end-0 p-3 bg-white w-100 text-end">
                <Button
                  color="secondary"
                  outline
                  disabled={videoFiles.length === 0}
                  onClick={() => {
                    // Connect your Send to QC API here.
                  }}
                >
                  Send to QC
                </Button>
              </div>
            </>
          )}
        </OffcanvasBody>
      </Offcanvas>

      {/* QC GUIDELINES MODAL */}
      <Modal
        isOpen={guidelinesOpen}
        toggle={() => setGuidelinesOpen(false)}
        centered
        size="lg"
      >
        <ModalHeader toggle={() => setGuidelinesOpen(false)}>
          Videos QC Guidelines
        </ModalHeader>

        <ModalBody>
          <ol className="ps-4">
            <li className="mb-3">
              Product details shown in the video must match the listing
              images and attributes.
            </li>
            <li className="mb-3">
              Video should be high quality with the product clearly visible.
            </li>
            <li className="mb-3">
              Audio should be only in English or Hindi.
            </li>
            <li className="mb-3">
              Recommended video aspect ratio is 3:4 or 9:16 for full
              visibility on the Flipkart customer platform.
            </li>
            <li className="mb-3">
              Video should not contain excessive background noise.
            </li>
            <li className="mb-3">
              Do not use movie audio or copyrighted music.
            </li>
            <li className="mb-3">
              Do not include social media handles, tags, or influencer promotions.
            </li>
            <li className="mb-3">
              Do not include competitor or other website names, logos,
              QR codes, or promotional mentions.
            </li>
            <li className="mb-3">
              Video should not contain watermarks or copyright text.
            </li>
            <li>
              Do not mention prices, offers, or discounts in the video.
            </li>
          </ol>
        </ModalBody>

        <ModalFooter>
          <Button
            color="light"
            onClick={() => setGuidelinesOpen(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
