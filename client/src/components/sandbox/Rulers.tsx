import { useSandboxStore } from '../../stores/useSandboxStore';
import { useRef, useEffect, useState } from 'react';

interface RulersProps {
    canvasRef: React.RefObject<HTMLDivElement>;
}

// Convert mm to pixels (assuming 96 DPI)
const MM_TO_PX = 96 / 25.4;

export function Rulers({ canvasRef }: RulersProps) {
    const { data, addGuide } = useSandboxStore();
    const { showRulers, unit, viewport } = data;
    const [canvasBounds, setCanvasBounds] = useState({ left: 0, top: 0 });

    const rulerThickness = 24;
    const zoom = viewport.zoom;

    useEffect(() => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setCanvasBounds({ left: rect.left, top: rect.top });
        }
    }, [canvasRef, viewport]);

    if (!showRulers) return null;

    const currentPage = data.pages[data.currentPageIndex];
    if (!currentPage) return null;

    // Page dimensions in pixels
    const pageWidthPx = currentPage.width * MM_TO_PX * zoom;
    const pageHeightPx = currentPage.height * MM_TO_PX * zoom;

    // Tick interval based on unit
    const getTickInterval = () => {
        switch (unit) {
            case 'mm': return 10; // 10mm intervals
            case 'pt': return 36; // 36pt (0.5 inch) intervals
            case 'px': return 50; // 50px intervals
            default: return 10;
        }
    };

    const tickInterval = getTickInterval();
    const tickIntervalPx = unit === 'mm'
        ? tickInterval * MM_TO_PX * zoom
        : unit === 'pt'
            ? tickInterval * (96 / 72) * zoom
            : tickInterval * zoom;

    const renderHorizontalRuler = () => {
        const ticks: React.ReactNode[] = [];
        const numTicks = Math.ceil(pageWidthPx / tickIntervalPx) + 1;

        for (let i = 0; i <= numTicks; i++) {
            const pos = i * tickIntervalPx;
            const value = i * tickInterval;
            const isMajor = i % 5 === 0;

            ticks.push(
                <div
                    key={`h-${i}`}
                    style={{
                        position: 'absolute',
                        left: `${pos}px`,
                        top: isMajor ? '8px' : '14px',
                        height: isMajor ? '16px' : '10px',
                        width: '1px',
                        backgroundColor: isMajor ? '#6b7280' : '#d1d5db',
                    }}
                />
            );

            if (isMajor) {
                ticks.push(
                    <span
                        key={`h-label-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${pos + 3}px`,
                            top: '2px',
                            fontSize: '9px',
                            color: '#6b7280',
                            userSelect: 'none',
                        }}
                    >
                        {value}
                    </span>
                );
            }
        }

        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: rulerThickness,
                    right: 0,
                    height: `${rulerThickness}px`,
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    cursor: 'crosshair',
                }}
                onDoubleClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const position = x / (MM_TO_PX * zoom);
                    addGuide('vertical', position);
                }}
            >
                <div style={{ position: 'relative', marginLeft: '40px' }}>
                    {ticks}
                </div>
            </div>
        );
    };

    const renderVerticalRuler = () => {
        const ticks: React.ReactNode[] = [];
        const numTicks = Math.ceil(pageHeightPx / tickIntervalPx) + 1;

        for (let i = 0; i <= numTicks; i++) {
            const pos = i * tickIntervalPx;
            const value = i * tickInterval;
            const isMajor = i % 5 === 0;

            ticks.push(
                <div
                    key={`v-${i}`}
                    style={{
                        position: 'absolute',
                        top: `${pos}px`,
                        left: isMajor ? '8px' : '14px',
                        width: isMajor ? '16px' : '10px',
                        height: '1px',
                        backgroundColor: isMajor ? '#6b7280' : '#d1d5db',
                    }}
                />
            );

            if (isMajor) {
                ticks.push(
                    <span
                        key={`v-label-${i}`}
                        style={{
                            position: 'absolute',
                            top: `${pos + 2}px`,
                            left: '2px',
                            fontSize: '9px',
                            color: '#6b7280',
                            userSelect: 'none',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                        }}
                    >
                        {value}
                    </span>
                );
            }
        }

        return (
            <div
                style={{
                    position: 'absolute',
                    top: rulerThickness,
                    left: 0,
                    bottom: 0,
                    width: `${rulerThickness}px`,
                    backgroundColor: '#f9fafb',
                    borderRight: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    cursor: 'crosshair',
                }}
                onDoubleClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const position = y / (MM_TO_PX * zoom);
                    addGuide('horizontal', position);
                }}
            >
                <div style={{ position: 'relative', marginTop: '40px' }}>
                    {ticks}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Corner piece */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${rulerThickness}px`,
                    height: `${rulerThickness}px`,
                    backgroundColor: '#f9fafb',
                    borderRight: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: '#9ca3af',
                    zIndex: 10,
                }}
            >
                {unit}
            </div>
            {renderHorizontalRuler()}
            {renderVerticalRuler()}
        </>
    );
}
