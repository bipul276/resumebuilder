import { useSandboxStore } from '../../stores/useSandboxStore';
import { useTier } from '../../contexts/TierContext';
import { DraggableElement } from './DraggableElement';
import { useRef, useEffect, useState, useCallback } from 'react';

// Convert mm to pixels (96 DPI)
const MM_TO_PX = 96 / 25.4;

// Nudge amounts (in pixels)
const NUDGE_SMALL = 1;     // Normal arrow key
const NUDGE_MEDIUM = 5;    // Shift + arrow
const NUDGE_LARGE = 20;    // Ctrl + arrow

export function SandboxCanvas() {
    const { tier } = useTier();
    const { data, clearSelection, setZoom, pan, selectedIds, updateElementStyle } = useSandboxStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

    const { viewport, pages, currentPageIndex, gridEnabled, gridSize } = data;
    const currentPage = pages[currentPageIndex];

    // Page dimensions in pixels (with zoom)
    const pageWidthPx = currentPage ? currentPage.width * MM_TO_PX : 210 * MM_TO_PX;
    const pageHeightPx = currentPage ? currentPage.height * MM_TO_PX : 297 * MM_TO_PX;

    // Get elements for current page
    const pageElements = data.elements.filter((el) => el.pageId === currentPage?.id);

    // Handle wheel zoom (scroll up/down to zoom)
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.1, Math.min(4, viewport.zoom + delta));
        setZoom(newZoom);
    }, [viewport.zoom, setZoom]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);

    // Handle keyboard shortcuts for nudging elements
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle arrow keys
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

            // Only if elements are selected
            if (selectedIds.length === 0) return;

            // Don't interfere with text editing
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            e.preventDefault();

            // Determine nudge amount based on modifiers
            let nudgeAmount = NUDGE_SMALL;
            if (e.ctrlKey || e.metaKey) nudgeAmount = NUDGE_LARGE;
            else if (e.shiftKey) nudgeAmount = NUDGE_MEDIUM;

            // Calculate delta based on key
            let deltaX = 0;
            let deltaY = 0;
            switch (e.key) {
                case 'ArrowUp': deltaY = -nudgeAmount; break;
                case 'ArrowDown': deltaY = nudgeAmount; break;
                case 'ArrowLeft': deltaX = -nudgeAmount; break;
                case 'ArrowRight': deltaX = nudgeAmount; break;
            }

            // Apply to all selected elements
            selectedIds.forEach(id => {
                const element = data.elements.find(el => el.id === id);
                if (element && !element.locked) {
                    updateElementStyle(id, {
                        left: element.style.left + deltaX,
                        top: element.style.top + deltaY,
                    });
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, data.elements, updateElementStyle]);

    // Handle panning
    const handleMouseDown = (e: React.MouseEvent) => {
        // Right-click (button 2), Middle mouse (button 1), or Alt+left click
        if (e.button === 2 || e.button === 1 || (e.button === 0 && e.altKey)) {
            e.preventDefault();
            setIsPanning(true);
            setLastPanPoint({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const deltaX = e.clientX - lastPanPoint.x;
            const deltaY = e.clientY - lastPanPoint.y;
            pan(deltaX, deltaY);
            setLastPanPoint({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // Render grid overlay
    const renderGrid = () => {
        if (!gridEnabled) return null;

        const gridSizePx = gridSize * viewport.zoom;

        return (
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            >
                <defs>
                    <pattern
                        id="grid"
                        width={gridSizePx}
                        height={gridSizePx}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M ${gridSizePx} 0 L 0 0 0 ${gridSizePx}`}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        );
    };

    // Render guides
    const renderGuides = () => {
        return data.guides.map((guide) => (
            <div
                key={guide.id}
                style={{
                    position: 'absolute',
                    [guide.orientation === 'horizontal' ? 'top' : 'left']: `${guide.position * MM_TO_PX * viewport.zoom}px`,
                    [guide.orientation === 'horizontal' ? 'left' : 'top']: 0,
                    [guide.orientation === 'horizontal' ? 'width' : 'height']: '100%',
                    [guide.orientation === 'horizontal' ? 'height' : 'width']: '1px',
                    backgroundColor: '#06b6d4',
                    pointerEvents: 'none',
                    zIndex: 1000,
                }}
            />
        ));
    };

    return (
        <div
            ref={containerRef}
            className="sandbox-canvas-container"
            onClick={(e) => {
                if (e.target === e.currentTarget || e.target === containerRef.current?.querySelector('.sandbox-page')) {
                    clearSelection();
                }
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#e5e7eb',
                overflow: 'auto',
                padding: '40px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                cursor: isPanning ? 'grabbing' : 'default',
            }}
        >
            <div
                style={{
                    transform: `translate(${viewport.panX}px, ${viewport.panY}px)`,
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                }}
            >
                <div
                    className="sandbox-page"
                    style={{
                        width: `${pageWidthPx * viewport.zoom}px`,
                        height: `${pageHeightPx * viewport.zoom}px`,
                        backgroundColor: currentPage?.backgroundColor || '#ffffff',
                        position: 'relative',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                        transformOrigin: 'center center',
                    }}
                >
                    {renderGrid()}
                    {renderGuides()}

                    {/* Watermark for Free Tier */}
                    {tier === 'free' && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 999,
                            opacity: 0.15,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            justifyContent: 'space-around',
                            overflow: 'hidden',
                        }}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} style={{
                                    width: '300px',
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: 'rotate(-45deg)',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#000',
                                    whiteSpace: 'nowrap',
                                }}>
                                    Created with Resume Sandbox
                                </div>
                            ))}
                        </div>
                    )}

                    {pageElements.map((element) => (
                        <DraggableElement key={element.id} element={element} zoom={viewport.zoom} />
                    ))}
                </div>
            </div>
        </div>
    );
}
