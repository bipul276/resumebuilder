import { Plus, Award } from 'lucide-react';
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
import { useResumeStore } from '../../stores/useResumeStore';
import { SortableCertificationCard } from './SortableCertificationCard';

export function CertificationsForm() {
    const { resume, addCertification, reorderCertifications } = useResumeStore();
    const certifications = [...resume.certifications].sort((a, b) => a.order - b.order);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = certifications.findIndex((c) => c.id === active.id);
            const newIndex = certifications.findIndex((c) => c.id === over.id);
            reorderCertifications(oldIndex, newIndex);
        }
    };

    return (
        <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Award size={20} />
                    Certifications
                </h2>
                <button className="btn btn-primary" onClick={addCertification} style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <Plus size={16} />
                    Add Certification
                </button>
            </div>

            {certifications.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#6b7280',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px dashed #374151',
                }}>
                    <Award size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', marginBottom: '4px' }}>No certifications yet</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Add professional certifications, licenses, or credentials</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={certifications.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {certifications.map((cert, index) => (
                                <SortableCertificationCard
                                    key={cert.id}
                                    certId={cert.id}
                                    index={index}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
