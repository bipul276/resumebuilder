import { useSandboxStore } from '../../stores/useSandboxStore';
import { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Minus,
    Circle,
    Square,
    Star,
    BarChart2,
    Type,
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
    User,
    FileText,
    Bookmark,
    Tag,
    MoreHorizontal,
    PieChart,
    GitCommit,
    Layers,
    LucideIcon,
} from 'lucide-react';

// Asset categories
const TEXT_BLOCKS = [
    { label: 'Heading 1', type: 'text' as const, style: { fontSize: 28, fontWeight: '700' }, content: 'Heading 1' },
    { label: 'Heading 2', type: 'text' as const, style: { fontSize: 20, fontWeight: '600' }, content: 'Heading 2' },
    { label: 'Heading 3', type: 'text' as const, style: { fontSize: 16, fontWeight: '600' }, content: 'Heading 3' },
    { label: 'Body Text', type: 'text' as const, style: { fontSize: 12, fontWeight: '400' }, content: 'Body text goes here' },
    { label: 'Caption', type: 'text' as const, style: { fontSize: 10, fontWeight: '400', color: '#6b7280' }, content: 'Caption text' },
    { label: 'Label', type: 'text' as const, style: { fontSize: 9, fontWeight: '500', letterSpacing: 0.5, color: '#9ca3af' }, content: 'LABEL' },
];

const DIVIDERS = [
    { label: 'Thin Line', width: 300, height: 1, color: '#e5e7eb' },
    { label: 'Medium Line', width: 300, height: 2, color: '#d1d5db' },
    { label: 'Bold Line', width: 300, height: 4, color: '#9ca3af' },
    { label: 'Accent Line', width: 200, height: 3, color: '#2563eb' },
    { label: 'Gradient Line', width: 300, height: 2, color: '#2563eb', gradient: true },
];

const SHAPES = [
    { label: 'Rectangle', icon: Square, borderRadius: 0 },
    { label: 'Rounded Rect', icon: Square, borderRadius: 8 },
    { label: 'Circle', icon: Circle, borderRadius: 50 },
    { label: 'Pill', icon: Square, borderRadius: 100, width: 120, height: 36 },
];

const GRAPHICS: { label: string; type: string; icon: LucideIcon }[] = [
    { label: 'Skill Bar', type: 'skillbar', icon: BarChart2 },
    { label: 'Rating Dots', type: 'rating_dots', icon: MoreHorizontal },
    { label: 'Progress Ring', type: 'progress_ring', icon: PieChart },
    { label: 'Timeline', type: 'timeline', icon: GitCommit },
    { label: 'Container', type: 'container', icon: Layers },
    { label: 'Tag Cloud', type: 'tag_cloud', icon: Tag },
    { label: 'Icon List', type: 'icon_list', icon: FileText },
    { label: 'Metrics', type: 'metrics', icon: TrendingUp },
];

