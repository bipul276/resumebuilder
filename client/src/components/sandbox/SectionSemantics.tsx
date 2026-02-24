import { useSandboxStore } from '../../stores/useSandboxStore';
import { useState } from 'react';
import { SemanticSection, SandboxSectionType, SectionRules, generateId } from '@resumebuilder/shared';
import {
    Briefcase,
    GraduationCap,
    Code,
    Award,
    Languages,
    User,
    FileText,
    Plus,
    ChevronDown,
    ChevronRight,
    Copy,
    AlertCircle,
    Settings,
    Trash2,
    AlignLeft,
    AlignRight,
    List,
    Minus,
    Check,
    ArrowRight,
    Circle,
    Sliders,
    Lock,
} from 'lucide-react';

// Section type icons
const SECTION_TYPE_ICONS: Record<SandboxSectionType, any> = {
    experience: Briefcase,
    education: GraduationCap,
    skills: Code,
    projects: FileText,
    certifications: Award,
    summary: User,
    custom: FileText,
};

// Section templates
const SECTION_TEMPLATES = [
    {
        id: 'experience',
        name: 'Work Experience',
        icon: Briefcase,
        sectionType: 'experience' as SandboxSectionType,
        elements: [
            { type: 'text' as const, content: 'WORK EXPERIENCE', style: { fontSize: 14, fontWeight: '700', letterSpacing: 1 } },
            { type: 'divider' as const, content: '', style: { width: 300, height: 2 } },
            { type: 'text' as const, content: 'Software Engineer', style: { fontSize: 14, fontWeight: '600' } },
            { type: 'text' as const, content: 'Company Name • 2022 - Present', style: { fontSize: 11, color: '#6b7280' } },
            { type: 'text' as const, content: '• Led development of key features\n• Improved performance by 40%\n• Mentored junior developers', style: { fontSize: 11, lineHeight: 1.6 } },
        ],
    },
    {
        id: 'education',
        name: 'Education',
        icon: GraduationCap,
        sectionType: 'education' as SandboxSectionType,
        elements: [
            { type: 'text' as const, content: 'EDUCATION', style: { fontSize: 14, fontWeight: '700', letterSpacing: 1 } },
            { type: 'divider' as const, content: '', style: { width: 300, height: 2 } },
            { type: 'text' as const, content: 'Bachelor of Science in Computer Science', style: { fontSize: 14, fontWeight: '600' } },
            { type: 'text' as const, content: 'University Name • 2018 - 2022', style: { fontSize: 11, color: '#6b7280' } },
            { type: 'text' as const, content: 'GPA: 3.8/4.0 • Relevant Coursework: Data Structures, Algorithms', style: { fontSize: 10, color: '#6b7280' } },
        ],
    },
    {
        id: 'skills',
        name: 'Skills',
        icon: Code,
        sectionType: 'skills' as SandboxSectionType,
        elements: [
            { type: 'text' as const, content: 'SKILLS', style: { fontSize: 14, fontWeight: '700', letterSpacing: 1 } },
            { type: 'divider' as const, content: '', style: { width: 300, height: 2 } },
            { type: 'text' as const, content: 'Programming: JavaScript, Python, Java, C++', style: { fontSize: 11 } },
            { type: 'text' as const, content: 'Frameworks: React, Node.js, Django', style: { fontSize: 11 } },
            { type: 'text' as const, content: 'Tools: Git, Docker, AWS, PostgreSQL', style: { fontSize: 11 } },
        ],
    },
    {
        id: 'projects',
        name: 'Projects',
        icon: FileText,
        sectionType: 'projects' as SandboxSectionType,
        elements: [
            { type: 'text' as const, content: 'PROJECTS', style: { fontSize: 14, fontWeight: '700', letterSpacing: 1 } },
            { type: 'divider' as const, content: '', style: { width: 300, height: 2 } },
            { type: 'text' as const, content: 'Project Name', style: { fontSize: 14, fontWeight: '600' } },
            { type: 'text' as const, content: 'React, Node.js, MongoDB', style: { fontSize: 10, color: '#2563eb' } },
            { type: 'text' as const, content: '• Built a full-stack application with 1000+ users\n• Implemented real-time features using WebSockets', style: { fontSize: 11, lineHeight: 1.6 } },
        ],
    },
    {
        id: 'certifications',
        name: 'Certifications',
        icon: Award,
        sectionType: 'certifications' as SandboxSectionType,
        elements: [
            { type: 'text' as const, content: 'CERTIFICATIONS', style: { fontSize: 14, fontWeight: '700', letterSpacing: 1 } },
            { type: 'divider' as const, content: '', style: { width: 300, height: 2 } },
            { type: 'text' as const, content: 'AWS Certified Solutions Architect', style: { fontSize: 12, fontWeight: '500' } },
            { type: 'text' as const, content: 'Amazon Web Services • 2023', style: { fontSize: 10, color: '#6b7280' } },
        ],
    },
    {
        id: 'header',
        name: 'Header / Contact',
        icon: User,
        sectionType: 'summary' as SandboxSectionType,
        elements: [
            { type: 'text' as const, content: 'JOHN DOE', style: { fontSize: 28, fontWeight: '700' } },
            { type: 'text' as const, content: 'Senior Software Engineer', style: { fontSize: 14, color: '#2563eb' } },
            { type: 'text' as const, content: 'john.doe@email.com • (555) 123-4567 • San Francisco, CA', style: { fontSize: 10, color: '#6b7280' } },
            { type: 'text' as const, content: 'linkedin.com/in/johndoe • github.com/johndoe', style: { fontSize: 10, color: '#6b7280' } },
        ],
    },
];

