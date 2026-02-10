import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';
import { showToast } from '../../../components/ToastifyNotification';
import { IMAGE_URL } from '../../../utils/api-config';

const MAX_IMAGES = 5;

const ProductPhotos = ({ listingData, onListingDataChange }) => {
    const [images, setImages] = useState([]); // UI images (existing + new)
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [deletedImages, setDeletedImages] = useState([]); // track deleted existing images
    const inputRef = useRef(null);
    const initializedRef = useRef(false);

    /* ----------------------------------------
       INIT EXISTING IMAGES (ONCE)
    ----------------------------------------- */
    useEffect(() => {
        if (initializedRef.current) return;

        const result = [];

        // Existing mainImage
        if (listingData?.existingImages?.mainImage) {
            result.push({
                url: `${IMAGE_URL}/${listingData.existingImages.mainImage}`,
                value: listingData.existingImages.mainImage, // string path
            });
        }

        // Existing galleryImages
        if (Array.isArray(listingData?.existingImages?.galleryImages)) {
            listingData.existingImages.galleryImages.forEach(img => {
                result.push({
                    url: `${IMAGE_URL}/${img}`,
                    value: img,
                });
            });
        }

        // New uploaded images (if any already in listingData.images)
        if (listingData?.images?.mainImage) {
            result.push({
                url: typeof listingData.images.mainImage === "string"
                    ? `${IMAGE_URL}/${listingData.images.mainImage}`
                    : URL.createObjectURL(listingData.images.mainImage),
                value: listingData.images.mainImage,
            });
        }
        if (Array.isArray(listingData?.images?.galleryImages)) {
            listingData.images.galleryImages.forEach(img => {
                result.push({
                    url: typeof img === "string" ? `${IMAGE_URL}/${img}` : URL.createObjectURL(img),
                    value: img,
                });
            });
        }

        setImages(result.slice(0, MAX_IMAGES));
        setSelectedUrl(result[0]?.url || null);
        initializedRef.current = true;
    }, [listingData]);

    /* ----------------------------------------
       UPLOAD NEW IMAGES
    ----------------------------------------- */
    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) {
            showToast('error', 'Maximum 5 images allowed');
            return;
        }

        const newImages = files.slice(0, remaining).map(file => ({
            url: URL.createObjectURL(file),
            value: file,
        }));

        syncState([...images, ...newImages], deletedImages);
        e.target.value = '';
    };

    /* ----------------------------------------
       REMOVE IMAGE
    ----------------------------------------- */
    const handleRemove = (index) => {
        const img = images[index];

        if (img?.value instanceof File) {
            URL.revokeObjectURL(img.url);
        }

        const updated = images.filter((_, i) => i !== index);

        // Track deleted existing images
        const newDeleted = [...deletedImages];
        if (typeof img.value === 'string') {
            newDeleted.push(img.value);
        }

        setDeletedImages(newDeleted);
        syncState(updated, newDeleted);
    };

    /* ----------------------------------------
       SYNC WITH PARENT (BACKEND MATCH)
    ----------------------------------------- */
    const syncState = (imageList, deleted = []) => {
        setImages(imageList);
        setSelectedUrl(imageList[0]?.url || null);

        const mainImage = imageList[0]?.value || null;
        const galleryImages = imageList.slice(1).map(img => img.value);

        onListingDataChange({
            mainImage,
            galleryImages,
            deletedImages: deleted,
        });
    };

    /* ----------------------------------------
       RENDER
    ----------------------------------------- */
    return (
        <Card className="mb-3">
            <CardBody>
                <h6 className="fw-bold mb-3">
                    Product Photos ({images.length}/{MAX_IMAGES})
                </h6>

                {/* Thumbnails */}
                <div className="d-flex gap-2 mb-3 overflow-auto">
                    {[...Array(MAX_IMAGES)].map((_, i) => (
                        <div
                            key={i}
                            className="border rounded position-relative"
                            style={{
                                width: 60,
                                height: 60,
                                background: '#f9f9f9',
                                cursor: images[i] ? 'pointer' : 'default',
                            }}
                        >
                            {images[i] ? (
                                <>
                                    <img
                                        src={images[i].url}
                                        alt="thumb"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <FaTimesCircle
                                        className="text-danger position-absolute"
                                        style={{
                                            top: 2,
                                            right: 2,
                                            cursor: 'pointer',
                                            background: 'white',
                                            borderRadius: '50%',
                                        }}
                                        onClick={() => handleRemove(i)}
                                    />
                                </>
                            ) : (
                                <small className="text-muted d-flex align-items-center justify-content-center h-100">
                                    Image
                                </small>
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Preview */}
                <div className="text-center my-3" style={{ minHeight: 160 }}>
                    {selectedUrl ? (
                        <img
                            src={selectedUrl}
                            alt="Selected"
                            className="img-thumbnail"
                            style={{ maxWidth: 220, maxHeight: 220 }}
                        />
                    ) : (
                        <FaUpload size={48} className="text-secondary" />
                    )}
                </div>

                {/* Upload */}
                <div className="text-center">
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={handleUpload}
                    />
                    <Button
                        color="primary"
                        disabled={images.length >= MAX_IMAGES}
                        onClick={() => inputRef.current.click()}
                    >
                        <FaUpload className="me-1" />
                        Upload Photo
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductPhotos;