// Repeating blocks - pre-built sections that can be duplicated
const REPEATING_BLOCKS = [
    {
        label: 'Experience Entry',
        description: 'Job title, company, date, bullets',
        elements: [
            { type: 'text', content: 'Job Title', style: { fontSize: 14, fontWeight: '600', top: 0, left: 0, width: 250 } },
            { type: 'text', content: 'Company Name | Jan 2022 - Present', style: { fontSize: 11, fontWeight: '400', color: '#6b7280', top: 22, left: 0, width: 250 } },
            { type: 'text', content: '• Led cross-functional team to deliver key initiatives\n• Increased efficiency by 25% through process optimization\n• Managed $1M budget across multiple projects', style: { fontSize: 11, fontWeight: '400', top: 45, left: 0, width: 400, height: 60 } },
        ],
        totalHeight: 110,
    },
    {
        label: 'Education Entry',
        description: 'Degree, school, date',
        elements: [
            { type: 'text', content: 'Bachelor of Science in Computer Science', style: { fontSize: 13, fontWeight: '600', top: 0, left: 0, width: 300 } },
            { type: 'text', content: 'University Name | 2018 - 2022', style: { fontSize: 11, fontWeight: '400', color: '#6b7280', top: 20, left: 0, width: 250 } },
            { type: 'text', content: 'GPA: 3.8/4.0 • Dean\'s List • Relevant Coursework: Data Structures, Algorithms', style: { fontSize: 10, fontWeight: '400', color: '#9ca3af', top: 40, left: 0, width: 400 } },
        ],
        totalHeight: 65,
    },
    {
        label: 'Project Entry',
        description: 'Project name, tech, description',
        elements: [
            { type: 'text', content: 'Project Name', style: { fontSize: 13, fontWeight: '600', top: 0, left: 0, width: 200 } },
            { type: 'text', content: 'React, Node.js, PostgreSQL', style: { fontSize: 10, fontWeight: '500', color: '#2563eb', top: 0, left: 210, width: 150 } },
            { type: 'text', content: '• Built full-stack application serving 10K+ users\n• Implemented real-time features with WebSocket integration', style: { fontSize: 11, fontWeight: '400', top: 22, left: 0, width: 400, height: 40 } },
        ],
        totalHeight: 70,
    },
    {
        label: 'Skill Group',
        description: 'Category with skill list',
        elements: [
            { type: 'text', content: 'Programming Languages', style: { fontSize: 11, fontWeight: '600', top: 0, left: 0, width: 150 } },
            { type: 'text', content: 'JavaScript, TypeScript, Python, Go, SQL', style: { fontSize: 11, fontWeight: '400', color: '#374151', top: 0, left: 160, width: 300 } },
        ],
        totalHeight: 25,
    },
];


const ICON_CATEGORIES = [
    {
        name: 'Contact',
        icons: [
            { name: 'Mail', component: Mail },
            { name: 'Phone', component: Phone },
            { name: 'MapPin', component: MapPin },
            { name: 'Globe', component: Globe },
            { name: 'User', component: User },
        ],
    },
    {
        name: 'Social',
        icons: [
            { name: 'Linkedin', component: Linkedin },
            { name: 'Github', component: Github },
            { name: 'Twitter', component: Twitter },
        ],
    },
    {
        name: 'Professional',
        icons: [
            { name: 'Briefcase', component: Briefcase },
            { name: 'GraduationCap', component: GraduationCap },
            { name: 'Award', component: Award },
            { name: 'FileText', component: FileText },
            { name: 'Bookmark', component: Bookmark },
        ],
    },
    {
        name: 'Tech',
        icons: [
            { name: 'Code', component: Code },
            { name: 'Database', component: Database },
            { name: 'Server', component: Server },
            { name: 'Cloud', component: Cloud },
            { name: 'Zap', component: Zap },
        ],
    },
    {
        name: 'Other',
        icons: [
            { name: 'Star', component: Star },
            { name: 'Heart', component: Heart },
            { name: 'Target', component: Target },
            { name: 'TrendingUp', component: TrendingUp },
            { name: 'CheckCircle', component: CheckCircle },
            { name: 'Tag', component: Tag },
        ],
    },
];

