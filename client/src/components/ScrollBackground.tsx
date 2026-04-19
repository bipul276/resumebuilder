import React, { useEffect, useRef } from 'react';

const frameCount = 40;

const currentFrame = (index: number) => 
    `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

export const ScrollBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Preload images
        const images: HTMLImageElement[] = [];
        let imagesLoaded = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === 1) {
                    // Draw the first image right when it loads just in case resize hasn't
                    drawImage(img);
                }
            };
            images.push(img);
        }

        const drawImage = (img: HTMLImageElement) => {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            if (imgWidth === 0 || imgHeight === 0) return;

            const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
            const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Redraw current frame
            const html = document.documentElement;
            const scrollTop = html.scrollTop || document.body.scrollTop;
            const maxScrollTop = html.scrollHeight - window.innerHeight;
            const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
            const frameIndex = Math.min(
                frameCount - 1,
                Math.max(0, Math.floor(scrollFraction * frameCount))
            );
            
            if (images[frameIndex] && images[frameIndex].complete) {
                drawImage(images[frameIndex]);
            }
        };

        const handleScroll = () => {
            requestAnimationFrame(() => {
                const html = document.documentElement;
                const scrollTop = html.scrollTop || document.body.scrollTop;
                const maxScrollTop = html.scrollHeight - window.innerHeight;
                
                const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
                let frameIndex = Math.floor(scrollFraction * frameCount);
                if (frameIndex >= frameCount) frameIndex = frameCount - 1;
                if (frameIndex < 0) frameIndex = 0;
                
                if (images[frameIndex] && images[frameIndex].complete) {
                    drawImage(images[frameIndex]);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        // Initial sizing
        handleResize();

        // One more resize pass after a short delay to handle scrollbar appearance
        setTimeout(handleResize, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -10,
                    background: '#000', // Fallback color
                }}
            />
            {/* Subtle, semi-transparent dark CSS overlay */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -9,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    pointerEvents: 'none'
                }}
            />
        </>
    );
};
