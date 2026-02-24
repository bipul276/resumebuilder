import { useSandboxStore } from '../../stores/useSandboxStore';
import { ElementConstraints } from '@resumebuilder/shared';
import { Anchor, Pin, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export function ConstraintsPanel() {
    const { data, selectedIds, updateElement } = useSandboxStore();

    const selectedElement = data.elements.find((el) => selectedIds.includes(el.id));

    if (!selectedElement) {
        return null;
    }

    const constraints = selectedElement.constraints || {
        anchor: null,
        pinLeft: false,
        pinRight: false,
        pinTop: false,
        pinBottom: false,
    };

    const updateConstraints = (updates: Partial<ElementConstraints>) => {
        updateElement(selectedElement.id, {
            constraints: { ...constraints, ...updates } as ElementConstraints,
        });
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
    };

    const pinButtonStyle = (active: boolean): React.CSSProperties => ({
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
        borderRadius: '6px',
        background: active ? 'var(--color-bg-input)' : 'transparent',
        cursor: 'pointer',
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        transition: 'all 0.15s',
    });

    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
                <Anchor size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Constraints
            </label>

            {/* Anchor Target */}
            <div style={{
                marginBottom: '16px',
                padding: '10px',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                borderRadius: '6px'
            }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                    <div style={{ fontSize: '14px' }}>⚠️</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                        Constraints are only active in <strong>Free-form</strong> mode. Standard templates use strict layouts.
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Anchor To</span>
                <select
                    value={constraints.anchor || ''}
                    onChange={(e) => updateConstraints({ anchor: (e.target.value || null) as ElementConstraints['anchor'] })}
                    style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        fontSize: '13px',
                        outline: 'none',
                    }}
                >
                    <option value="">None</option>
                    <option value="page">Page</option>
                    <option value="parent">Parent Container</option>
                    <option value="section">Section</option>
                </select>
            </div>

            {/* Pin Edges */}
            <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>Pin Edges</span>

                {/* Visual Pin Control */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 32px 32px',
                    gridTemplateRows: '32px 32px 32px',
                    gap: '4px',
                    justifyContent: 'center',
                    marginBottom: '12px',
                }}>
                    {/* Top Row */}
                    <div />
                    <button
                        onClick={() => updateConstraints({ pinTop: !constraints.pinTop })}
                        style={pinButtonStyle(constraints.pinTop)}
                        title="Pin to top"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <div />

                    {/* Middle Row */}
                    <button
                        onClick={() => updateConstraints({ pinLeft: !constraints.pinLeft })}
                        style={pinButtonStyle(constraints.pinLeft)}
                        title="Pin to left"
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-bg-subtle)',
                        borderRadius: '4px',
                    }}>
                        <Pin size={12} color="#9ca3af" />
                    </div>
                    <button
                        onClick={() => updateConstraints({ pinRight: !constraints.pinRight })}
                        style={pinButtonStyle(constraints.pinRight)}
                        title="Pin to right"
                    >
                        <ArrowRight size={14} />
                    </button>

                    {/* Bottom Row */}
                    <div />
                    <button
                        onClick={() => updateConstraints({ pinBottom: !constraints.pinBottom })}
                        style={pinButtonStyle(constraints.pinBottom)}
                        title="Pin to bottom"
                    >
                        <ArrowDown size={14} />
                    </button>
                    <div />
                </div>

                {/* Pin Status */}
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    {[
                        constraints.pinTop && 'Top',
                        constraints.pinRight && 'Right',
                        constraints.pinBottom && 'Bottom',
                        constraints.pinLeft && 'Left',
                    ].filter(Boolean).join(', ') || 'No pins set'}
                </div>
            </div>

            {/* Margin Controls (show when anchor is set) */}
            {constraints.anchor && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>Margins from Anchor</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {constraints.pinTop && (
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Top</span>
                                <input
                                    type="number"
                                    value={constraints.marginTop ?? 0}
                                    onChange={(e) => updateConstraints({ marginTop: parseInt(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                    }}
                                />
                            </div>
                        )}
                        {constraints.pinRight && (
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Right</span>
                                <input
                                    type="number"
                                    value={constraints.marginRight ?? 0}
                                    onChange={(e) => updateConstraints({ marginRight: parseInt(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                    }}
                                />
                            </div>
                        )}
                        {constraints.pinBottom && (
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Bottom</span>
                                <input
                                    type="number"
                                    value={constraints.marginBottom ?? 0}
                                    onChange={(e) => updateConstraints({ marginBottom: parseInt(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                    }}
                                />
                            </div>
                        )}
                        {constraints.pinLeft && (
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Left</span>
                                <input
                                    type="number"
                                    value={constraints.marginLeft ?? 0}
                                    onChange={(e) => updateConstraints({ marginLeft: parseInt(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
