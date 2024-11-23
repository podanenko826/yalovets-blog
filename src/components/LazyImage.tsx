import {useState} from 'react';
import Image from 'next/image';

interface LazyImageProps {
    src: string; // Main image URL
    alt: string; // Alt text for accessibility
    title?: string; // Title attribute for the image
    className?: string; // Additional classes for styling
    width?: number; // Width of the image
    height?: number; // Height of the image
    sizes?: string; // Sizes attribute for responsive images
    placeholderUrl?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    title,
    className,
    width,
    height,
    sizes,
    placeholderUrl,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div style={{position: 'relative', width: width, height: height}}>
            {/* Placeholder Image (Visible until main image loads) */}
            {!imageLoaded && (
                <Image
                    src={placeholderUrl || '/ui/placeholder.png'}
                    alt={`${alt} placeholder`}
                    title={title}
                    className={className}
                    width={width}
                    height={height}
                    priority // Ensures the placeholder loads immediately
                />
            )}

            {/* Actual Image (Replaces placeholder once loaded) */}
            <Image
                src={src}
                alt={alt}
                title={title}
                className={`${className} img-fluid`}
                width={width}
                height={height}
                sizes={sizes}
                loading="lazy" // Enables lazy loading for the main image
                onLoad={() => setImageLoaded(true)} // Switch to main image on load
            />
        </div>
    );
};

export default LazyImage;
