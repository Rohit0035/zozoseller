import React, { useState } from 'react';
import { FaFileExcel, FaUpload } from 'react-icons/fa';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import ImageUploader from './ImageUploader';
import ExcelTemplate from './ExcelTemplate'; // import your Excel component

const StepOneCatalog = () => {
  const [view, setView] = useState('main'); // 'main', 'excel', 'image'

  return (
    <>
      {view === 'main' && (
        <Row>
          <Col md='6'>
            <div className='text-center rounded' style={{ border: '1px dashed #ccc', cursor:'pointer' }}>
              <div className='mb-2 text-decoration-none' onClick={() => setView('excel')}>
                <Card>
                  <CardBody className='py-5'>
                    <FaFileExcel size={24} />
                    <p>With Excel Template</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </Col>
          <Col md='6'>
            <div className='text-center' style={{ border: '1px dashed #ccc', cursor:'pointer'}}>
              <div className='mb-2 text-decoration-none' onClick={() => setView('image')}>
                <Card>
                  <CardBody className='py-5'>
                    <FaUpload size={24} />
                    <p>With Image Uploader</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {view === 'image' && (
        <div className='mt-4 text-end'>
          <Button className="btn btn-primary btn-sm mb-3" onClick={() => setView('main')}>
            &larr; Back
          </Button>
          <ImageUploader />
        </div>
      )}

      {view === 'excel' && (
        <div className='mt-4 text-end'>
          <Button className="btn btn-primary btn-sm mb-3" onClick={() => setView('main')} >
            &larr; Back
          </Button>
          <ExcelTemplate />
        </div>
      )}
    </>
  );
};

export default StepOneCatalog;
