import React from 'react';

/**
 * Gallery with the images a company attached when creating a request (product / service).
 * Click opens the full-size image in a new tab.
 */
export default function RequestImageGallery({ images = [], className = '' }) {
    if (images.length === 0) return null;

    const single = images.length === 1;

    return (
        <div className={`grid gap-2 ${single ? 'grid-cols-1' : 'grid-cols-2'} ${className}`}>
            {images.map((img, idx) => (
                <a
                    key={img.id || img.url}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm ${single ? 'aspect-[21/9]' : 'aspect-video'}`}
                >
                    <img
                        src={img.url}
                        alt={img.file_name || `Imagen ${idx + 1}`}
                        loading="lazy"
                        className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </a>
            ))}
        </div>
    );
}
