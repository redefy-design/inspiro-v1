import { useEffect } from 'react';

export default function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl max-h-screen p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={'/api/serve-image?path=' + encodeURIComponent(currentImage.path)}
          alt={currentImage.name}
          className="max-w-full max-h-screen object-contain"
        />
        
        <div className="absolute top-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>

        {currentIndex > 0 ? (
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-75"
          >
            ←
          </button>
        ) : null}

        {currentIndex < images.length - 1 ? (
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-75"
          >
            →
          </button>
        ) : null}

        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75"
        >
          ESC
        </button>
      </div>
    </div>
  );
}