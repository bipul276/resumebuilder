import { useState, useMemo } from 'react';
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
} from '@dnd-kit/sortable';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import { SortableExperienceCard } from './SortableExperienceCard';

export function WorkExperienceForm() {
    const {
        resume,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        reorderWorkExperience,
        addBullet,
        updateBullet,
        removeBullet,
    } = useResumeStore();

    const { workExperience } = resume;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const experienceIds = useMemo(() => workExperience.map(exp => exp.id), [workExperience]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = workExperience.findIndex((exp) => exp.id === active.id);
            const newIndex = workExperience.findIndex((exp) => exp.id === over.id);
            reorderWorkExperience(oldIndex, newIndex);
        }
    };

    return (
        <div className="fade-in">
            <div className="form-section">
                <div className="form-section-header">
                    <h2 className="form-section-title">Work Experience</h2>
                    <button className="btn btn-secondary btn-sm" onClick={addWorkExperience}>
                        <Plus size={16} />
                        Add Experience
                    </button>
                </div>

                {workExperience.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--color-text-muted)',
                    }}>
                        <p>No work experience added yet.</p>
                        <p>Click "Add Experience" to get started.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={experienceIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {workExperience.map((exp, index) => (
                                <SortableExperienceCard
                                    key={exp.id}
                                    experience={exp}
                                    index={index}
                                    onUpdate={updateWorkExperience}
                                    onRemove={removeWorkExperience}
                                    onAddBullet={addBullet}
                                    onUpdateBullet={updateBullet}
                                    onRemoveBullet={removeBullet}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
