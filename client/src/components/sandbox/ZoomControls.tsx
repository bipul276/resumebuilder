import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { useState, useRef, useEffect } from 'react';

const ZOOM_PRESETS = [
    { label: '10%', value: 0.1 },
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1 },
    { label: '150%', value: 1.5 },
    { label: '200%', value: 2 },
    { label: '300%', value: 3 },
    { label: '400%', value: 4 },
];

export function ZoomControls() {
    const { data, setZoom, zoomIn, zoomOut, resetZoom, resetViewport } = useSandboxStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentZoom = data.viewport.zoom;
    const zoomPercentage = Math.round(currentZoom * 100);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        border: 'none',
        background: 'transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#4b5563',
        transition: 'all 0.15s ease',
    };

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)',
                zIndex: 100,
            }}
        >
            <button
                onClick={zoomOut}
                disabled={currentZoom <= 0.1}
                style={{
                    ...buttonStyle,
                    opacity: currentZoom <= 0.1 ? 0.4 : 1,
                }}
                title="Zoom Out"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <ZoomOut size={18} />
            </button>

            <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '60px',
                        height: '32px',
                        padding: '0 8px',
                        border: 'none',
                        background: showDropdown ? '#f3f4f6' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#111827',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => {
                        if (!showDropdown) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    {zoomPercentage}%
                </button>

                {showDropdown && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '8px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            overflow: 'hidden',
                            minWidth: '100px',
                        }}
                    >
                        {ZOOM_PRESETS.map((preset) => (
                            <button
                                key={preset.value}
                                onClick={() => {
                                    setZoom(preset.value);
                                    setShowDropdown(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: currentZoom === preset.value ? '#eff6ff' : 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    textAlign: 'left',
                                    color: currentZoom === preset.value ? '#2563eb' : '#374151',
                                    fontWeight: currentZoom === preset.value ? 500 : 400,
                                }}
                                onMouseEnter={(e) => {
                                    if (currentZoom !== preset.value) {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentZoom !== preset.value) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={zoomIn}
                disabled={currentZoom >= 4}
                style={{
                    ...buttonStyle,
                    opacity: currentZoom >= 4 ? 0.4 : 1,
                }}
                title="Zoom In"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <ZoomIn size={18} />
            </button>

            <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />

            <button
                onClick={resetZoom}
                style={buttonStyle}
                title="Reset to 100%"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <RotateCcw size={16} />
            </button>

            <button
                onClick={resetViewport}
                style={buttonStyle}
                title="Fit to View"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <Maximize size={16} />
            </button>
        </div>
    );
}