export function AssetsPanel() {
    const { addElement, updateElementStyle, data } = useSandboxStore();
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        text: true,
        icons: true,
        graphics: false,
        shapes: false,
        dividers: false,
        repeating: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const addTextBlock = (block: typeof TEXT_BLOCKS[0]) => {
        addElement('text', block.content);
        const newElement = useSandboxStore.getState().data.elements.at(-1);

        // Map block labels to style IDs
        const styleIdMap: Record<string, string> = {
            'Heading 1': 'h1',
            'Heading 2': 'h2',
            'Heading 3': 'h3',
            'Body Text': 'body',
            'Caption': 'caption',
            'Label': 'meta',
        };

        if (newElement) {
            useSandboxStore.getState().updateElement(newElement.id, {
                textStyleId: styleIdMap[block.label],
            });
            updateElementStyle(newElement.id, {
                ...block.style,
                width: 200,
                height: block.style.fontSize ? block.style.fontSize * 2 : 40,
            });
        }
    };

    const addDivider = (divider: typeof DIVIDERS[0]) => {
        addElement('divider', '');
        const newElement = useSandboxStore.getState().data.elements.at(-1);
        if (newElement) {
            updateElementStyle(newElement.id, {
                width: divider.width,
                height: divider.height,
                color: divider.color,
                backgroundColor: divider.color,
            });
        }
    };

    const addShape = (shape: typeof SHAPES[0]) => {
        addElement('shape', '');
        const newElement = useSandboxStore.getState().data.elements.at(-1);
        if (newElement) {
            updateElementStyle(newElement.id, {
                width: shape.width || 100,
                height: shape.height || 100,
                borderRadius: shape.borderRadius,
                borderWidth: 2,
                borderColor: data.globalStyles.primaryColor,
                backgroundColor: 'transparent',
            });
        }
    };

    const addIcon = (iconName: string) => {
        addElement('icon', iconName);
    };

    const addGraphic = (graphic: typeof GRAPHICS[0]) => {
        if (graphic.type === 'skillbar') {
            addElement('skillbar', 'Skill Name');
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                useSandboxStore.getState().updateElement(newElement.id, {
                    props: { level: 75 },
                });
                updateElementStyle(newElement.id, {
                    width: 200,
                    height: 40,
                    backgroundColor: data.globalStyles.primaryColor,
                });
            }
        } else if (graphic.type === 'timeline') {
            addElement('timeline', '');
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                useSandboxStore.getState().updateElement(newElement.id, {
                    props: { steps: 3 },
                });
                updateElementStyle(newElement.id, {
                    width: 20,
                    height: 200,
                    backgroundColor: data.globalStyles.primaryColor,
                });
            }
        } else if (graphic.type === 'rating_dots') {
            addElement('rating_dots' as any, '');
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                useSandboxStore.getState().updateElement(newElement.id, {
                    props: { level: 4, maxDots: 5 },
                });
                updateElementStyle(newElement.id, {
                    width: 120,
                    height: 24,
                    backgroundColor: data.globalStyles.primaryColor,
                });
            }
        } else if (graphic.type === 'progress_ring') {
            addElement('progress_ring' as any, '');
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                useSandboxStore.getState().updateElement(newElement.id, {
                    props: { level: 75 },
                });
                updateElementStyle(newElement.id, {
                    width: 80,
                    height: 80,
                    backgroundColor: data.globalStyles.primaryColor,
                });
            }
        } else if (graphic.type === 'container') {
            addElement('container' as any, '');
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                useSandboxStore.getState().updateElement(newElement.id, {
                    props: { direction: 'column', gap: 16, padding: 16, alignItems: 'stretch', justifyContent: 'flex-start' },
                });
                updateElementStyle(newElement.id, {
                    width: 300,
                    height: 200,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                });
            }
        }
    };

    const addRepeatingBlock = (block: typeof REPEATING_BLOCKS[0]) => {
        // Find a good position for the block
        const baseTop = 300; // Starting y position
        const baseLeft = 60; // Starting x position

        // Add each element in the block
        block.elements.forEach((el: any) => {
            addElement('text', el.content);
            const elements = useSandboxStore.getState().data.elements;
            const newElement = elements[elements.length - 1];
            if (newElement) {
                updateElementStyle(newElement.id, {
                    ...el.style,
                    top: baseTop + (el.style.top || 0),
                    left: baseLeft + (el.style.left || 0),
                    height: el.style.height || 20,
                });
            }
        });
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: '8px',
    };

    const sectionHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background-color 0.15s',
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'all 0.15s',
        border: '1px solid transparent',
    };

    return (
        <div style={{ fontSize: '13px' }}>
            {/* Text Blocks */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => toggleSection('text')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Type size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Text Blocks</span>
                    </div>
                    {expandedSections.text ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections.text && (
                    <div style={{ padding: '4px 0' }}>
                        {TEXT_BLOCKS.map((block, i) => (
                            <div
                                key={i}
                                onClick={() => addTextBlock(block)}
                                style={itemStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: Math.min(block.style.fontSize || 14, 16),
                                        fontWeight: block.style.fontWeight as any,
                                        color: block.style.color || '#374151',
                                    }}
                                >
                                    {block.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Icons */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => toggleSection('icons')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Star size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Icons</span>
                    </div>
                    {expandedSections.icons ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections.icons && (
                    <div style={{ padding: '8px' }}>
                        {ICON_CATEGORIES.map((category) => (
                            <div key={category.name} style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    {category.name}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {category.icons.map((icon) => (
                                        <button
                                            key={icon.name}
                                            onClick={() => addIcon(icon.name)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                background: 'white',
                                                cursor: 'pointer',
                                                color: '#4b5563',
                                            }}
                                            title={icon.name}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#2563eb';
                                                e.currentTarget.style.color = '#2563eb';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                                e.currentTarget.style.color = '#4b5563';
                                            }}
                                        >
                                            <icon.component size={18} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Repeating Blocks */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => toggleSection('repeating')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={16} color="#7c3aed" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Repeating Blocks</span>
                        <span style={{
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            backgroundColor: '#ddd6fe',
                            color: '#7c3aed',
                            fontWeight: 600,
                        }}>PRO</span>
                    </div>
                    {expandedSections.repeating ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections.repeating && (
                    <div style={{ padding: '8px' }}>
                        <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 8px 0' }}>
                            Pre-built sections you can add and customize
                        </p>
                        {REPEATING_BLOCKS.map((block, i) => (
                            <div
                                key={i}
                                onClick={() => addRepeatingBlock(block)}
                                style={{
                                    padding: '10px 12px',
                                    marginBottom: '6px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#7c3aed';
                                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: '12px', color: '#374151' }}>
                                    {block.label}
                                </div>
                                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                                    {block.description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Graphics */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => toggleSection('graphics')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart2 size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Graphics</span>
                    </div>
                    {expandedSections.graphics ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections.graphics && (
                    <div style={{ padding: '4px 0' }}>
                        {GRAPHICS.map((graphic, i) => (
                            <div
                                key={i}
                                onClick={() => addGraphic(graphic)}
                                style={itemStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                <graphic.icon size={16} color="#6b7280" />
                                <span style={{ color: '#374151' }}>{graphic.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shapes */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => toggleSection('shapes')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Square size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Shapes</span>
                    </div>
                    {expandedSections.shapes ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections.shapes && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
                        {SHAPES.map((shape, i) => (
                            <button
                                key={i}
                                onClick={() => addShape(shape)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: 'white',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        border: '2px solid #6b7280',
                                        borderRadius: shape.borderRadius === 50 ? '50%' : shape.borderRadius || 0,
                                    }}
                                />
                                <span style={{ fontSize: '11px', color: '#4b5563' }}>{shape.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Dividers */}
            <div style={sectionStyle}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => toggleSection('dividers')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Minus size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Dividers</span>
                    </div>
                    {expandedSections.dividers ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections.dividers && (
                    <div style={{ padding: '8px' }}>
                        {DIVIDERS.map((divider, i) => (
                            <div
                                key={i}
                                onClick={() => addDivider(divider)}
                                style={{
                                    ...itemStyle,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '6px',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '11px', color: '#6b7280' }}>{divider.label}</span>
                                <div
                                    style={{
                                        width: '100%',
                                        height: divider.height,
                                        backgroundColor: divider.color,
                                        borderRadius: divider.height / 2,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
