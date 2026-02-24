import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ExternalLink } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';

interface SortableCertificationCardProps {
    certId: string;
    index: number;
}

export function SortableCertificationCard({ certId, index }: SortableCertificationCardProps) {
    const { resume, updateCertification, removeCertification } = useResumeStore();
    const cert = resume.certifications.find(c => c.id === certId);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: certId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (!cert) return null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="entry-card"
        >
            <div className="entry-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        className="drag-handle"
                        {...attributes}
                        {...listeners}
                        style={{
                            cursor: 'grab',
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            padding: '4px',
                            display: 'flex',
                        }}
                        title="Drag to reorder"
                    >
                        <GripVertical size={16} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#d1d5db' }}>
                        {cert.name || `Certification ${index + 1}`}
                    </span>
                </div>
                <button
                    onClick={() => removeCertification(cert.id)}
                    className="btn btn-ghost"
                    style={{ color: '#ef4444', padding: '4px' }}
                    title="Remove certification"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Certification Name *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        placeholder="AWS Solutions Architect"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Issuing Organization *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        placeholder="Amazon Web Services"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Credential ID</label>
                    <input
                        type="text"
                        className="form-input"
                        value={cert.credentialId || ''}
                        onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                        placeholder="ABC123XYZ"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Issue Date</label>
                    <input
                        type="month"
                        className="form-input"
                        value={cert.date || ''}
                        onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                        type="month"
                        className="form-input"
                        value={cert.expiryDate || ''}
                        onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                    />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Credential URL <ExternalLink size={12} />
                        </span>
                    </label>
                    <input
                        type="url"
                        className="form-input"
                        value={cert.url || ''}
                        onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                        placeholder="https://www.credly.com/badges/..."
                    />
                </div>
            </div>
        </div>
    );
}
