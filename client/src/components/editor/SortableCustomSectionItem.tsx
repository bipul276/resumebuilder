import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, X } from 'lucide-react';
import type { CustomSectionItem } from '@resumebuilder/shared';

interface Props {
    sectionId: string;
    item: CustomSectionItem;
    onUpdate: (sectionId: string, itemId: string, field: string, value: unknown) => void;
    onRemove: (sectionId: string, itemId: string) => void;
    onAddBullet: (sectionId: string, itemId: string) => void;
    onUpdateBullet: (sectionId: string, itemId: string, bulletIndex: number, value: string) => void;
    onRemoveBullet: (sectionId: string, itemId: string, bulletIndex: number) => void;
}

export const SortableCustomSectionItem: React.FC<Props> = ({
    sectionId, item, onUpdate, onRemove, onAddBullet, onUpdateBullet, onRemoveBullet,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="sortable-card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <button
                    className="drag-handle"
                    {...attributes}
                    {...listeners}
                    style={{ cursor: 'grab', background: 'none', border: 'none', color: '#6b7280', padding: 4, display: 'flex' }}
                    title="Drag to reorder"
                >
                    <GripVertical size={16} />
                </button>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                    {item.title || 'Untitled Item'}
                </span>
                <button
                    onClick={() => onRemove(sectionId, item.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: 4 }}
                    title="Remove item"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input
                    type="text"
                    placeholder="Title (e.g., Award Name)"
                    value={item.title || ''}
                    onChange={(e) => onUpdate(sectionId, item.id, 'title', e.target.value)}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Subtitle (e.g., Organization)"
                    value={item.subtitle || ''}
                    onChange={(e) => onUpdate(sectionId, item.id, 'subtitle', e.target.value)}
                    className="form-input"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input
                    type="month"
                    placeholder="Date"
                    value={item.date || ''}
                    onChange={(e) => onUpdate(sectionId, item.id, 'date', e.target.value)}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={item.description || ''}
                    onChange={(e) => onUpdate(sectionId, item.id, 'description', e.target.value)}
                    className="form-input"
                />
            </div>

            {/* Bullet Points */}
            <div style={{ marginTop: 8 }}>
                {item.bullets.map((bullet, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>•</span>
                        <input
                            type="text"
                            value={bullet}
                            onChange={(e) => onUpdateBullet(sectionId, item.id, idx, e.target.value)}
                            placeholder="Bullet point..."
                            className="form-input"
                            style={{ flex: 1 }}
                        />
                        <button
                            onClick={() => onRemoveBullet(sectionId, item.id, idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: 2 }}
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => onAddBullet(sectionId, item.id)}
                    style={{
                        background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer',
                        fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0',
                    }}
                >
                    <Plus size={12} /> Add bullet
                </button>
            </div>
        </div>
    );
};