// Repeating block templates
const REPEATING_BLOCKS = [
    {
        id: 'job_entry',
        name: 'Job Entry',
        elements: [
            { type: 'text' as const, content: 'Job Title', style: { fontSize: 14, fontWeight: '600' } },
            { type: 'text' as const, content: 'Company • Date Range', style: { fontSize: 11, color: '#6b7280' } },
            { type: 'text' as const, content: '• Accomplishment 1\n• Accomplishment 2\n• Accomplishment 3', style: { fontSize: 11, lineHeight: 1.6 } },
        ],
    },
    {
        id: 'education_entry',
        name: 'Education Entry',
        elements: [
            { type: 'text' as const, content: 'Degree Name', style: { fontSize: 14, fontWeight: '600' } },
            { type: 'text' as const, content: 'Institution • Year', style: { fontSize: 11, color: '#6b7280' } },
        ],
    },
    {
        id: 'project_entry',
        name: 'Project Entry',
        elements: [
            { type: 'text' as const, content: 'Project Name', style: { fontSize: 14, fontWeight: '600' } },
            { type: 'text' as const, content: 'Tech Stack', style: { fontSize: 10, color: '#2563eb' } },
            { type: 'text' as const, content: '• Description of project and impact', style: { fontSize: 11 } },
        ],
    },
    {
        id: 'skill_category',
        name: 'Skill Category',
        elements: [
            { type: 'text' as const, content: 'Category: Skill 1, Skill 2, Skill 3', style: { fontSize: 11 } },
        ],
    },
];

// Default section rules
const DEFAULT_RULES: SectionRules = {
    dateAlignment: 'right',
    bulletStyle: 'disc',
    hierarchyOrder: ['company', 'role', 'date'],
    density: 'normal',
    keepTogether: true,
};

