import { useState } from 'react';
import { useStore } from 'zustand';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { ResumeVersion, generateId } from '@resumebuilder/shared';
import {
    Save,
    FolderOpen,
    Trash2,
    Edit3,
    Check,
    X,
    Clock,
    FileText,
    Plus,
    Copy,
} from 'lucide-react';

export function VersionsPanel() {
    const { data } = useSandboxStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [newVersionName, setNewVersionName] = useState('');

    const versions = data.versions || [];

    const saveVersion = () => {
        if (!newVersionName.trim()) return;

        const newVersion: ResumeVersion = {
            id: generateId(),
            name: newVersionName.trim(),
            elements: JSON.parse(JSON.stringify(data.elements)), // Deep clone
            pages: JSON.parse(JSON.stringify(data.pages)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        useSandboxStore.setState({
            data: {
                ...data,
                versions: [...versions, newVersion],
                currentVersionId: newVersion.id,
            },
        });

        setNewVersionName('');
        setShowSaveDialog(false);
    };

    const loadVersion = (version: ResumeVersion) => {
        if (!confirm(`Load "${version.name}"? Current changes will be replaced.`)) return;

        useSandboxStore.setState({
            data: {
                ...data,
                elements: JSON.parse(JSON.stringify(version.elements)),
                pages: JSON.parse(JSON.stringify(version.pages)),
                currentVersionId: version.id,
            },
        });
    };

    const deleteVersion = (id: string) => {
        if (!confirm('Delete this version?')) return;

        useSandboxStore.setState({
            data: {
                ...data,
                versions: versions.filter(v => v.id !== id),
                currentVersionId: data.currentVersionId === id ? undefined : data.currentVersionId,
            },
        });
    };

    const renameVersion = (id: string) => {
        if (!editName.trim()) {
            setEditingId(null);
            return;
        }

        useSandboxStore.setState({
            data: {
                ...data,
                versions: versions.map(v =>
                    v.id === id ? { ...v, name: editName.trim(), updatedAt: new Date().toISOString() } : v
                ),
            },
        });

        setEditingId(null);
        setEditName('');
    };

    const duplicateVersion = (version: ResumeVersion) => {
        const newVersion: ResumeVersion = {
            ...JSON.parse(JSON.stringify(version)),
            id: generateId(),
            name: `${version.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        useSandboxStore.setState({
            data: {
                ...data,
                versions: [...versions, newVersion],
            },
        });
    };

    const formatDate = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ padding: '16px', fontSize: '13px' }}>
            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    Resume Versions
                </h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
                    Save different versions for different roles
                </p>
            </div>

            {/* Save New Version Button */}
            {!showSaveDialog ? (
                <button
                    onClick={() => setShowSaveDialog(true)}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#6b7280',
                        fontSize: '12px',
                        marginBottom: '16px',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2563eb';
                        e.currentTarget.style.color = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.color = '#6b7280';
                    }}
                >
                    <Plus size={16} />
                    Save Current as New Version
                </button>
            ) : (
                <div style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    background: '#f9fafb',
                }}>
                    <input
                        autoFocus
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        placeholder="e.g. Resume for Google"
                        style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '12px',
                            marginBottom: '8px',
                            outline: 'none',
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && saveVersion()}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={saveVersion}
                            disabled={!newVersionName.trim()}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '6px',
                                background: newVersionName.trim() ? '#2563eb' : '#d1d5db',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: newVersionName.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                            }}
                        >
                            <Save size={14} />
                            Save
                        </button>
                        <button
                            onClick={() => { setShowSaveDialog(false); setNewVersionName(''); }}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                background: 'white',
                                cursor: 'pointer',
                                fontSize: '12px',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Versions List */}
            {versions.length === 0 ? (
                <div style={{
                    padding: '32px 16px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: '#fafafa',
                }}>
                    <FileText size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <div style={{ fontSize: '12px' }}>No versions saved yet</div>
                    <div style={{ fontSize: '11px', marginTop: '4px' }}>
                        Save your first version to start
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {versions.map((version) => {
                        const isActive = data.currentVersionId === version.id;
                        const isEditing = editingId === version.id;

                        return (
                            <div
                                key={version.id}
                                style={{
                                    padding: '12px',
                                    border: `1px solid ${isActive ? '#2563eb' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    background: isActive ? '#eff6ff' : 'white',
                                }}
                            >
                                {isEditing ? (
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <input
                                            autoFocus
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '6px 8px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') renameVersion(version.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                        />
                                        <button
                                            onClick={() => renameVersion(version.id)}
                                            style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Check size={16} color="#16a34a" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <X size={16} color="#dc2626" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{
                                                    fontWeight: 600,
                                                    color: '#111827',
                                                    marginBottom: '2px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                }}>
                                                    {version.name}
                                                    {isActive && (
                                                        <span style={{
                                                            fontSize: '9px',
                                                            padding: '2px 6px',
                                                            background: '#2563eb',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                        }}>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{
                                                    fontSize: '10px',
                                                    color: '#6b7280',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}>
                                                    <Clock size={10} />
                                                    {formatDate(version.updatedAt)}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                <button
                                                    onClick={() => { setEditingId(version.id); setEditName(version.name); }}
                                                    style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                                                    title="Rename"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => duplicateVersion(version)}
                                                    style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                                                    title="Duplicate"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteVersion(version.id)}
                                                    style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {!isActive && (
                                            <button
                                                onClick={() => loadVersion(version)}
                                                style={{
                                                    marginTop: '8px',
                                                    width: '100%',
                                                    padding: '6px 10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '11px',
                                                    fontWeight: 500,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    color: '#374151',
                                                }}
                                            >
                                                <FolderOpen size={12} />
                                                Load This Version
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tips */}
            <div style={{
                marginTop: '16px',
                padding: '10px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#166534',
                lineHeight: 1.5,
            }}>
                💡 <strong>Tip:</strong> Create versions like "FAANG Resume", "Startup Resume", "Freelance CV" to quickly switch between tailored resumes.
            </div>

            {/* Change History */}
            <div style={{ marginTop: '16px' }}>
                <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}>
                    <Clock size={14} />
                    Change History
                </div>
                <ChangeHistory />
            </div>
        </div>
    );
}

// Change History Component using Zustand temporal
function ChangeHistory() {
    const { pastStates } = useStore(useSandboxStore.temporal, (state: any) => state);
    const { undo } = useSandboxStore.temporal.getState();

    const recentChanges = pastStates.slice(-5).reverse(); // Last 5 changes

    if (recentChanges.length === 0) {
        return (
            <div style={{
                padding: '12px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '11px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
            }}>
                No changes recorded yet
            </div>
        );
    }

    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden',
        }}>
            {recentChanges.map((state: any, index: number) => {
                const elementCount = state.data?.elements?.length || 0;
                const stepsBack = index + 1;

                return (
                    <div
                        key={index}
                        style={{
                            padding: '8px 10px',
                            borderBottom: index < recentChanges.length - 1 ? '1px solid #f3f4f6' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '11px',
                        }}
                    >
                        <div style={{ color: '#6b7280' }}>
                            <span style={{ color: '#374151', fontWeight: 500 }}>
                                {stepsBack === 1 ? 'Previous' : `${stepsBack} steps ago`}
                            </span>
                            <span style={{ marginLeft: '8px' }}>
                                ({elementCount} elements)
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                for (let i = 0; i < stepsBack; i++) {
                                    undo();
                                }
                            }}
                            style={{
                                padding: '3px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                background: 'white',
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: '#374151',
                            }}
                        >
                            Restore
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

