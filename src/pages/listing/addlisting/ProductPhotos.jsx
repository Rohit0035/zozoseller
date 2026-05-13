import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button, Badge } from 'reactstrap';
import { FaUpload, FaTimesCircle, FaVideo, FaImage } from 'react-icons/fa';
import { IMAGE_URL } from '../../../utils/api-config';

const ProductPhotos = ({ listingData = {}, onListingDataChange }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedItemUrl, setSelectedItemUrl] = useState(null);
  const [removedMedia, setRemovedMedia] = useState([]);
  const inputRef = useRef();

  /* ----------------------------------------
     INIT + SYNC
  ----------------------------------------- */
  useEffect(() => {
    if (!listingData) return;

    const initial = [];

    // MAIN IMAGE
    if (listingData.mainImage) {
      const url =
        listingData.mainImage instanceof File
          ? URL.createObjectURL(listingData.mainImage)
          : `${IMAGE_URL}/${listingData.mainImage}`;

      initial.push({
        url,
        file: listingData.mainImage,
        type: 'image',
        isMain: true
      });
    }

    // GALLERY IMAGES
    if (Array.isArray(listingData.galleryImages)) {
      listingData.galleryImages.forEach(file => {
        const url =
          file instanceof File
            ? URL.createObjectURL(file)
            : `${IMAGE_URL}/${file}`;

        initial.push({
          url,
          file,
          type: 'image',
          isMain: false
        });
      });
    }

    // VIDEOS
    if (Array.isArray(listingData.videos)) {
      listingData.videos.forEach(file => {
        const url =
          file instanceof File
            ? URL.createObjectURL(file)
            : `${IMAGE_URL}/${file}`;

        initial.push({
          url,
          file,
          type: 'video',
          isMain: false
        });
      });
    }

    setMediaItems(initial);
    setSelectedItemUrl(initial[0]?.url || null);

  }, [listingData.mainImage, listingData.galleryImages, listingData.videos]);

  /* ----------------------------------------
     CLEANUP
  ----------------------------------------- */
  useEffect(() => {
    return () => {
      mediaItems.forEach(item => {
        if (item.url?.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, []);

  /* ----------------------------------------
     UPDATE PARENT
  ----------------------------------------- */
  const updateParent = (items, removed = removedMedia) => {
    const mainImage =
      items.find(i => i.isMain && i.type === 'image')?.file || null;

    const galleryImages = items
      .filter(i => i.type === 'image' && !i.isMain)
      .map(i => i.file);

    const videos = items
      .filter(i => i.type === 'video')
      .map(i => i.file);

    onListingDataChange({
      mainImage,
      galleryImages,
      videos,
      removedGalleryImages: JSON.stringify(
        removed.filter(i => typeof i === 'string')
      )
    });
  };

  /* ----------------------------------------
     UPLOAD
  ----------------------------------------- */
  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      type: file.type.startsWith('video') ? 'video' : 'image',
      isMain: false
    }));

    const updated = [...mediaItems, ...newItems];

    if (!updated.some(i => i.isMain && i.type === 'image')) {
      const firstImage = updated.find(i => i.type === 'image');
      if (firstImage) firstImage.isMain = true;
    }

    setMediaItems(updated);
    if (!selectedItemUrl) setSelectedItemUrl(newItems[0].url);

    updateParent(updated);
    e.target.value = '';
  };

  /* ----------------------------------------
     REMOVE
  ----------------------------------------- */
  const handleRemove = (index) => {
    const itemToRemove = mediaItems[index];
    const updated = mediaItems.filter((_, i) => i !== index);

    let newRemoved = [...removedMedia];
    if (!(itemToRemove.file instanceof File)) {
      newRemoved.push(itemToRemove.file);
    }

    if (itemToRemove.isMain) {
      const nextImage = updated.find(i => i.type === 'image');
      if (nextImage) nextImage.isMain = true;
    }

    if (selectedItemUrl === itemToRemove.url) {
      setSelectedItemUrl(updated[0]?.url || null);
    }

    if (itemToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(itemToRemove.url);
    }

    setRemovedMedia(newRemoved);
    setMediaItems(updated);
    updateParent(updated, newRemoved);
  };

  /* ----------------------------------------
     SET MAIN
  ----------------------------------------- */
  const setAsMain = (index) => {
    const updated = mediaItems.map((item, i) => ({
      ...item,
      isMain: item.type === 'image' && i === index
    }));

    setMediaItems(updated);
    updateParent(updated);
  };

  const selectedMedia = mediaItems.find(m => m.url === selectedItemUrl);

  /* ----------------------------------------
     UI
  ----------------------------------------- */
  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <h6 className="fw-bold mb-3">Product Media</h6>

        {/* PREVIEW */}
        <div
          className="d-flex align-items-center justify-content-center border rounded mb-3 bg-light"
          style={{ height: 320 }}
        >
          {selectedMedia ? (
            selectedMedia.type === 'video' ? (
              <video src={selectedMedia.url} controls style={{ maxHeight: '100%' }} />
            ) : (
              <img src={selectedMedia.url} alt="" style={{ maxHeight: '100%' }} />
            )
          ) : (
            <FaImage size={48} className="text-muted" />
          )}
        </div>

        {/* GRID */}
        <div
          className="p-2 border rounded bg-white mb-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 80px)',
            gap: 10
          }}
        >
          {mediaItems.map((item, i) => (
            <div
              key={i}
              className="position-relative border rounded p-1"
              style={{ width: 80, cursor: 'pointer', background: '#fff' }}
              onClick={() => setSelectedItemUrl(item.url)}
            >
              {/* Image / Video */}
              <div style={{ height: 60 }}>
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-dark text-white d-flex h-100 align-items-center justify-content-center">
                    <FaVideo />
                  </div>
                )}
              </div>

              {/* MAIN BUTTON BELOW */}
              {item.type === 'image' && (
                <div className="mt-1">
                  {item.isMain ? (
                    <Badge color="primary" className="w-100 text-center">
                      Main
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      color="light"
                      className="w-100"
                      style={{ fontSize: '10px', padding: '2px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAsMain(i);
                      }}
                    >
                      Set Main
                    </Button>
                  )}
                </div>
              )}

              {/* REMOVE */}
              <FaTimesCircle
                className="text-danger position-absolute"
                style={{ top: -6, right: -6, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
              />
            </div>
          ))}

          {/* Upload */}
          <div
            className="border border-dashed d-flex align-items-center justify-content-center"
            style={{ width: 80, height: 80, cursor: 'pointer' }}
            onClick={() => inputRef.current.click()}
          >
            <FaUpload />
          </div>
        </div>

        <input
          type="file"
          multiple
          accept="image/*,video/*"
          hidden
          ref={inputRef}
          onChange={handleUpload}
        />
      </CardBody>
    </Card>
  );
};

export default ProductPhotos;