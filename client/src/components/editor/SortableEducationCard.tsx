import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, AlertTriangle } from 'lucide-react';
import type { Education } from '@resumebuilder/shared';
import { useResumeStore } from '../../stores/useResumeStore';
import { getTemplateCapabilities } from '../../constants/templateCapabilities';

interface SortableEducationCardProps {
    education: Education;
    index: number;
    onUpdate: (id: string, field: string, value: string) => void;
    onRemove: (id: string) => void;
}

export function SortableEducationCard({
    education: edu,
    index,
    onUpdate,
    onRemove,
}: SortableEducationCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: edu.id });

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
                        {edu.degree || edu.institution || `Education ${index + 1}`}
                    </span>
                </div>
                <div className="entry-card-actions">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => onRemove(edu.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Institution *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Stanford University"
                        value={edu.institution}
                        onChange={(e) => onUpdate(edu.id, 'institution', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Stanford, CA"
                        value={edu.location || ''}
                        onChange={(e) => onUpdate(edu.id, 'location', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Degree *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Field of Study</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Computer Science"
                        value={edu.field || ''}
                        onChange={(e) => onUpdate(edu.id, 'field', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                        type="month"
                        className="form-input"
                        value={edu.startDate || ''}
                        onChange={(e) => onUpdate(edu.id, 'startDate', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Graduation Date</label>
                    <input
                        type="month"
                        className="form-input"
                        value={edu.endDate || ''}
                        onChange={(e) => onUpdate(edu.id, 'endDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" style={getFieldStyle(capabilities.education.gpa)}>
                    <label className="form-label">Score (CGPA / %)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                            className="form-input"
                            style={{ width: '100px' }}
                            onChange={() => { }}
                            defaultValue="CGPA"
                            disabled={!capabilities.education.gpa}
                        >
                            <option value="CGPA">CGPA</option>
                            <option value="Percentage">%</option>
                            <option value="GPA">GPA</option>
                        </select>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 9.5 or 85%"
                            value={edu.gpa || ''}
                            onChange={(e) => onUpdate(edu.id, 'gpa', e.target.value)}
                            disabled={!capabilities.education.gpa}
                        />
                    </div>
                    {!capabilities.education.gpa && renderDisabledOverlay("GPA not shown in current layout")}
                </div>
                <div className="form-group">
                    <label className="form-label">Honors / Awards</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Magna Cum Laude"
                        value={edu.honors || ''}
                        onChange={(e) => onUpdate(edu.id, 'honors', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
