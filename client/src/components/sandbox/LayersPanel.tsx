import { useSandboxStore } from '../../stores/useSandboxStore';
import { Eye, EyeOff, Lock, Unlock, GripVertical, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { useState } from 'react';

export function LayersPanel() {
    const {
        data,
        selectedIds,
        selectElement,
        addToSelection,
        toggleVisibility,
        toggleLock,
        renameElement,
        moveLayerUp,
        moveLayerDown,
        bringToFront,
        sendToBack,
    } = useSandboxStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [collapsed, setCollapsed] = useState(false);

    // Get elements for current page, sorted by z-index (highest first for top-down display)
    const currentPage = data.pages[data.currentPageIndex];
    const pageElements = data.elements
        .filter((el) => el.pageId === currentPage?.id)
        .sort((a, b) => b.style.zIndex - a.style.zIndex);

    const handleStartRename = (id: string, currentName: string) => {
        setEditingId(id);
        setEditName(currentName);
    };

    const handleFinishRename = () => {
        if (editingId && editName.trim()) {
            renameElement(editingId, editName.trim());
        }
        setEditingId(null);
        setEditName('');
    };

    const getElementIcon = (type: string) => {
        switch (type) {
            case 'text': return 'T';
            case 'image': return '🖼';
            case 'shape': return '□';
            case 'icon': return '★';
            case 'divider': return '—';
            case 'skillbar': return '▬';
            case 'timeline': return '◎';
            default: return '•';
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: 'var(--color-bg-elevated)',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} color="var(--color-text-secondary)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Layers</span>
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Layer list */}
            {!collapsed && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {pageElements.length === 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '32px 16px',
                                color: 'var(--color-text-muted)',
                                fontSize: '12px',
                                textAlign: 'center',
                            }}
                        >
                            No elements yet.
                            <br />
                            Add elements from the toolbar.
                        </div>
                    ) : (
                        pageElements.map((element) => {
                            const isSelected = selectedIds.includes(element.id);
                            const isEditing = editingId === element.id;

                            return (
                                <div
                                    key={element.id}
                                    onClick={(e) => {
                                        if (e.shiftKey || e.ctrlKey || e.metaKey) {
                                            addToSelection(element.id);
                                        } else {
                                            selectElement(element.id);
                                        }
                                    }}
                                    onDoubleClick={() => handleStartRename(element.id, element.name)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 10px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        marginBottom: '2px',
                                        backgroundColor: isSelected ? 'var(--color-bg-input)' : 'transparent',
                                        border: isSelected ? '1px solid var(--color-primary-light)' : '1px solid transparent',
                                        opacity: element.visible ? 1 : 0.5,
                                        transition: 'all 0.1s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    {/* Drag handle */}
                                    <GripVertical size={14} color="var(--color-text-muted)" style={{ cursor: 'grab' }} />

                                    {/* Element type icon */}
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            color: 'var(--color-text-secondary)',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {getElementIcon(element.type)}
                                    </div>

                                    {/* Name */}
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onBlur={handleFinishRename}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleFinishRename();
                                                if (e.key === 'Escape') {
                                                    setEditingId(null);
                                                    setEditName('');
                                                }
                                            }}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                fontSize: '12px',
                                                padding: '2px 6px',
                                                border: '1px solid var(--color-primary)',
                                                borderRadius: '4px',
                                                outline: 'none',
                                                backgroundColor: 'var(--color-bg-input)',
                                                color: 'var(--color-text)',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                flex: 1,
                                                fontSize: '12px',
                                                color: isSelected ? 'var(--color-primary-light)' : 'var(--color-text)',
                                                fontWeight: isSelected ? 500 : 400,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {element.name}
                                        </span>
                                    )}

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLock(element.id);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '22px',
                                                height: '22px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                color: element.locked ? 'var(--color-danger)' : 'var(--color-text-muted)',
                                            }}
                                            title={element.locked ? 'Unlock' : 'Lock'}
                                        >
                                            {element.locked ? <Lock size={14} /> : <Unlock size={14} />}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleVisibility(element.id);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '22px',
                                                height: '22px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                color: element.visible ? 'var(--color-text-muted)' : 'var(--color-text-muted)',
                                                opacity: element.visible ? 1 : 0.5,
                                            }}
                                            title={element.visible ? 'Hide' : 'Show'}
                                        >
                                            {element.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Quick actions */}
            {!collapsed && selectedIds.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        gap: '4px',
                        padding: '8px',
                        borderTop: '1px solid var(--color-border)',
                    }}
                >
                    <button
                        onClick={() => selectedIds.forEach((id) => bringToFront(id))}
                        style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-input)',
                            cursor: 'pointer',
                            fontSize: '10px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        To Front
                    </button>
                    <button
                        onClick={() => selectedIds.forEach((id) => moveLayerUp(id))}
                        style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-input)',
                            cursor: 'pointer',
                            fontSize: '10px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Up
                    </button>
                    <button
                        onClick={() => selectedIds.forEach((id) => moveLayerDown(id))}
                        style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-input)',
                            cursor: 'pointer',
                            fontSize: '10px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Down
                    </button>
                    <button
                        onClick={() => selectedIds.forEach((id) => sendToBack(id))}
                        style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-input)',
                            cursor: 'pointer',
                            fontSize: '10px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        To Back
                    </button>
                </div>
            )}
        </div>
    );
}
