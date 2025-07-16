import React, { useState, useRef } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';

const ProductPhotos = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef();

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newImages = files
            .slice(0, 5 - images.length) // limit to 5
            .map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            }));

        const updatedImages = [...images, ...newImages].slice(0, 5);
        setImages(updatedImages);
        if (!selectedImage) setSelectedImage(newImages[0]?.url);

        e.target.value = '';
    };

    const handleThumbnailClick = (url) => {
        setSelectedImage(url);
    };

    return (
        <Card className="mb-3">
            <CardBody>
                <div className='d-flex align-items-center'>
                    <h6 className="fw-bold mb-3">Product Photos ({images.length}/5)</h6>
                    <div className='ms-auto'>
                        <Button className='btn btn-danger btn-sm me-1'>Cancel</Button>
                        <Button className='btn btn-primary btn-sm'>Save</Button>
                    </div>
                </div>
                <div className="d-flex gap-2 mb-3 overflow-auto">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            onClick={() => images[i] && handleThumbnailClick(images[i].url)}
                            className="border text-center p-1 position-relative rounded"
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: images[i] ? 'pointer' : 'default',
                                background: '#f9f9f9',
                                overflow: 'hidden',
                            }}
                        >
                            {images[i] ? (
                                <img
                                    src={images[i].url}
                                    alt="thumb"
                                    className="img-fluid"
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            ) : (
                                <small>Image</small>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center my-3">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="img-thumbnail"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                    ) : (
                        <FaUpload size={50} className="text-secondary" />
                    )}
                </div>

                <div className="text-center my-2">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        ref={inputRef}
                        onChange={handleUpload}
                    />
                    <Button
                        color="primary"
                        onClick={() => inputRef.current && inputRef.current.click()}
                        disabled={images.length >= 5}
                    >
                        <FaUpload className="me-1" />
                        Upload Photo
                    </Button>
                </div>

                <div className="bg-light border p-3 rounded mt-4">
                    <strong>Image</strong>
                    <div className="bg-info text-white p-2 rounded my-2">
                        <small>Follow Image Guidelines to reduce the Quality Check failures</small>
                    </div>
                    <small><strong>Image Resolution:</strong> Use clear color images with minimum resolution of <strong>100×500 px</strong>.</small>
                    <small><strong>Image Guidelines:</strong> Upload authentic product photos taken in bright lighting.</small>
                    <small><strong>Tip:</strong><br />
                        - Drag images to the desired position to re-order (optional).<br />
                        - Check out the sample images to ensure you provide the correct Image View.
                    </small>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductPhotos;