export function SectionSemantics() {
    const { addElement, updateElementStyle, data } = useSandboxStore();
    const [expandedSections, setExpandedSections] = useState(true);
    const [expandedBlocks, setExpandedBlocks] = useState(false);
    const [expandedManaged, setExpandedManaged] = useState(true);
    const [editingSection, setEditingSection] = useState<string | null>(null);

    // Get sections from store
    const sections = data.sections || [];

    const addSectionTemplate = (template: typeof SECTION_TEMPLATES[0]) => {
        const currentPage = data.pages[data.currentPageIndex];
        if (!currentPage) return;

        let yOffset = 50;
        const xOffset = 50;
        const elementIds: string[] = [];

        template.elements.forEach((element, index) => {
            addElement(element.type, element.content);
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                elementIds.push(newElement.id);
                updateElementStyle(newElement.id, {
                    ...element.style,
                    left: xOffset,
                    top: yOffset,
                    width: element.style?.width || 300,
                    height: element.type === 'divider' ? (element.style?.height || 2) : undefined,
                });
                yOffset += (element.style?.fontSize || 14) * 2 + 8;
            }
        });

        // Create semantic section
        const newSection: SemanticSection = {
            id: generateId(),
            type: template.sectionType,
            name: template.name,
            elementIds,
            rules: { ...DEFAULT_RULES },
            order: sections.length,
        };

        useSandboxStore.setState((state) => ({
            data: {
                ...state.data,
                sections: [...(state.data.sections || []), newSection],
            },
        }));
    };

    const addRepeatingBlock = (block: typeof REPEATING_BLOCKS[0]) => {
        const currentPage = data.pages[data.currentPageIndex];
        if (!currentPage) return;

        const pageElements = data.elements.filter((el) => el.pageId === currentPage.id);
        const maxY = pageElements.length > 0
            ? Math.max(...pageElements.map((el) => el.style.top + el.style.height))
            : 50;

        let yOffset = maxY + 20;
        const xOffset = 50;

        block.elements.forEach((element) => {
            addElement(element.type, element.content);
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                updateElementStyle(newElement.id, {
                    ...element.style,
                    left: xOffset,
                    top: yOffset,
                    width: 300,
                });
                yOffset += (element.style?.fontSize || 14) * 2 + 8;
            }
        });
    };

    const updateSectionRules = (sectionId: string, rules: Partial<SectionRules>) => {
        useSandboxStore.setState((state) => ({
            data: {
                ...state.data,
                sections: state.data.sections.map(s =>
                    s.id === sectionId ? { ...s, rules: { ...s.rules, ...rules } } : s
                ),
            },
        }));
    };

    const deleteSection = (sectionId: string) => {
        useSandboxStore.setState((state) => ({
            data: {
                ...state.data,
                sections: state.data.sections.filter(s => s.id !== sectionId),
            },
        }));
    };

    const sectionHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        cursor: 'pointer',
        borderRadius: '6px',
    };

    const buttonGroupStyle: React.CSSProperties = {
        display: 'flex',
        gap: '2px',
        background: '#f3f4f6',
        borderRadius: '6px',
        padding: '2px',
    };

    const toggleButtonStyle = (active: boolean): React.CSSProperties => ({
        padding: '4px 8px',
        border: 'none',
        borderRadius: '4px',
        background: active ? 'white' : 'transparent',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
        cursor: 'pointer',
        fontSize: '10px',
        color: active ? '#111827' : '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    });

    // Bullet style icons
    const getBulletIcon = (style: string) => {
        switch (style) {
            case 'disc': return <Circle size={10} fill="currentColor" />;
            case 'dash': return <Minus size={10} />;
            case 'arrow': return <ArrowRight size={10} />;
            case 'check': return <Check size={10} />;
            default: return null;
        }
    };

    return (
        <div style={{ fontSize: '13px' }}>
            {/* Managed Sections */}
            {sections.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <div
                        style={sectionHeaderStyle}
                        onClick={() => setExpandedManaged(!expandedManaged)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Settings size={16} color="#6b7280" />
                            <span style={{ fontWeight: 600, color: '#374151' }}>Managed Sections</span>
                            <span style={{ fontSize: '10px', color: '#9ca3af', background: '#f3f4f6', padding: '2px 6px', borderRadius: '10px' }}>
                                {sections.length}
                            </span>
                        </div>
                        {expandedManaged ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    {expandedManaged && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
                            {sections.map((section) => {
                                const IconComponent = SECTION_TYPE_ICONS[section.type] || FileText;
                                const isEditing = editingSection === section.id;

                                return (
                                    <div
                                        key={section.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Section Header */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 12px',
                                                background: '#f9fafb',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => setEditingSection(isEditing ? null : section.id)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <IconComponent size={14} color="#6b7280" />
                                                <span style={{ fontWeight: 500, color: '#374151' }}>{section.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                                                    {section.elementIds.length} elements
                                                </span>
                                                {isEditing ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </div>
                                        </div>

                                        {/* Section Rules Editor */}
                                        {isEditing && (
                                            <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
                                                {/* Density */}
                                                <div style={{ marginBottom: '12px' }}>
                                                    <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                                        <Sliders size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                        DENSITY
                                                    </span>
                                                    <div style={buttonGroupStyle}>
                                                        {(['compact', 'normal', 'spacious'] as const).map((d) => (
                                                            <button
                                                                key={d}
                                                                onClick={() => updateSectionRules(section.id, { density: d })}
                                                                style={toggleButtonStyle(section.rules.density === d)}
                                                            >
                                                                {d.charAt(0).toUpperCase() + d.slice(1)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Date Alignment */}
                                                <div style={{ marginBottom: '12px' }}>
                                                    <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                                        DATE ALIGNMENT
                                                    </span>
                                                    <div style={buttonGroupStyle}>
                                                        <button
                                                            onClick={() => updateSectionRules(section.id, { dateAlignment: 'left' })}
                                                            style={toggleButtonStyle(section.rules.dateAlignment === 'left')}
                                                        >
                                                            <AlignLeft size={12} /> Left
                                                        </button>
                                                        <button
                                                            onClick={() => updateSectionRules(section.id, { dateAlignment: 'inline' })}
                                                            style={toggleButtonStyle(section.rules.dateAlignment === 'inline')}
                                                        >
                                                            Inline
                                                        </button>
                                                        <button
                                                            onClick={() => updateSectionRules(section.id, { dateAlignment: 'right' })}
                                                            style={toggleButtonStyle(section.rules.dateAlignment === 'right')}
                                                        >
                                                            <AlignRight size={12} /> Right
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Bullet Style */}
                                                <div style={{ marginBottom: '12px' }}>
                                                    <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                                        <List size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                        BULLET STYLE
                                                    </span>
                                                    <div style={buttonGroupStyle}>
                                                        {(['disc', 'dash', 'arrow', 'check', 'none'] as const).map((b) => (
                                                            <button
                                                                key={b}
                                                                onClick={() => updateSectionRules(section.id, { bulletStyle: b })}
                                                                style={toggleButtonStyle(section.rules.bulletStyle === b)}
                                                                title={b}
                                                            >
                                                                {b === 'none' ? '∅' : getBulletIcon(b)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Keep Together */}
                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={section.rules.keepTogether}
                                                            onChange={(e) => updateSectionRules(section.id, { keepTogether: e.target.checked })}
                                                            style={{ width: '14px', height: '14px' }}
                                                        />
                                                        <Lock size={12} color="#6b7280" />
                                                        <span style={{ fontSize: '11px', color: '#374151' }}>Keep section together (avoid page breaks)</span>
                                                    </label>
                                                </div>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => deleteSection(section.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 10px',
                                                        border: '1px solid #fecaca',
                                                        borderRadius: '4px',
                                                        background: 'white',
                                                        color: '#dc2626',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <Trash2 size={12} /> Remove Section Rules
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Add Resume Sections */}
            <div style={{ marginBottom: '16px' }}>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => setExpandedSections(!expandedSections)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Add Section</span>
                    </div>
                    {expandedSections ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedSections && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 0' }}>
                        {SECTION_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => addSectionTemplate(template)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '100%',
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
                                <template.icon size={18} color="#6b7280" />
                                <div>
                                    <div style={{ fontWeight: 500, color: '#374151' }}>{template.name}</div>
                                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                                        {template.elements.length} elements
                                    </div>
                                </div>
                                <Plus size={14} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Repeating Blocks */}
            <div>
                <div
                    style={sectionHeaderStyle}
                    onClick={() => setExpandedBlocks(!expandedBlocks)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Copy size={16} color="#6b7280" />
                        <span style={{ fontWeight: 600, color: '#374151' }}>Repeating Blocks</span>
                    </div>
                    {expandedBlocks ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {expandedBlocks && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 0' }}>
                        <p style={{ fontSize: '11px', color: '#6b7280', padding: '0 12px', marginBottom: '8px' }}>
                            Add pre-formatted blocks for common resume entries
                        </p>
                        {REPEATING_BLOCKS.map((block) => (
                            <button
                                key={block.id}
                                onClick={() => addRepeatingBlock(block)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <span style={{ color: '#374151' }}>{block.name}</span>
                                <Plus size={14} color="#9ca3af" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ATS Tips */}
            <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fefce8', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <AlertCircle size={16} color="#ca8a04" />
                    <span style={{ fontWeight: 600, color: '#854d0e', fontSize: '12px' }}>ATS Tips</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#854d0e', fontSize: '11px', lineHeight: 1.6 }}>
                    <li>Use standard section headings</li>
                    <li>Avoid tables and columns</li>
                    <li>Use ATS-safe fonts</li>
                    <li>Keep formatting simple</li>
                </ul>
            </div>
        </div>
    );
}
