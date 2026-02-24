import { useSandboxStore } from '../../stores/useSandboxStore';
import { Trash2, Copy, Lock, Unlock, Eye, EyeOff, Type, RotateCcw } from 'lucide-react';
import { ConstraintsPanel } from './ConstraintsPanel';

export function SandboxProperties() {
    const {
        data,
        selectedIds,
        updateElement,
        updateElementStyle,
        removeElement,
        duplicateElement,
        toggleLock,
        toggleVisibility,
        bringToFront,
        sendToBack,
    } = useSandboxStore();

    const selectedElement = data.elements.find((el) => selectedIds.includes(el.id));

    if (!selectedElement) {
        return (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 20px' }}>
                <Type size={32} strokeWidth={1.5} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
                <p style={{ margin: 0 }}>Select an element to edit its properties</p>
            </div>
        );
    }

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        fontSize: '13px',
        outline: 'none',
        transition: 'border-color 0.15s',
        backgroundColor: 'var(--color-bg-input)',
        color: 'var(--color-text)',
    };

    const groupStyle: React.CSSProperties = {
        marginBottom: '16px',
    };

    const rowStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                    Properties
                </h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => toggleLock(selectedElement.id)}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            background: selectedElement.locked ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: selectedElement.locked ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title={selectedElement.locked ? 'Unlock' : 'Lock'}
                    >
                        {selectedElement.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    <button
                        onClick={() => toggleVisibility(selectedElement.id)}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            background: !selectedElement.visible ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: !selectedElement.visible ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title={selectedElement.visible ? 'Hide' : 'Show'}
                    >
                        {selectedElement.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                </div>
            </div>

            {/* Name */}
            <div style={groupStyle}>
                <label style={labelStyle}>Layer Name</label>
                <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                    style={inputStyle}
                />
            </div>

            {/* Content (for text elements) */}
            {selectedElement.type === 'text' && (
                <div style={groupStyle}>
                    <label style={labelStyle}>Content</label>
                    <textarea
                        value={selectedElement.content}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    />
                </div>
            )}

            {/* Position */}
            <div style={groupStyle}>
                <label style={labelStyle}>Position</label>
                <div style={rowStyle}>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>X</span>
                        <input
                            type="number"
                            value={Math.round(selectedElement.style.left)}
                            onChange={(e) => updateElementStyle(selectedElement.id, { left: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Y</span>
                        <input
                            type="number"
                            value={Math.round(selectedElement.style.top)}
                            onChange={(e) => updateElementStyle(selectedElement.id, { top: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Size */}
            <div style={groupStyle}>
                <label style={labelStyle}>Size</label>
                <div style={rowStyle}>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>W</span>
                        <input
                            type="number"
                            value={Math.round(selectedElement.style.width)}
                            onChange={(e) => updateElementStyle(selectedElement.id, { width: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>H</span>
                        <input
                            type="number"
                            value={Math.round(selectedElement.style.height)}
                            onChange={(e) => updateElementStyle(selectedElement.id, { height: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Constraints */}
            <ConstraintsPanel />

            {/* Typography (for text elements) */}
            {selectedElement.type === 'text' && (
                <>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Typography</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <select
                                value={selectedElement.style.fontFamily || 'Inter'}
                                onChange={(e) => updateElementStyle(selectedElement.id, { fontFamily: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="Inter">Inter</option>
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Roboto">Roboto</option>
                            </select>
                            <div style={rowStyle}>
                                <div>
                                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Size</span>
                                    <input
                                        type="number"
                                        value={selectedElement.style.fontSize || 14}
                                        onChange={(e) => updateElementStyle(selectedElement.id, { fontSize: parseInt(e.target.value) || 14 })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Weight</span>
                                    <select
                                        value={selectedElement.style.fontWeight || '400'}
                                        onChange={(e) => updateElementStyle(selectedElement.id, { fontWeight: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="300">Light</option>
                                        <option value="400">Regular</option>
                                        <option value="500">Medium</option>
                                        <option value="600">Semibold</option>
                                        <option value="700">Bold</option>
                                    </select>
                                </div>
                            </div>
                            <div style={rowStyle}>
                                <div>
                                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Line Height</span>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={selectedElement.style.lineHeight || 1.5}
                                        onChange={(e) => updateElementStyle(selectedElement.id, { lineHeight: parseFloat(e.target.value) || 1.5 })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Letter Spacing</span>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={selectedElement.style.letterSpacing || 0}
                                        onChange={(e) => updateElementStyle(selectedElement.id, { letterSpacing: parseFloat(e.target.value) || 0 })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Alignment</span>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                    {(['left', 'center', 'right'] as const).map((align) => (
                                        <button
                                            key={align}
                                            onClick={() => updateElementStyle(selectedElement.id, { textAlign: align })}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                border: '1px solid',
                                                borderColor: selectedElement.style.textAlign === align ? '#2563eb' : '#e5e7eb',
                                                borderRadius: '4px',
                                                background: selectedElement.style.textAlign === align ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: selectedElement.style.textAlign === align ? '#2563eb' : '#6b7280',
                                            }}
                                        >
                                            {align.charAt(0).toUpperCase() + align.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Graphic Properties */}
            {(selectedElement.type === 'skillbar' || selectedElement.type === 'progress_ring') && (
                <div style={groupStyle}>
                    <label style={labelStyle}>Progress Level</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={selectedElement.props?.level || 0}
                            onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, level: parseInt(e.target.value) } })}
                            style={{ flex: 1, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--color-text)', width: '32px', textAlign: 'right' }}>
                            {selectedElement.props?.level || 0}%
                        </span>
                    </div>
                </div>
            )}

            {selectedElement.type === 'rating_dots' && (
                <div style={groupStyle}>
                    <label style={labelStyle}>Rating</label>
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Level</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="range"
                                min="0"
                                max={selectedElement.props?.maxDots || 5}
                                step="1"
                                value={selectedElement.props?.level || 0}
                                onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, level: parseInt(e.target.value) } })}
                                style={{ flex: 1, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--color-text)', width: '20px', textAlign: 'right' }}>
                                {selectedElement.props?.level || 0}
                            </span>
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Max Dots</span>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={selectedElement.props?.maxDots || 5}
                            onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, maxDots: parseInt(e.target.value) } })}
                            style={inputStyle}
                        />
                    </div>
                </div>
            )}

            {selectedElement.type === 'timeline' && (
                <div style={groupStyle}>
                    <label style={labelStyle}>Timeline</label>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Steps</span>
                        <input
                            type="number"
                            min="2"
                            max="20"
                            value={selectedElement.props?.steps || 3}
                            onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, steps: parseInt(e.target.value) } })}
                            style={inputStyle}
                        />
                    </div>
                </div>
            )}

            {/* Container Properties */}
            {selectedElement.type === 'container' && (
                <div style={groupStyle}>
                    <label style={labelStyle}>Layout</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Direction */}
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Direction</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                    onClick={() => updateElement(selectedElement.id, { props: { ...selectedElement.props, direction: 'row' } })}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        border: '1px solid',
                                        borderColor: selectedElement.props?.direction === 'row' ? 'var(--color-primary)' : 'var(--color-border)',
                                        borderRadius: '4px',
                                        background: selectedElement.props?.direction === 'row' ? 'var(--color-bg-input)' : 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        color: selectedElement.props?.direction === 'row' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    }}
                                >
                                    Horizontal
                                </button>
                                <button
                                    onClick={() => updateElement(selectedElement.id, { props: { ...selectedElement.props, direction: 'column' } })}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        border: '1px solid',
                                        borderColor: selectedElement.props?.direction === 'column' ? 'var(--color-primary)' : 'var(--color-border)',
                                        borderRadius: '4px',
                                        background: selectedElement.props?.direction === 'column' ? 'var(--color-bg-input)' : 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        color: selectedElement.props?.direction === 'column' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    }}
                                >
                                    Vertical
                                </button>
                            </div>
                        </div>

                        {/* Spacing */}
                        <div style={rowStyle}>
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Gap</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={selectedElement.props?.gap ?? 16}
                                    onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, gap: parseInt(e.target.value) || 0 } })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Padding</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={selectedElement.props?.padding ?? 16}
                                    onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, padding: parseInt(e.target.value) || 0 } })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Alignment */}
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Align Items</span>
                            <select
                                value={selectedElement.props?.alignItems || 'stretch'}
                                onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, alignItems: e.target.value as 'flex-start' | 'center' | 'flex-end' | 'stretch' } })}
                                style={inputStyle}
                            >
                                <option value="flex-start">Start</option>
                                <option value="center">Center</option>
                                <option value="flex-end">End</option>
                                <option value="stretch">Stretch</option>
                            </select>
                        </div>

                        {/* Justify */}
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Justify Content</span>
                            <select
                                value={selectedElement.props?.justifyContent || 'flex-start'}
                                onChange={(e) => updateElement(selectedElement.id, { props: { ...selectedElement.props, justifyContent: e.target.value as 'flex-start' | 'center' | 'flex-end' | 'space-between' } })}
                                style={inputStyle}
                            >
                                <option value="flex-start">Start</option>
                                <option value="center">Center</option>
                                <option value="flex-end">End</option>
                                <option value="space-between">Space Between</option>
                                <option value="space-around">Space Around</option>
                            </select>
                        </div>

                        {/* Sizing Modes */}
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>SIZING</span>

                            {/* Height Mode */}
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Height</span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {(['fixed', 'auto', 'hug'] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => updateElement(selectedElement.id, { props: { ...selectedElement.props, heightMode: mode } })}
                                            style={{
                                                flex: 1,
                                                padding: '4px 6px',
                                                border: '1px solid',
                                                borderColor: (selectedElement.props?.heightMode || 'fixed') === mode ? '#2563eb' : '#e5e7eb',
                                                borderRadius: '4px',
                                                background: (selectedElement.props?.heightMode || 'fixed') === mode ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                color: (selectedElement.props?.heightMode || 'fixed') === mode ? '#2563eb' : '#6b7280',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Width Mode */}
                            <div>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Width</span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {(['fixed', 'auto', 'fill'] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => updateElement(selectedElement.id, { props: { ...selectedElement.props, widthMode: mode } })}
                                            style={{
                                                flex: 1,
                                                padding: '4px 6px',
                                                border: '1px solid',
                                                borderColor: (selectedElement.props?.widthMode || 'fixed') === mode ? '#2563eb' : '#e5e7eb',
                                                borderRadius: '4px',
                                                background: (selectedElement.props?.widthMode || 'fixed') === mode ? '#eff6ff' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                color: (selectedElement.props?.widthMode || 'fixed') === mode ? '#2563eb' : '#6b7280',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Colors */}
            <div style={groupStyle}>
                <label style={labelStyle}>Colors</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={selectedElement.style.color || '#000000'}
                            onChange={(e) => updateElementStyle(selectedElement.id, { color: e.target.value })}
                            style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Color</span>
                            <input
                                type="text"
                                value={selectedElement.style.color || '#000000'}
                                onChange={(e) => updateElementStyle(selectedElement.id, { color: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={selectedElement.style.backgroundColor || '#ffffff'}
                            onChange={(e) => updateElementStyle(selectedElement.id, { backgroundColor: e.target.value })}
                            style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Background</span>
                            <input
                                type="text"
                                value={selectedElement.style.backgroundColor || ''}
                                onChange={(e) => updateElementStyle(selectedElement.id, { backgroundColor: e.target.value })}
                                placeholder="transparent"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Border */}
            <div style={groupStyle}>
                <label style={labelStyle}>Border</label>
                <div style={rowStyle}>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Width</span>
                        <input
                            type="number"
                            value={selectedElement.style.borderWidth || 0}
                            onChange={(e) => updateElementStyle(selectedElement.id, { borderWidth: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Radius</span>
                        <input
                            type="number"
                            value={selectedElement.style.borderRadius || 0}
                            onChange={(e) => updateElementStyle(selectedElement.id, { borderRadius: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                        />
                    </div>
                </div>
                {(selectedElement.style.borderWidth || 0) > 0 && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                        <input
                            type="color"
                            value={selectedElement.style.borderColor || '#000000'}
                            onChange={(e) => updateElementStyle(selectedElement.id, { borderColor: e.target.value })}
                            style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                            type="text"
                            value={selectedElement.style.borderColor || '#000000'}
                            onChange={(e) => updateElementStyle(selectedElement.id, { borderColor: e.target.value })}
                            style={{ ...inputStyle, flex: 1 }}
                        />
                    </div>
                )}
            </div>

            {/* Opacity */}
            <div style={groupStyle}>
                <label style={labelStyle}>Opacity: {Math.round((selectedElement.style.opacity ?? 1) * 100)}%</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedElement.style.opacity ?? 1}
                    onChange={(e) => updateElementStyle(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
            </div>

            {/* Layer Order */}
            <div style={groupStyle}>
                <label style={labelStyle}>Layer Order</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => bringToFront(selectedElement.id)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-input)',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                        }}
                    >
                        To Front
                    </button>
                    <button
                        onClick={() => sendToBack(selectedElement.id)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: 'var(--color-bg-input)',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                        }}
                    >
                        To Back
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <button
                    onClick={() => duplicateElement(selectedElement.id)}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        background: 'var(--color-bg-input)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                    }}
                >
                    <Copy size={14} /> Duplicate
                </button>
                <button
                    onClick={() => removeElement(selectedElement.id)}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        border: '1px solid var(--color-error-border)',
                        borderRadius: '6px',
                        background: 'var(--color-error-bg)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--color-error-text)',
                    }}
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        </div>
    );
}
