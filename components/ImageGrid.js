import { useState, useEffect, useRef } from 'react';

export default function ImageGrid({ folder, onImageClick }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    if (!folder) return;

    setLoading(true);
    setLoadedImages(new Set());
    fetch('/api/images?folder=' + encodeURIComponent(folder))
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading images:', err);
        setLoading(false);
      });
  }, [folder]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observerRef.current.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleImageLoad = (idx) => {
    setLoadedImages(prev => new Set([...prev, idx]));
  };

  const attachObserver = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  if (!folder) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a folder to view images
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading images...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="aspect-auto bg-gray-200 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
            onClick={() => onImageClick(idx)}
          >
            {!loadedImages.has(idx) && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-200 animate-shimmer"></div>
            )}
            <img
              ref={attachObserver}
              data-src={'/api/serve-image?path=' + encodeURIComponent(image.path)}
              alt={image.name}
              className={'w-full h-full object-cover transition-opacity duration-300 ' + (loadedImages.has(idx) ? 'opacity-100' : 'opacity-0')}
              onLoad={() => handleImageLoad(idx)}
            />
          </div>
        ))}
      </div>
      {images.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No images found in this folder
        </div>
      ) : null}
    </div>
  );
}