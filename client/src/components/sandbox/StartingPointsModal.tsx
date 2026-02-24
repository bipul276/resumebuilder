import { useState } from 'react';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { generateId } from '@resumebuilder/shared';
import {
    FileText,
    Briefcase,
    Sparkles,
    GraduationCap,
    Layout,
    X,
    ArrowRight,
    Check,
} from 'lucide-react';

interface Template {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    badge?: string;
    elements: TemplateElement[];
}

interface TemplateElement {
    type: 'text' | 'divider' | 'container';
    content: string;
    style: Record<string, any>;
    props?: Record<string, any>;
}

// Pre-built templates
const TEMPLATES: Template[] = [
    {
        id: 'ats-resume',
        name: 'ATS-Optimized Resume',
        description: 'Clean, single-column layout that passes ATS systems',
        icon: Check,
        color: '#16a34a',
        badge: 'Recommended',
        elements: [
            { type: 'text', content: 'YOUR NAME', style: { fontSize: 28, fontWeight: '700', left: 50, top: 40, width: 500, height: 40 } },
            { type: 'text', content: 'Job Title | city@email.com | (555) 123-4567 | City, State', style: { fontSize: 11, color: '#6b7280', left: 50, top: 85, width: 500, height: 20 } },
            { type: 'divider', content: '', style: { left: 50, top: 115, width: 500, height: 2 } },
            { type: 'text', content: 'PROFESSIONAL SUMMARY', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 135, width: 500, height: 20 } },
            { type: 'text', content: 'Results-driven professional with X years of experience in [field]. Proven track record of [achievement]. Skilled in [key skills].', style: { fontSize: 11, left: 50, top: 160, width: 500, height: 50, lineHeight: 1.5 } },
            { type: 'text', content: 'WORK EXPERIENCE', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 230, width: 500, height: 20 } },
            { type: 'text', content: 'Job Title', style: { fontSize: 13, fontWeight: '600', left: 50, top: 255, width: 300, height: 20 } },
            { type: 'text', content: 'Company Name | Jan 2022 - Present', style: { fontSize: 10, color: '#6b7280', left: 50, top: 278, width: 300, height: 18 } },
            { type: 'text', content: '• Achieved [result] by implementing [action]\n• Led team of X to deliver [project] resulting in [metric]\n• Reduced [problem] by X% through [solution]', style: { fontSize: 11, left: 50, top: 300, width: 500, height: 60, lineHeight: 1.6 } },
            { type: 'text', content: 'SKILLS', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 380, width: 500, height: 20 } },
            { type: 'text', content: 'Technical: Skill 1, Skill 2, Skill 3, Skill 4\nSoft Skills: Leadership, Communication, Problem Solving', style: { fontSize: 11, left: 50, top: 405, width: 500, height: 40, lineHeight: 1.5 } },
            { type: 'text', content: 'EDUCATION', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 465, width: 500, height: 20 } },
            { type: 'text', content: 'Bachelor of Science in Field\nUniversity Name | Graduation Year', style: { fontSize: 11, left: 50, top: 490, width: 500, height: 35, lineHeight: 1.5 } },
        ],
    },
    {
        id: 'modern-creative',
        name: 'Modern Creative',
        description: 'Two-column layout with visual flair for creative roles',
        icon: Sparkles,
        color: '#7c3aed',
        elements: [
            { type: 'container', content: '', style: { left: 30, top: 30, width: 180, height: 740 }, props: { direction: 'column', gap: 20, padding: 20, backgroundColor: '#1f2937' } },
            { type: 'text', content: 'JOHN DOE', style: { fontSize: 22, fontWeight: '700', color: '#ffffff', left: 50, top: 50, width: 140, height: 30 } },
            { type: 'text', content: 'Creative Director', style: { fontSize: 11, color: '#9ca3af', left: 50, top: 82, width: 140, height: 18 } },
            { type: 'divider', content: '', style: { left: 50, top: 110, width: 120, height: 2, backgroundColor: '#4b5563' } },
            { type: 'text', content: 'CONTACT', style: { fontSize: 10, fontWeight: '600', color: '#9ca3af', letterSpacing: 1, left: 50, top: 130, width: 120, height: 15 } },
            { type: 'text', content: '📧 email@example.com\n📱 (555) 123-4567\n📍 New York, NY', style: { fontSize: 10, color: '#d1d5db', left: 50, top: 150, width: 140, height: 50, lineHeight: 1.6 } },
            { type: 'text', content: 'SKILLS', style: { fontSize: 10, fontWeight: '600', color: '#9ca3af', letterSpacing: 1, left: 50, top: 220, width: 120, height: 15 } },
            { type: 'text', content: '• Brand Strategy\n• UI/UX Design\n• Adobe Creative Suite\n• Motion Graphics\n• Team Leadership', style: { fontSize: 10, color: '#d1d5db', left: 50, top: 240, width: 140, height: 90, lineHeight: 1.6 } },
            { type: 'text', content: 'ABOUT ME', style: { fontSize: 14, fontWeight: '700', left: 240, top: 50, width: 350, height: 22 } },
            { type: 'text', content: 'Award-winning creative director with 8+ years of experience crafting compelling brand experiences for Fortune 500 companies.', style: { fontSize: 11, left: 240, top: 78, width: 350, height: 45, lineHeight: 1.5 } },
            { type: 'text', content: 'EXPERIENCE', style: { fontSize: 14, fontWeight: '700', left: 240, top: 145, width: 350, height: 22 } },
            { type: 'text', content: 'Creative Director', style: { fontSize: 12, fontWeight: '600', left: 240, top: 175, width: 200, height: 18 } },
            { type: 'text', content: 'Agency Name | 2020 - Present', style: { fontSize: 10, color: '#7c3aed', left: 240, top: 195, width: 200, height: 16 } },
        ],
    },
    {
        id: 'cover-letter',
        name: 'Cover Letter',
        description: 'Professional letter format for job applications',
        icon: FileText,
        color: '#0284c7',
        elements: [
            { type: 'text', content: 'Your Name', style: { fontSize: 24, fontWeight: '700', left: 50, top: 50, width: 500, height: 35 } },
            { type: 'text', content: 'your.email@example.com | (555) 123-4567 | City, State', style: { fontSize: 11, color: '#6b7280', left: 50, top: 90, width: 500, height: 18 } },
            { type: 'divider', content: '', style: { left: 50, top: 120, width: 500, height: 1 } },
            { type: 'text', content: 'January 21, 2026', style: { fontSize: 11, left: 50, top: 145, width: 200, height: 18 } },
            { type: 'text', content: 'Hiring Manager\nCompany Name\n123 Business Street\nCity, State 12345', style: { fontSize: 11, left: 50, top: 175, width: 300, height: 70, lineHeight: 1.5 } },
            { type: 'text', content: 'Dear Hiring Manager,', style: { fontSize: 11, left: 50, top: 270, width: 500, height: 18 } },
            { type: 'text', content: 'I am writing to express my strong interest in the [Position] role at [Company Name]. With my background in [relevant field] and proven track record of [key achievement], I am confident I would be a valuable addition to your team.', style: { fontSize: 11, left: 50, top: 300, width: 500, height: 60, lineHeight: 1.6 } },
            { type: 'text', content: 'In my current role at [Current Company], I have [specific accomplishment with metrics]. This experience has equipped me with [relevant skills] that align perfectly with your requirements.', style: { fontSize: 11, left: 50, top: 375, width: 500, height: 60, lineHeight: 1.6 } },
            { type: 'text', content: 'I am particularly drawn to [Company Name] because of [specific reason]. I would welcome the opportunity to discuss how my skills and experience can contribute to your team\'s success.', style: { fontSize: 11, left: 50, top: 450, width: 500, height: 55, lineHeight: 1.6 } },
            { type: 'text', content: 'Thank you for considering my application. I look forward to hearing from you.', style: { fontSize: 11, left: 50, top: 520, width: 500, height: 35, lineHeight: 1.6 } },
            { type: 'text', content: 'Sincerely,\n\nYour Name', style: { fontSize: 11, left: 50, top: 570, width: 200, height: 50, lineHeight: 1.6 } },
        ],
    },
    {
        id: 'academic-cv',
        name: 'Academic CV',
        description: 'Comprehensive format for academic and research positions',
        icon: GraduationCap,
        color: '#dc2626',
        elements: [
            { type: 'text', content: 'Dr. Jane Smith, Ph.D.', style: { fontSize: 26, fontWeight: '700', left: 50, top: 40, width: 500, height: 35 } },
            { type: 'text', content: 'Associate Professor of Computer Science', style: { fontSize: 13, color: '#4b5563', left: 50, top: 80, width: 500, height: 20 } },
            { type: 'text', content: 'University Name | Department of Computer Science\njane.smith@university.edu | (555) 123-4567', style: { fontSize: 11, color: '#6b7280', left: 50, top: 105, width: 500, height: 35, lineHeight: 1.5 } },
            { type: 'divider', content: '', style: { left: 50, top: 150, width: 500, height: 2 } },
            { type: 'text', content: 'EDUCATION', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 170, width: 500, height: 18 } },
            { type: 'text', content: 'Ph.D. in Computer Science\nMIT | 2015\nDissertation: "Machine Learning Applications in..."', style: { fontSize: 11, left: 50, top: 195, width: 500, height: 50, lineHeight: 1.5 } },
            { type: 'text', content: 'RESEARCH INTERESTS', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 265, width: 500, height: 18 } },
            { type: 'text', content: 'Artificial Intelligence, Machine Learning, Natural Language Processing, Human-Computer Interaction', style: { fontSize: 11, left: 50, top: 288, width: 500, height: 35, lineHeight: 1.5 } },
            { type: 'text', content: 'PUBLICATIONS', style: { fontSize: 12, fontWeight: '700', letterSpacing: 1, left: 50, top: 340, width: 500, height: 18 } },
            { type: 'text', content: 'Smith, J., et al. (2024). "Title of Paper." Journal Name, Vol. X, pp. 1-15.\nSmith, J. & Doe, J. (2023). "Conference Paper Title." Proceedings of Conference.', style: { fontSize: 11, left: 50, top: 363, width: 500, height: 50, lineHeight: 1.5 } },
        ],
    },
    {
        id: 'portfolio',
        name: 'Portfolio One-Pager',
        description: 'Visual showcase for designers and creatives',
        icon: Layout,
        color: '#ea580c',
        elements: [
            { type: 'text', content: 'CREATIVE\nPORTFOLIO', style: { fontSize: 36, fontWeight: '800', left: 50, top: 40, width: 300, height: 90, lineHeight: 1.1 } },
            { type: 'text', content: 'Alex Designer', style: { fontSize: 16, fontWeight: '600', color: '#ea580c', left: 50, top: 140, width: 200, height: 25 } },
            { type: 'text', content: 'UI/UX Designer & Brand Strategist', style: { fontSize: 12, color: '#6b7280', left: 50, top: 168, width: 250, height: 20 } },
            { type: 'divider', content: '', style: { left: 50, top: 200, width: 150, height: 3, backgroundColor: '#ea580c' } },
            { type: 'text', content: 'FEATURED WORK', style: { fontSize: 11, fontWeight: '600', letterSpacing: 1, left: 50, top: 230, width: 150, height: 18 } },
            { type: 'container', content: '', style: { left: 50, top: 260, width: 500, height: 180 }, props: { direction: 'row', gap: 16, padding: 0 } },
            { type: 'text', content: 'Project 1\nBrand Identity', style: { fontSize: 11, left: 50, top: 460, width: 150, height: 35, lineHeight: 1.4 } },
            { type: 'text', content: 'Project 2\nMobile App', style: { fontSize: 11, left: 215, top: 460, width: 150, height: 35, lineHeight: 1.4 } },
            { type: 'text', content: 'Project 3\nWeb Design', style: { fontSize: 11, left: 380, top: 460, width: 150, height: 35, lineHeight: 1.4 } },
            { type: 'text', content: 'CONTACT', style: { fontSize: 11, fontWeight: '600', letterSpacing: 1, left: 50, top: 520, width: 150, height: 18 } },
            { type: 'text', content: 'hello@alexdesigner.com\nportfolio.alexdesigner.com\n@alexdesigner', style: { fontSize: 11, color: '#6b7280', left: 50, top: 545, width: 250, height: 50, lineHeight: 1.5 } },
        ],
    },
];

