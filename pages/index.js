import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ImageGrid from '../components/ImageGrid';
import Lightbox from '../components/Lightbox';

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!selectedFolder) return;

    fetch('/api/images?folder=' + encodeURIComponent(selectedFolder))
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Error loading images:', err));
  }, [selectedFolder]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNavigate = (direction) => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onFolderSelect={setSelectedFolder}
        selectedFolder={selectedFolder}
      />
      <ImageGrid
        folder={selectedFolder}
        onImageClick={handleImageClick}
      />
      {lightboxOpen ? (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={handleNavigate}
        />
      ) : null}
    </div>
  );
}