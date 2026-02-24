import { useSandboxStore } from '../../stores/useSandboxStore';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Palette, Type, AlertTriangle, Check } from 'lucide-react';

// ATS-safe fonts list
const ATS_SAFE_FONTS = [
    'Arial',
    'Calibri',
    'Cambria',
    'Georgia',
    'Helvetica',
    'Times New Roman',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Garamond',
];

// Font pairing presets
const FONT_PAIRINGS = [
    { name: 'Classic', heading: 'Georgia', body: 'Arial' },
    { name: 'Modern', heading: 'Inter', body: 'Inter' },
    { name: 'Professional', heading: 'Calibri', body: 'Calibri' },
    { name: 'Elegant', heading: 'Playfair Display', body: 'Source Sans Pro' },
    { name: 'Tech', heading: 'Roboto', body: 'Roboto' },
    { name: 'Clean', heading: 'Helvetica', body: 'Helvetica' },
];

// Theme presets
const THEME_PRESETS = [
    { name: 'Professional Blue', primary: '#2563eb', accent: '#3b82f6', muted: '#6b7280' },
    { name: 'Executive Gray', primary: '#374151', accent: '#6b7280', muted: '#9ca3af' },
    { name: 'Modern Teal', primary: '#0d9488', accent: '#14b8a6', muted: '#5eead4' },
    { name: 'Creative Purple', primary: '#7c3aed', accent: '#8b5cf6', muted: '#a78bfa' },
    { name: 'Bold Orange', primary: '#ea580c', accent: '#f97316', muted: '#fb923c' },
    { name: 'Classic Black', primary: '#171717', accent: '#404040', muted: '#737373' },
];

interface StylesPanelProps {
    collapsed?: boolean;
}

