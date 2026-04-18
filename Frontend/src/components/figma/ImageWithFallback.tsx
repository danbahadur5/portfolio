import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement> & { width?: number; height?: number }) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, width, height, ...rest } = props

  // Reset error state when src changes
  React.useEffect(() => {
    setDidError(false)
  }, [src])

  // Optimize Unsplash or Cloudinary URLs
  const optimizedSrc = React.useMemo(() => {
    if (!src || typeof src !== 'string') return src;
    
    try {
      if (src.includes('unsplash.com') && src.startsWith('http')) {
        const url = new URL(src);
        if (width) url.searchParams.set('w', width.toString());
        if (height) url.searchParams.set('h', height.toString());
        url.searchParams.set('fm', 'webp');
        url.searchParams.set('q', '80');
        return url.toString();
      }
      
      if (src.includes('cloudinary.com') && src.includes('/upload/')) {
        const params = ['f_auto', 'q_auto'];
        if (width) params.push(`w_${width}`);
        if (height) params.push(`h_${height}`);
        
        return src.replace('/upload/', `/upload/${params.join(',')}/`);
      }
    } catch (e) {
      console.error('Error optimizing image URL:', e);
      return src;
    }
    
    return src;
  }, [src, width, height]);

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img 
      src={optimizedSrc} 
      alt={alt} 
      className={className} 
      style={style} 
      width={width}
      height={height}
      loading="lazy"
      {...rest} 
      onError={handleError} 
    />
  )
}
