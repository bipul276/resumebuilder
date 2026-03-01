import { useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, FileText, Briefcase, GraduationCap, Code, FolderOpen, Settings2 } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import type { SectionType } from '@resumebuilder/shared';

const SECTION_INFO: Record<SectionType, { label: string; icon: React.ReactNode }> = {
    summary: { label: 'Professional Summary', icon: <FileText size={18} /> },
    workExperience: { label: 'Work Experience', icon: <Briefcase size={18} /> },
    education: { label: 'Education', icon: <GraduationCap size={18} /> },
    skills: { label: 'Skills', icon: <Code size={18} /> },
    projects: { label: 'Projects', icon: <FolderOpen size={18} /> },
    certifications: { label: 'Certifications', icon: <FileText size={18} /> },
    languages: { label: 'Languages', icon: <FileText size={18} /> },
    custom: { label: 'Custom Sections', icon: <FileText size={18} /> },
};

interface SortableSectionItemProps {
    section: SectionType;
}

function SortableSectionItem({ section }: SortableSectionItemProps) {
    const { resume } = useResumeStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const isCustom = section.startsWith('custom_');
    let label = 'Unknown Section';
    let icon: React.ReactNode = <FileText size={18} />;

    if (isCustom) {
        const customId = section.replace('custom_', '');
        const customSection = resume.customSections?.find(s => s.id === customId);
        label = customSection?.title || 'Custom Section';
    } else if (SECTION_INFO[section]) {
        label = SECTION_INFO[section].label;
        icon = SECTION_INFO[section].icon;
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="section-order-item"
        >
            <span
                className="drag-handle"
                {...attributes}
                {...listeners}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <GripVertical size={18} />
            </span>
            <span className="section-icon">{icon}</span>
            <span className="section-label">{label}</span>
        </div>
    );
}

export function SettingsForm() {
    const { resume, updateSectionOrder, updateSettings } = useResumeStore();
    const { settings } = resume;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const sectionOrder = useMemo(() =>
        settings.sectionOrder || ['summary', 'workExperience', 'education', 'skills', 'projects'],
        [settings.sectionOrder]
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id as SectionType);
            const newIndex = sectionOrder.indexOf(over.id as SectionType);
            const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
            updateSectionOrder(newOrder);
        }
    };

    return (
        <div className="fade-in">
            <div className="form-section">
                <div className="form-section-header">
                    <h2 className="form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings2 size={20} />
                        Section Order
                    </h2>
                </div>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    marginBottom: '16px',
                    fontSize: 'var(--font-size-sm)',
                }}>
                    Drag and drop to reorder sections in your resume. The preview will update automatically.
                </p>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sectionOrder}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="section-order-list">
                            {sectionOrder.map((section) => (
                                <SortableSectionItem key={section} section={section} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className="form-section">
                <h2 className="form-section-title">Template Settings</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Font Size</label>
                        <select
                            className="form-input"
                            value={settings.fontSize}
                            onChange={(e) => updateSettings('fontSize', e.target.value)}
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Primary Color</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => updateSettings('primaryColor', e.target.value)}
                                style={{
                                    width: '48px',
                                    height: '38px',
                                    padding: '2px',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                value={settings.primaryColor}
                                onChange={(e) => updateSettings('primaryColor', e.target.value)}
                                placeholder="#2563eb"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Page Margin ({settings.margin || 18}mm)</label>
                        <input
                            type="range"
                            min="10"
                            max="30"
                            step="1"
                            value={settings.margin || 18}
                            onChange={(e) => updateSettings('margin', parseInt(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer', marginTop: '8px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            <span>Wide (30mm)</span>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '16px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.useFullUrls ?? true}
                                onChange={(e) => updateSettings('useFullUrls', e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                            />
                            Show Full URLs
                        </label>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', marginLeft: '24px' }}>
                            Show full links (e.g. linkedin.com/in/you) instead of just "LinkedIn"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