export function StylesPanel({ collapsed = false }: StylesPanelProps) {
    const { data, updateElement, setPrimaryColor, setAccentColor } = useSandboxStore();
    const [showTextStyles, setShowTextStyles] = useState(true);
    const [showThemes, setShowThemes] = useState(true);
    const [showFontPairings, setShowFontPairings] = useState(false);

    const { globalStyles } = data;

    const applyTextStyle = (styleId: string) => {
        const { selectedIds, data: storeData } = useSandboxStore.getState();
        const textStyle = globalStyles.textStyles.find((s) => s.id === styleId);

        if (!textStyle || selectedIds.length === 0) return;

        selectedIds.forEach((id) => {
            const element = storeData.elements.find((el) => el.id === id);
            if (element && element.type === 'text') {
                useSandboxStore.getState().updateElementStyle(id, {
                    fontSize: textStyle.fontSize,
                    fontWeight: textStyle.fontWeight,
                    fontFamily: textStyle.fontFamily,
                    lineHeight: textStyle.lineHeight,
                    letterSpacing: textStyle.letterSpacing,
                    color: textStyle.color,
                });
                useSandboxStore.getState().updateElement(id, { textStyleId: styleId });
            }
        });
    };

    const applyTheme = (theme: typeof THEME_PRESETS[0]) => {
        const { globalStyles } = useSandboxStore.getState().data;
        const oldPrimary = globalStyles.primaryColor;
        const oldAccent = globalStyles.accentColor;
        const oldMuted = globalStyles.mutedColor;

        setPrimaryColor(theme.primary);
        setAccentColor(theme.accent);

        // Update muted color and propagate changes to elements
        useSandboxStore.setState((state) => {
            const updatedElements = state.data.elements.map((el) => {
                const newStyle = { ...el.style };
                let changed = false;

                // Helper to swap colors
                const swapColor = (color?: string) => {
                    if (!color) return color;
                    if (color === oldPrimary) return theme.primary;
                    if (color === oldAccent) return theme.accent;
                    if (color === oldMuted) return theme.muted;
                    return color;
                };

                // Check background color
                const newBg = swapColor(el.style.backgroundColor);
                if (newBg !== el.style.backgroundColor) {
                    newStyle.backgroundColor = newBg;
                    changed = true;
                }

                // Check text color
                const newColor = swapColor(el.style.color);
                if (newColor !== el.style.color) {
                    newStyle.color = newColor;
                    changed = true;
                }

                // Check border color
                const newBorder = swapColor(el.style.borderColor);
                if (newBorder !== el.style.borderColor) {
                    newStyle.borderColor = newBorder;
                    changed = true;
                }

                return changed ? { ...el, style: newStyle } : el;
            });

            return {
                data: {
                    ...state.data,
                    elements: updatedElements,
                    globalStyles: {
                        ...state.data.globalStyles,
                        mutedColor: theme.muted,
                    },
                },
            };
        });
    };

    const applyFontPairing = (pairing: typeof FONT_PAIRINGS[0]) => {
        // Update global styles
        useSandboxStore.setState((state) => {
            const newTextStyles = state.data.globalStyles.textStyles.map((style) => {
                if (['h1', 'h2', 'h3'].includes(style.id)) {
                    return { ...style, fontFamily: pairing.heading };
                }
                return { ...style, fontFamily: pairing.body };
            });

            // Update existing elements that use these styles
            const updatedElements = state.data.elements.map((el) => {
                if (el.type === 'text' && el.textStyleId) {
                    const isHeading = ['h1', 'h2', 'h3'].includes(el.textStyleId);
                    return {
                        ...el,
                        style: {
                            ...el.style,
                            fontFamily: isHeading ? pairing.heading : pairing.body,
                        },
                    };
                }
                return el;
            });

            return {
                data: {
                    ...state.data,
                    elements: updatedElements,
                    globalStyles: {
                        ...state.data.globalStyles,
                        textStyles: newTextStyles,
                    },
                },
            };
        });
    };

    const checkATSSafe = (fontFamily: string): boolean => {
        return ATS_SAFE_FONTS.some((f) =>
            fontFamily.toLowerCase().includes(f.toLowerCase())
        );
    };

    if (collapsed) return null;

    const sectionStyle: React.CSSProperties = {
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px',
        marginBottom: '16px',
    };

    const sectionHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: '8px 0',
    };

    return (
        <div style={{ padding: '16px', fontSize: '13px' }}>
            {/* Text Styles Section */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => setShowTextStyles(!showTextStyles)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Type size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Text Styles</span>
                    </div>
                    {showTextStyles ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {showTextStyles && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                        {globalStyles.textStyles.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => applyTextStyle(style.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: `${Math.min(style.fontSize, 18)}px`,
                                            fontWeight: style.fontWeight as any,
                                            fontFamily: style.fontFamily,
                                            color: style.color,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {style.name}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                                        {style.fontFamily} · {style.fontSize}px · {style.fontWeight}
                                    </div>
                                </div>
                                {!checkATSSafe(style.fontFamily) && (
                                    <div title="Font may not be ATS-safe">
                                        <AlertTriangle size={14} color="#f59e0b" />
                                    </div>
                                )}
                            </button>
                        ))}
                        <p style={{ fontSize: '10px', color: '#9ca3af', margin: '8px 0 0' }}>
                            Click a style to apply to selected text elements
                        </p>
                    </div>
                )}
            </div>

            {/* Theme Colors Section */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => setShowThemes(!showThemes)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Palette size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Theme Presets</span>
                    </div>
                    {showThemes ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {showThemes && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                        {THEME_PRESETS.map((theme) => {
                            const isActive =
                                globalStyles.primaryColor === theme.primary &&
                                globalStyles.accentColor === theme.accent;

                            return (
                                <button
                                    key={theme.name}
                                    onClick={() => applyTheme(theme)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px',
                                        border: isActive ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        background: isActive ? '#eff6ff' : 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <div
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                backgroundColor: theme.primary,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                backgroundColor: theme.accent,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                backgroundColor: theme.muted,
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#374151', fontWeight: isActive ? 600 : 400 }}>
                                        {theme.name}
                                    </span>
                                    {isActive && <Check size={12} color="#2563eb" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Font Pairings Section */}
            <div>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => setShowFontPairings(!showFontPairings)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Type size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Font Pairings</span>
                    </div>
                    {showFontPairings ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {showFontPairings && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                        {FONT_PAIRINGS.map((pairing) => {
                            const isATSSafe = checkATSSafe(pairing.heading) && checkATSSafe(pairing.body);

                            return (
                                <button
                                    key={pairing.name}
                                    onClick={() => applyFontPairing(pairing)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#2563eb';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#374151' }}>{pairing.name}</div>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                            {pairing.heading} / {pairing.body}
                                        </div>
                                    </div>
                                    {isATSSafe ? (
                                        <div
                                            title="ATS-Safe"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '2px 6px',
                                                backgroundColor: '#dcfce7',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                color: '#16a34a',
                                            }}
                                        >
                                            <Check size={10} /> ATS
                                        </div>
                                    ) : (
                                        <div title="May not be ATS-safe">
                                            <AlertTriangle size={14} color="#f59e0b" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
