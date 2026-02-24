import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Trash2, FolderPlus } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import { SortableCustomSectionItem } from './SortableCustomSectionItem';

export const CustomSectionsForm: React.FC = () => {
    const customSections = useResumeStore((s) => s.resume.customSections);
    const addCustomSection = useResumeStore((s) => s.addCustomSection);
    const updateCustomSectionTitle = useResumeStore((s) => s.updateCustomSectionTitle);
    const removeCustomSection = useResumeStore((s) => s.removeCustomSection);
    const addCustomSectionItem = useResumeStore((s) => s.addCustomSectionItem);
    const updateCustomSectionItem = useResumeStore((s) => s.updateCustomSectionItem);
    const removeCustomSectionItem = useResumeStore((s) => s.removeCustomSectionItem);
    const reorderCustomSectionItems = useResumeStore((s) => s.reorderCustomSectionItems);
    const addCustomSectionBullet = useResumeStore((s) => s.addCustomSectionBullet);
    const updateCustomSectionBullet = useResumeStore((s) => s.updateCustomSectionBullet);
    const removeCustomSectionBullet = useResumeStore((s) => s.removeCustomSectionBullet);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (sectionId: string) => (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const section = customSections.find((s) => s.id === sectionId);
            if (!section) return;
            const oldIndex = section.items.findIndex((item) => item.id === active.id);
            const newIndex = section.items.findIndex((item) => item.id === over.id);
            reorderCustomSectionItems(sectionId, oldIndex, newIndex);
        }
    };

    return (
        <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="form-section-title" style={{ margin: 0 }}>Custom Sections</h3>
                <button
                    onClick={addCustomSection}
                    className="btn-add"
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', background: '#2563eb', color: '#fff',
                        border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                    }}
                >
                    <FolderPlus size={16} /> Add Section
                </button>
            </div>

            {customSections.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: '32px 16px', color: '#9ca3af',
                    border: '2px dashed #e5e7eb', borderRadius: 12,
                }}>
                    <FolderPlus size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                    <p style={{ fontSize: '0.9rem' }}>No custom sections yet</p>
                    <p style={{ fontSize: '0.8rem' }}>Click "Add Section" to create one (e.g., Volunteer Work, Awards, Publications)</p>
                </div>
            )}

            {customSections.map((section) => (
                <div
                    key={section.id}
                    style={{
                        border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16,
                        background: '#fafafa',
                    }}
                >
                    {/* Section Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                            placeholder="Section Title"
                            className="form-input"
                            style={{ flex: 1, fontWeight: 700, fontSize: '1rem' }}
                        />
                        <button
                            onClick={() => removeCustomSection(section.id)}
                            style={{
                                background: 'none', border: '1px solid #fecaca', color: '#ef4444',
                                cursor: 'pointer', display: 'flex', padding: 6, borderRadius: 6,
                            }}
                            title="Delete this section"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Items */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd(section.id)}
                    >
                        <SortableContext
                            items={section.items.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {section.items
                                .sort((a, b) => a.order - b.order)
                                .map((item) => (
                                    <SortableCustomSectionItem
                                        key={item.id}
                                        sectionId={section.id}
                                        item={item}
                                        onUpdate={updateCustomSectionItem}
                                        onRemove={removeCustomSectionItem}
                                        onAddBullet={addCustomSectionBullet}
                                        onUpdateBullet={updateCustomSectionBullet}
                                        onRemoveBullet={removeCustomSectionBullet}
                                    />
                                ))}
                        </SortableContext>
                    </DndContext>

                    {/* Add Item Button */}
                    <button
                        onClick={() => addCustomSectionItem(section.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                            padding: '10px', background: '#fff', border: '1px dashed #d1d5db',
                            borderRadius: 8, cursor: 'pointer', color: '#6b7280', justifyContent: 'center',
                            fontSize: '0.85rem', marginTop: 8,
                        }}
                    >
                        <Plus size={14} /> Add Item
                    </button>
                </div>
            ))}
        </div>
    );
};