interface StartingPointsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StartingPointsModal({ isOpen, onClose }: StartingPointsModalProps) {
    const { addElement, updateElementStyle, data } = useSandboxStore();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    if (!isOpen) return null;

    const applyTemplate = async (template: Template) => {
        setIsApplying(true);
        setSelectedTemplate(template.id);

        const currentPage = data.pages[data.currentPageIndex];
        if (!currentPage) return;

        // Add each element from template
        for (const element of template.elements) {
            addElement(element.type as any, element.content);
            const newElement = useSandboxStore.getState().data.elements.at(-1);
            if (newElement) {
                updateElementStyle(newElement.id, element.style);
                if (element.props) {
                    useSandboxStore.setState((state) => ({
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el =>
                                el.id === newElement.id ? { ...el, props: { ...el.props, ...element.props } } : el
                            ),
                        },
                    }));
                }
            }
        }

        setTimeout(() => {
            setIsApplying(false);
            onClose();
        }, 500);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '900px',
                maxHeight: '85vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 28px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>
                            Choose a Starting Point
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                            Pick a template to get started, or start with a blank canvas
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                        }}
                    >
                        <X size={20} color="#6b7280" />
                    </button>
                </div>

                {/* Templates Grid */}
                <div style={{
                    padding: '24px',
                    overflowY: 'auto',
                    maxHeight: 'calc(85vh - 150px)',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '16px',
                    }}>
                        {TEMPLATES.map((template) => {
                            const IconComponent = template.icon;
                            const isSelected = selectedTemplate === template.id;

                            return (
                                <div
                                    key={template.id}
                                    onClick={() => !isApplying && applyTemplate(template)}
                                    style={{
                                        border: `2px solid ${isSelected ? template.color : '#e5e7eb'}`,
                                        borderRadius: '12px',
                                        padding: '20px',
                                        cursor: isApplying ? 'wait' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: isSelected ? `${template.color}08` : 'white',
                                        position: 'relative',
                                        opacity: isApplying && !isSelected ? 0.5 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isApplying) {
                                            e.currentTarget.style.borderColor = template.color;
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {template.badge && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '12px',
                                            backgroundColor: template.color,
                                            color: 'white',
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                        }}>
                                            {template.badge}
                                        </span>
                                    )}

                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        backgroundColor: `${template.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '16px',
                                    }}>
                                        <IconComponent size={24} color={template.color} />
                                    </div>

                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#111827',
                                        marginBottom: '6px',
                                    }}>
                                        {template.name}
                                    </h3>

                                    <p style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        lineHeight: 1.4,
                                    }}>
                                        {template.description}
                                    </p>

                                    <div style={{
                                        marginTop: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: template.color,
                                        fontSize: '13px',
                                        fontWeight: 500,
                                    }}>
                                        {isSelected && isApplying ? (
                                            <>Creating...</>
                                        ) : (
                                            <>
                                                Use this template <ArrowRight size={14} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 28px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        Start with blank canvas
                    </button>
                </div>
            </div>
        </div>
    );
}
