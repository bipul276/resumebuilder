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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import { SortableEducationCard } from './SortableEducationCard';

export function EducationForm() {
    const {
        resume,
        addEducation,
        updateEducation,
        removeEducation,
        reorderEducation,
    } = useResumeStore();

    const { education } = resume;

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

    const educationIds = useMemo(() => education.map(edu => edu.id), [education]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = education.findIndex((edu) => edu.id === active.id);
            const newIndex = education.findIndex((edu) => edu.id === over.id);
            reorderEducation(oldIndex, newIndex);
        }
    };

    return (
        <div className="fade-in">
            <div className="form-section">
                <div className="form-section-header">
                    <h2 className="form-section-title">Education</h2>
                    <button className="btn btn-secondary btn-sm" onClick={addEducation}>
                        <Plus size={16} />
                        Add Education
                    </button>
                </div>

                {education.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--color-text-muted)',
                    }}>
                        <p>No education added yet.</p>
                        <p>Click "Add Education" to get started.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={educationIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {education.map((edu, index) => (
                                <SortableEducationCard
                                    key={edu.id}
                                    education={edu}
                                    index={index}
                                    onUpdate={updateEducation}
                                    onRemove={removeEducation}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
