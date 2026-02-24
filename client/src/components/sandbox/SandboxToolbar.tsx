import {
    Type,
    Image,
    Square,
    Star,
    Minus,
    BarChart2,
    Plus,
    Palette,
    Heart,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    Twitter,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    Database,
    Server,
    Cloud,
    Zap,
    Target,
    TrendingUp,
    CheckCircle,
    LucideIcon,
} from 'lucide-react';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { useRef, useState } from 'react';

interface ToolItem {
    type: 'text' | 'image' | 'shape' | 'icon' | 'divider' | 'skillbar';
    label: string;
    icon: React.ReactNode;
    content?: string;
}

const TOOLS: ToolItem[] = [
    { type: 'text', label: 'Text', icon: <Type size={20} /> },
    { type: 'image', label: 'Image', icon: <Image size={20} /> },
    { type: 'shape', label: 'Rectangle', icon: <Square size={20} /> },
    { type: 'divider', label: 'Divider', icon: <Minus size={20} /> },
    { type: 'skillbar', label: 'Skill Bar', icon: <BarChart2 size={20} /> },
];

// Icon map for static imports
const ICON_MAP: Record<string, LucideIcon> = {
    Star,
    Heart,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    Twitter,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    Database,
    Server,
    Cloud,
    Zap,
    Target,
    TrendingUp,
    CheckCircle,
};

const ICON_NAMES = Object.keys(ICON_MAP);

export function SandboxToolbar() {
    const { addElement, data, setAccentColor, setPrimaryColor } = useSandboxStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showIcons, setShowIcons] = useState(false);
    const [showColors, setShowColors] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                addElement('image', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        padding: '10px 16px',
        borderRadius: '8px',
        transition: 'all 0.15s',
        color: 'var(--color-text-secondary)',
        fontSize: '13px',
        fontWeight: 500,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px' }}>
            {/* Section: Add Elements */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 16px 8px' }}>
                    Add Elements
                </div>

                {TOOLS.map((tool) => (
                    <div
                        key={tool.type}
                        onClick={() => {
                            if (tool.type === 'image') {
                                fileInputRef.current?.click();
                            } else {
                                addElement(tool.type, tool.content);
                            }
                        }}
                        style={itemStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-input)';
                            e.currentTarget.style.color = 'var(--color-text)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                    >
                        {tool.icon}
                        <span>{tool.label}</span>
                    </div>
                ))}

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            {/* Section: Icons */}
            <div style={{ marginBottom: '16px' }}>
                <div
                    onClick={() => setShowIcons(!showIcons)}
                    style={{
                        ...itemStyle,
                        justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-input)';
                        e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Star size={20} />
                        <span>Icons</span>
                    </div>
                    <Plus size={16} style={{ transform: showIcons ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {showIcons && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', padding: '8px 8px 16px' }}>
                        {ICON_NAMES.map((iconName) => {
                            const IconComponent = ICON_MAP[iconName];
                            return (
                                <button
                                    key={iconName}
                                    onClick={() => addElement('icon', iconName)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '6px',
                                        background: 'var(--color-bg-input)',
                                        cursor: 'pointer',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                    title={iconName}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                                    }}
                                >
                                    <IconComponent size={18} />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Section: Colors */}
            <div>
                <div
                    onClick={() => setShowColors(!showColors)}
                    style={{
                        ...itemStyle,
                        justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-input)';
                        e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Palette size={20} />
                        <span>Theme Colors</span>
                    </div>
                    <Plus size={16} style={{ transform: showColors ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {showColors && (
                    <div style={{ padding: '8px 16px 16px' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Primary Color</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={data.globalStyles.primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    style={{ width: '40px', height: '32px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
                                />
                                <input
                                    type="text"
                                    value={data.globalStyles.primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '12px', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text)' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Accent Color</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={data.globalStyles.accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    style={{ width: '40px', height: '32px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
                                />
                                <input
                                    type="text"
                                    value={data.globalStyles.accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '12px', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text)' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reset button */}
            <div style={{ marginTop: 'auto', padding: '12px 0', borderTop: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => {
                        if (confirm('Reset sandbox? This will clear all elements.')) {
                            useSandboxStore.getState().resetSandbox();
                        }
                    }}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                >
                    Reset Canvas
                </button>
            </div>
        </div>
    );
}
