import React, { useRef } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { FiFolder, FiImage } from 'react-icons/fi';

const ImageUploader = () => {
  const folderInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleFolderChange = (e) => {
    const files = e.target.files;
    console.log('📁 Folder Files:', files);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    console.log('🖼️ Image Files:', files);
  };

  return (
    <>
      <h6 className="fw-bold mb-3 text-start">Upload Images</h6>
      <Row>
        {/* Upload Folder */}
        <Col md="6" className="mb-3">
          <Card
            className="border-primary text-center"
            style={{ borderStyle: 'dashed', cursor: 'pointer' }}
            onClick={handleFolderClick}
          >
            <CardBody className='py-5'>
              <FiFolder size={24} className="text-primary" />
              <p className="mb-0 mt-2 text-primary">Upload folder</p>
              <input
                type="file"
                webkitdirectory="true"
                directory=""
                ref={folderInputRef}
                onChange={handleFolderChange}
                style={{ display: 'none' }}
              />
            </CardBody>
          </Card>
        </Col>

        {/* Upload Images */}
        <Col md="6" className="mb-3">
          <Card
            className="border-primary text-center"
            style={{ borderStyle: 'dashed', cursor: 'pointer' }}
            onClick={handleImageClick}
          >
            <CardBody className='py-5'>
              <FiImage size={24} className="text-primary" />
              <p className="mb-0 mt-2 text-primary">Upload images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ImageUploader;
