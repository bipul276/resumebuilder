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
import { SortableProjectCard } from './SortableProjectCard';

export function ProjectsForm() {
    const {
        resume,
        addProject,
        updateProject,
        removeProject,
        reorderProjects,
    } = useResumeStore();

    const { projects } = resume;

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

    const projectIds = useMemo(() => projects.map(p => p.id), [projects]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = projects.findIndex((p) => p.id === active.id);
            const newIndex = projects.findIndex((p) => p.id === over.id);
            reorderProjects(oldIndex, newIndex);
        }
    };

    return (
        <div className="fade-in">
            <div className="form-section">
                <div className="form-section-header">
                    <h2 className="form-section-title">Projects</h2>
                    <button className="btn btn-secondary btn-sm" onClick={addProject}>
                        <Plus size={16} />
                        Add Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--color-text-muted)',
                    }}>
                        <p>No projects added yet.</p>
                        <p>Click "Add Project" to showcase your work.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={projectIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {projects.map((project, index) => (
                                <SortableProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    onUpdate={updateProject}
                                    onRemove={removeProject}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
