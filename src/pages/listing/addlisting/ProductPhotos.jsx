import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { FaUpload, FaTimesCircle, FaVideo } from 'react-icons/fa';

const ProductPhotos = ({ listingData = {}, onListingDataChange }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const inputRef = useRef();

  // Initialize
  useEffect(() => {
    const initial = [];

    if (listingData.mainImage) {
      const url = listingData.mainImage instanceof File
        ? URL.createObjectURL(listingData.mainImage)
        : listingData.mainImage;

      initial.push({ url, file: listingData.mainImage, type: 'image', isMain: true });
    }

    if (Array.isArray(listingData.galleryImages)) {
      listingData.galleryImages.forEach(file => {
        const url = file instanceof File ? URL.createObjectURL(file) : file;
        initial.push({ url, file, type: 'image', isMain: false });
      });
    }

    if (Array.isArray(listingData.videos)) {
      listingData.videos.forEach(file => {
        const url = file instanceof File ? URL.createObjectURL(file) : file;
        initial.push({ url, file, type: 'video', isMain: false });
      });
    }

    setMediaItems(initial);
    setSelectedItem(initial[0]?.url || null);

    return () => {
      initial.forEach(item => {
        if (item.url?.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [listingData]);

  const updateParent = (items) => {
    const mainImage = items.find(i => i.isMain && i.type === 'image')?.file || null;
    const galleryImages = items.filter(i => i.type === 'image' && !i.isMain).map(i => i.file);
    const videos = items.filter(i => i.type === 'video').map(i => i.file);

    onListingDataChange({ mainImage, galleryImages, videos });
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const newItems = files.map(file => {
      const isVideo = file.type.startsWith('video');
      return {
        url: URL.createObjectURL(file),
        file,
        type: isVideo ? 'video' : 'image',
        isMain: false
      };
    });

    const updated = [...mediaItems, ...newItems];

    // Ensure one main image
    if (!updated.some(i => i.isMain && i.type === 'image')) {
      const firstImage = updated.find(i => i.type === 'image');
      if (firstImage) firstImage.isMain = true;
    }

    setMediaItems(updated);
    setSelectedItem(updated[0]?.url || null);
    updateParent(updated);

    e.target.value = '';
  };

  const handleRemove = (index) => {
    const updated = mediaItems.filter((_, i) => i !== index);

    if (!updated.some(i => i.isMain && i.type === 'image')) {
      const firstImage = updated.find(i => i.type === 'image');
      if (firstImage) firstImage.isMain = true;
    }

    setMediaItems(updated);
    setSelectedItem(updated[0]?.url || null);
    updateParent(updated);
  };

  const setAsMain = (index) => {
    const updated = mediaItems.map((item, i) => ({
      ...item,
      isMain: item.type === 'image' && i === index
    }));

    setMediaItems(updated);
    updateParent(updated);
  };

  const selectedMedia = mediaItems.find(m => m.url === selectedItem);

  return (
    <Card className="mb-3">
      <CardBody>
        <h6 className="fw-bold mb-3">Media Upload (Images + Videos)</h6>

        {/* Thumbnails */}
        <div className="d-flex gap-2 mb-3 overflow-auto">
          {mediaItems.map((item, i) => (
            <div
              key={i}
              className="position-relative border rounded"
              style={{ width: 70, height: 70, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedItem(item.url)}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 bg-dark text-white">
                  <FaVideo />
                </div>
              )}

              {/* Main badge */}
              {item.isMain && (
                <span className="badge bg-primary position-absolute" style={{ top: 2, left: 2, fontSize: '10px' }}>
                  Main
                </span>
              )}

              {/* Remove */}
              <FaTimesCircle
                className="text-danger position-absolute"
                style={{ top: 2, right: 2, cursor: 'pointer', background: 'white', borderRadius: '50%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
              />

              {/* Set Main */}
              {item.type === 'image' && !item.isMain && (
                <button
                  className="btn btn-light btn-sm position-absolute"
                  style={{ bottom: 2, left: 2, right: 2, fontSize: '10px', padding: '2px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAsMain(i);
                  }}
                >
                  Set Main
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="text-center mb-3" style={{ minHeight: 150 }}>
          {selectedMedia ? (
            selectedMedia.type === 'video' ? (
              <video src={selectedMedia.url} controls style={{ maxWidth: 250 }} />
            ) : (
              <img src={selectedMedia.url} alt="" style={{ maxWidth: 250 }} />
            )
          ) : (
            <FaUpload size={40} />
          )}
        </div>

        {/* Upload */}
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          hidden
          ref={inputRef}
          onChange={handleUpload}
        />

        <div className="text-center">
          <Button onClick={() => inputRef.current.click()}>
            <FaUpload className="me-1" /> Upload Images / Videos
          </Button>
        </div>

        {/* Guidelines (enhanced with main + gallery + video) */}
        <div className="bg-light border p-3 rounded mt-4">
          <strong>Media Guidelines</strong>

          <div className="bg-info text-white p-2 rounded my-2">
            <small>Follow guidelines to reduce Quality Check failures</small>
          </div>

          <small>
            <strong>Image Resolution:</strong> Use clear color images with minimum resolution of <strong>1000×500 px</strong>.
          </small>
          <br />

          <small>
            <strong>Main Image:</strong> 
            - Should clearly show the product
            - Use plain/white background (recommended)
            - No watermark, logo, or text overlay
          </small>
          <br />

          <small>
            <strong>Gallery Images:</strong>
            - Show different angles and usage
            - Include close-ups and detail shots
            - Avoid duplicate images
          </small>
          <br />

          <small>
            <strong>Video Guidelines:</strong>
            - Keep video under 30–60 seconds
            - Show product usage or demo
            - Ensure stable and clear recording
          </small>
          <br />

          <small>
            <strong>General Tips:</strong>
            <br />
            - Use bright lighting and real product photos
            <br />
            - Drag images to reorder (optional)
            <br />
            - Ensure correct product view before uploading
          </small>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductPhotos;
