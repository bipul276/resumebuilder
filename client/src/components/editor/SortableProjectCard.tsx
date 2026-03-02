import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, AlertTriangle } from 'lucide-react';
import type { Project } from '@resumebuilder/shared';
import { useState } from 'react';
import { useResumeStore } from '../../stores/useResumeStore';
import { getTemplateCapabilities } from '../../constants/templateCapabilities';

interface SortableProjectCardProps {
    project: Project;
    index: number;
    onUpdate: (id: string, field: string, value: unknown) => void;
    onRemove: (id: string) => void;
}

export function SortableProjectCard({
    project,
    index,
    onUpdate,
    onRemove,
}: SortableProjectCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const { resume } = useResumeStore();
    const capabilities = getTemplateCapabilities(resume.templateId);
    const [techInput, setTechInput] = useState('');

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const handleAddTech = () => {
        const techValue = techInput.trim();
        if (techValue) {
            onUpdate(project.id, 'technologies', [...project.technologies, techValue]);
            setTechInput('');
        }
    };

    const handleRemoveTech = (techIndex: number) => {
        onUpdate(project.id, 'technologies', project.technologies.filter((_, i) => i !== techIndex));
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
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            }}>
                <AlertTriangle size={14} />
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
                        {project.name || `Project ${index + 1}`}
                    </span>
                </div>
                <div className="entry-card-actions">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => onRemove(project.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="form-row full">
                <div className="form-group">
                    <label className="form-label">Project Name *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="My Awesome Project"
                        value={project.name}
                        onChange={(e) => onUpdate(project.id, 'name', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" style={getFieldStyle(capabilities.projects.url)}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                        GitHub URL
                    </label>
                    <input
                        type="url"
                        className="form-input"
                        placeholder="github.com/username/project"
                        value={project.githubUrl || ''}
                        onChange={(e) => onUpdate(project.id, 'githubUrl', e.target.value)}
                        disabled={!capabilities.projects.url}
                    />
                    {!capabilities.projects.url && renderDisabledOverlay("Not shown in current layout")}
                </div>
                <div className="form-group" style={getFieldStyle(capabilities.projects.url)}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Live URL
                    </label>
                    <input
                        type="url"
                        className="form-input"
                        placeholder="project.com"
                        value={project.liveUrl || ''}
                        onChange={(e) => onUpdate(project.id, 'liveUrl', e.target.value)}
                        disabled={!capabilities.projects.url}
                    />
                    {(project.url && !project.liveUrl) && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Legacy URL: {project.url}</div>
                    )}
                    {!capabilities.projects.url && renderDisabledOverlay("Not shown in current layout")}
                </div>
            </div>

            <div className="form-row full">
                <div className="form-group" style={getFieldStyle(capabilities.projects.description)}>
                    <label className="form-label" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Description</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>Supports markdown links: [Text](https://url.com)</span>
                    </label>
                    <textarea
                        className="form-textarea"
                        placeholder="Brief description of the project and your role..."
                        rows={3}
                        value={project.description || ''}
                        onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
                        disabled={!capabilities.projects.description}
                    />
                    {!capabilities.projects.description && renderDisabledOverlay("Not shown in current layout")}
                </div>
            </div>

            <div className="form-group" style={getFieldStyle(capabilities.projects.technologies)}>
                <label className="form-label">Technologies Used</label>
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Add technology..."
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTech();
                                }
                            }}
                            disabled={!capabilities.projects.technologies}
                        />
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleAddTech}
                            disabled={!capabilities.projects.technologies}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {project.technologies.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {project.technologies.map((tech, techIndex) => (
                                <span
                                    key={techIndex}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        background: 'var(--color-bg-input)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--font-size-xs)',
                                    }}
                                >
                                    {tech}
                                    <button
                                        onClick={() => handleRemoveTech(techIndex)}
                                        style={{
                                            display: 'flex',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-muted)',
                                            padding: '0',
                                        }}
                                        disabled={!capabilities.projects.technologies}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    {!capabilities.projects.technologies && renderDisabledOverlay("Technology tags not supported in this layout")}
                </div>
            </div>
        </div>
    );
}
