import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, AlertTriangle } from 'lucide-react';
import type { WorkExperience } from '@resumebuilder/shared';
import { useResumeStore } from '../../stores/useResumeStore';
import { getTemplateCapabilities } from '../../constants/templateCapabilities';
import { AiAssistButton } from './AiAssistButton';

interface SortableExperienceCardProps {
    experience: WorkExperience;
    index: number;
    onUpdate: (id: string, field: string, value: unknown) => void;
    onRemove: (id: string) => void;
    onAddBullet: (id: string) => void;
    onUpdateBullet: (id: string, bulletIndex: number, value: string) => void;
    onRemoveBullet: (id: string, bulletIndex: number) => void;
}

export function SortableExperienceCard({
    experience: exp,
    index,
    onUpdate,
    onRemove,
    onAddBullet,
    onUpdateBullet,
    onRemoveBullet,
}: SortableExperienceCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: exp.id });

    const { resume } = useResumeStore();
    const capabilities = getTemplateCapabilities(resume.templateId);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const renderDisabledOverlay = (message: string) => (
        <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(23, 23, 28, 0.6)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(1px)',
        }}>
            <div style={{
                background: '#27272a',
                border: '1px solid #ecc94b',
                color: '#ecc94b',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            }}>
                <AlertTriangle size={12} />
                {message}
            </div>
        </div>
    );

    const getFieldStyle = (enabled: boolean): React.CSSProperties => ({
        position: 'relative',
        opacity: enabled ? 1 : 0.6,
        pointerEvents: enabled ? 'auto' : 'none',
        filter: enabled ? 'none' : 'grayscale(1)',
    });

    return (
        <div ref={setNodeRef} style={style} className="entry-card">
            <div className="entry-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                        className="drag-handle"
                        {...attributes}
                        {...listeners}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        <GripVertical size={18} />
                    </span>
                    <span className="entry-card-title">
                        {exp.position || exp.company || `Experience ${index + 1}`}
                    </span>
                </div>
                <div className="entry-card-actions">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => onRemove(exp.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Position / Title *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Software Engineer"
                        value={exp.position}
                        onChange={(e) => onUpdate(exp.id, 'position', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Google"
                        value={exp.company}
                        onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" style={getFieldStyle(capabilities.workExperience.location)}>
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Mountain View, CA"
                        value={exp.location || ''}
                        onChange={(e) => onUpdate(exp.id, 'location', e.target.value)}
                        disabled={!capabilities.workExperience.location}
                    />
                    {!capabilities.workExperience.location && renderDisabledOverlay("Location not shown in this layout")}
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={exp.isCurrentRole}
                            onChange={(e) => onUpdate(exp.id, 'isCurrentRole', e.target.checked)}
                            style={{ width: 'auto' }}
                        />
                        Current Position
                    </label>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                        type="month"
                        className="form-input"
                        value={exp.startDate}
                        onChange={(e) => onUpdate(exp.id, 'startDate', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                        type="month"
                        className="form-input"
                        value={exp.endDate || ''}
                        onChange={(e) => onUpdate(exp.id, 'endDate', e.target.value)}
                        disabled={exp.isCurrentRole}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Bullet Points</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>Supports markdown links: [Text](https://url.com)</span>
                    </div>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => onAddBullet(exp.id)}
                        style={{ padding: '4px 8px' }}
                    >
                        <Plus size={14} />
                        Add Bullet
                    </button>
                </label>
                <div className="bullet-list">
                    {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="bullet-item" style={{ alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Describe your achievement or responsibility..."
                                    value={bullet}
                                    onChange={(e) => onUpdateBullet(exp.id, bulletIndex, e.target.value)}
                                />
                                <AiAssistButton
                                    text={bullet}
                                    type="experience"
                                    context={`${exp.position} at ${exp.company}`}
                                    onImprove={(newText) => onUpdateBullet(exp.id, bulletIndex, newText)}
                                    style={{ alignSelf: 'flex-end' }}
                                />
                            </div>
                            {exp.bullets.length > 1 && (
                                <button
                                    className="btn btn-ghost btn-icon btn-sm"
                                    onClick={() => onRemoveBullet(exp.id, bulletIndex)}
                                    style={{ marginTop: '8px' }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
