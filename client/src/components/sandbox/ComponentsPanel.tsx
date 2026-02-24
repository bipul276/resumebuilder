import { useSandboxStore } from '../../stores/useSandboxStore';
import { ComponentDefinition, SandboxElement, generateId } from '@resumebuilder/shared';
import { useState } from 'react';
import { Component, Plus, Copy, Unlink, Trash2, ChevronDown, ChevronRight, Edit3 } from 'lucide-react';

export function ComponentsPanel() {
    const { data, selectedIds, updateElement } = useSandboxStore();
    const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({});
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const { components, elements } = data;

    // Get store actions
    const store = useSandboxStore.getState();

    // Create component from selected elements
    const createComponent = () => {
        if (selectedIds.length === 0) return;

        const selectedElements = elements.filter(el => selectedIds.includes(el.id));
        if (selectedElements.length === 0) return;

        const componentName = selectedElements.length === 1
            ? `${selectedElements[0].name} Component`
            : `Component ${components.length + 1}`;

        const newComponent: ComponentDefinition = {
            id: generateId(),
            name: componentName,
            sourceElementIds: selectedIds,
            variants: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Update store with new component
        useSandboxStore.setState((state) => ({
            data: {
                ...state.data,
                components: [...state.data.components, newComponent],
            },
        }));

        // Mark selected elements as part of this component
        selectedIds.forEach(id => {
            updateElement(id, {
                props: {
                    ...(elements.find(el => el.id === id)?.props || {}),
                    componentInstance: {
                        componentId: newComponent.id,
                        overrides: {},
                        detached: false,
                    },
                },
            });
        });
    };

    // Instantiate (duplicate) a component
    const instantiateComponent = (component: ComponentDefinition) => {
        const sourceElements = elements.filter(el => component.sourceElementIds.includes(el.id));

        sourceElements.forEach(sourceEl => {
            const newId = generateId();
            const newElement: SandboxElement = {
                ...sourceEl,
                id: newId,
                name: `${sourceEl.name} (Instance)`,
                style: {
                    ...sourceEl.style,
                    left: sourceEl.style.left + 20,
                    top: sourceEl.style.top + 20,
                },
                props: {
                    ...sourceEl.props,
                    componentInstance: {
                        componentId: component.id,
                        overrides: {},
                        detached: false,
                    },
                },
            };

            useSandboxStore.setState((state) => ({
                data: {
                    ...state.data,
                    elements: [...state.data.elements, newElement],
                },
                selectedIds: [newId],
            }));
        });
    };

    // Detach instance from component
    const detachInstance = (elementId: string) => {
        const element = elements.find(el => el.id === elementId);
        if (!element?.props?.componentInstance) return;

        updateElement(elementId, {
            props: {
                ...element.props,
                componentInstance: {
                    ...element.props.componentInstance,
                    detached: true,
                },
            },
        });
    };

    // Delete component
    const deleteComponent = (componentId: string) => {
        useSandboxStore.setState((state) => ({
            data: {
                ...state.data,
                components: state.data.components.filter(c => c.id !== componentId),
            },
        }));
    };

    // Rename component
    const startRename = (component: ComponentDefinition) => {
        setRenamingId(component.id);
        setRenameValue(component.name);
    };

    const finishRename = () => {
        if (renamingId && renameValue.trim()) {
            useSandboxStore.setState((state) => ({
                data: {
                    ...state.data,
                    components: state.data.components.map(c =>
                        c.id === renamingId ? { ...c, name: renameValue.trim(), updatedAt: new Date().toISOString() } : c
                    ),
                },
            }));
        }
        setRenamingId(null);
        setRenameValue('');
    };

    const toggleExpand = (id: string) => {
        setExpandedComponents(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Get instances of a component
    const getInstances = (componentId: string) => {
        return elements.filter(el =>
            el.props?.componentInstance?.componentId === componentId &&
            !el.props?.componentInstance?.detached
        );
    };

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 500,
        color: '#374151',
        width: '100%',
        justifyContent: 'center',
    };

    return (
        <div style={{ fontSize: '13px' }}>
            {/* Create Component Button */}
            <button
                onClick={createComponent}
                disabled={selectedIds.length === 0}
                style={{
                    ...buttonStyle,
                    marginBottom: '16px',
                    background: selectedIds.length > 0 ? '#2563eb' : '#f3f4f6',
                    color: selectedIds.length > 0 ? 'white' : '#9ca3af',
                    borderColor: selectedIds.length > 0 ? '#2563eb' : '#e5e7eb',
                }}
            >
                <Plus size={14} />
                Create Component {selectedIds.length > 0 && `(${selectedIds.length} selected)`}
            </button>

            {/* Component List */}
            {components.length === 0 ? (
                <div style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                    <Component size={24} strokeWidth={1.5} color="#d1d5db" style={{ marginBottom: '8px' }} />
                    <p style={{ margin: 0 }}>No components yet</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px' }}>Select elements and click "Create Component"</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {components.map(component => {
                        const instances = getInstances(component.id);
                        const isExpanded = expandedComponents[component.id];

                        return (
                            <div
                                key={component.id}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Component Header */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 12px',
                                        background: '#f9fafb',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => toggleExpand(component.id)}
                                >
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <Component size={14} color="#6b7280" />

                                    {renamingId === component.id ? (
                                        <input
                                            type="text"
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            onBlur={finishRename}
                                            onKeyDown={(e) => e.key === 'Enter' && finishRename()}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                border: '1px solid #2563eb',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '12px',
                                            }}
                                        />
                                    ) : (
                                        <span style={{ flex: 1, fontWeight: 500, color: '#374151' }}>
                                            {component.name}
                                        </span>
                                    )}

                                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                                        {instances.length} instance{instances.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                                            <button
                                                onClick={() => instantiateComponent(component)}
                                                style={{
                                                    ...buttonStyle,
                                                    padding: '6px 10px',
                                                    fontSize: '11px',
                                                }}
                                                title="Create new instance"
                                            >
                                                <Copy size={12} /> Instantiate
                                            </button>
                                            <button
                                                onClick={() => startRename(component)}
                                                style={{
                                                    ...buttonStyle,
                                                    padding: '6px 10px',
                                                    fontSize: '11px',
                                                    flex: 0,
                                                }}
                                                title="Rename"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                            <button
                                                onClick={() => deleteComponent(component.id)}
                                                style={{
                                                    ...buttonStyle,
                                                    padding: '6px 10px',
                                                    fontSize: '11px',
                                                    flex: 0,
                                                    borderColor: '#fecaca',
                                                    color: '#dc2626',
                                                }}
                                                title="Delete component"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>

                                        {/* Instances List */}
                                        {instances.length > 0 && (
                                            <div>
                                                <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                                    INSTANCES
                                                </span>
                                                {instances.map(instance => (
                                                    <div
                                                        key={instance.id}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '6px 8px',
                                                            background: '#f3f4f6',
                                                            borderRadius: '4px',
                                                            marginBottom: '4px',
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '11px', color: '#4b5563' }}>
                                                            {instance.name}
                                                        </span>
                                                        <button
                                                            onClick={() => detachInstance(instance.id)}
                                                            style={{
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                color: '#9ca3af',
                                                                padding: '2px',
                                                            }}
                                                            title="Detach from component"
                                                        >
                                                            <Unlink size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
