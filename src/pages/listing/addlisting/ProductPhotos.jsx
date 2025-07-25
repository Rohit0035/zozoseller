import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';
import { showToast } from '../../../components/ToastifyNotification'; // Assuming you have this

const ProductPhotos = ({ listingData, onListingDataChange }) => {
    // Local state for image previews (URLs) and File objects for upload
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
    const inputRef = useRef();

    // Effect to initialize local state from listingData when component mounts or listingData changes
    useEffect(() => {
        const initialImages = [];
        let initialSelected = null;

        // If mainImage exists in listingData
        if (listingData.mainImage) {
            const mainImageUrl = listingData.mainImage instanceof File ? URL.createObjectURL(listingData.mainImage) : listingData.mainImage;
            initialImages.push({ url: mainImageUrl, file: listingData.mainImage });
            initialSelected = mainImageUrl; // Main image is the default selected
        }

        // If galleryImages exist, add them
        if (listingData.galleryImages && Array.isArray(listingData.galleryImages)) {
            listingData.galleryImages.forEach(file => {
                const imageUrl = file instanceof File ? URL.createObjectURL(file) : file;
                initialImages.push({ url: imageUrl, file: file });
            });
        }

        setPreviewImages(initialImages.slice(0, 5)); // Ensure max 5 images
        if (initialSelected) {
            setSelectedPreviewImage(initialSelected);
        } else if (initialImages.length > 0) {
            setSelectedPreviewImage(initialImages[0].url); // Select first available if main not set
        }

        // Cleanup URL objects when component unmounts or images change
        return () => {
            initialImages.forEach(img => {
                if (img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [listingData.mainImage, listingData.galleryImages]);


    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const currentFilesCount = previewImages.length;
        const remainingSlots = 5 - currentFilesCount;

        if (remainingSlots <= 0) {
            showToast('error', 'You can upload a maximum of 5 images.');
            e.target.value = '';
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);

        const newImagesData = filesToProcess.map((file) => ({
            url: URL.createObjectURL(file), // Create a URL for preview
            file: file, // Store the actual File object
        }));

        const updatedImagesData = [...previewImages, ...newImagesData];
        setPreviewImages(updatedImagesData);

        // Determine main image and gallery images
        let newMainImage = updatedImagesData.length > 0 ? updatedImagesData[0].file : null;
        let newGalleryImages = updatedImagesData.slice(1).map(img => img.file);

        // If no main image was previously selected, set the first new image as selected
        if (!selectedPreviewImage && newImagesData.length > 0) {
            setSelectedPreviewImage(newImagesData[0].url);
        }

        // Update parent state (listingData)
        onListingDataChange({
            mainImage: newMainImage,
            galleryImages: newGalleryImages,
        });

        e.target.value = ''; // Clear input to allow re-uploading same file
    };

    const handleThumbnailClick = (url) => {
        setSelectedPreviewImage(url);
        // Optionally, you might want to update which image is "main" in listingData here
        // This would require more complex logic (e.g., reordering the `files` array and then updating mainImage/galleryImages)
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = previewImages.filter((_, index) => index !== indexToRemove);
        setPreviewImages(updatedImages);

        // If the selected image was removed, reset selected or pick a new one
        if (selectedPreviewImage === previewImages[indexToRemove]?.url) {
            if (updatedImages.length > 0) {
                setSelectedPreviewImage(updatedImages[0].url);
            } else {
                setSelectedPreviewImage(null);
            }
        }

        // Re-determine main and gallery images based on updated list
        let newMainImage = updatedImages.length > 0 ? updatedImages[0].file : null;
        let newGalleryImages = updatedImages.slice(1).map(img => img.file);

        // Update parent state
        onListingDataChange({
            mainImage: newMainImage,
            galleryImages: newGalleryImages,
        });
    };

    // This "Save" button is redundant if we are updating state immediately on upload/remove
    // However, if you want a "staging" area before saving, you'd move `onListingDataChange` here.
    const handleSavePhotos = () => {
        // Since onListingDataChange is called directly in handleUpload/handleRemoveImage,
        // this button is more for visual confirmation or if you added a "draft" stage.
        showToast('success', 'Product photos updated.');
    };

    return (
        <Card className="mb-3">
            <CardBody>
                <div className='d-flex align-items-center mb-3'>
                    <h6 className="fw-bold mb-0">Product Photos ({previewImages.length}/5)</h6>
                    {/* <div className='ms-auto'>
                        <Button className='btn btn-danger btn-sm me-1'>Cancel</Button>
                        <Button className='btn btn-primary btn-sm' onClick={handleSavePhotos}>Save</Button>
                    </div> */}
                </div>
                <div className="d-flex gap-2 mb-3 overflow-auto">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`border text-center p-1 position-relative rounded ${selectedPreviewImage === previewImages[i]?.url ? 'border-primary border-2' : ''}`}
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: previewImages[i] ? 'pointer' : 'default',
                                background: '#f9f9f9',
                                overflow: 'hidden',
                            }}
                        >
                            {previewImages[i] ? (
                                <>
                                    <img
                                        src={previewImages[i].url}
                                        alt={`thumb-${i}`}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        onClick={() => handleThumbnailClick(previewImages[i].url)}
                                    />
                                    <FaTimesCircle
                                        className="text-danger position-absolute"
                                        style={{ top: '2px', right: '2px', cursor: 'pointer', background: 'white', borderRadius: '50%' }}
                                        onClick={() => handleRemoveImage(i)}
                                    />
                                </>
                            ) : (
                                <small>Image</small>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center my-3" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedPreviewImage ? (
                        <img
                            src={selectedPreviewImage}
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
                        disabled={previewImages.length >= 5}
                    >
                        <FaUpload className="me-1" />
                        Upload Photo
                    </Button>
                </div>

                <div className="bg-light border p-3 rounded mt-4">
                    <strong>Image Guidelines</strong>
                    <div className="bg-info text-white p-2 rounded my-2">
                        <small>Follow Image Guidelines to reduce Quality Check failures</small>
                    </div>
                    <small><strong>Image Resolution:</strong> Use clear color images with minimum resolution of <strong>1000×500 px</strong>.</small><br />
                    <small><strong>Image Guidelines:</strong> Upload authentic product photos taken in bright lighting.</small><br />
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