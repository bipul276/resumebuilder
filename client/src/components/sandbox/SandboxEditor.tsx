import React, { useEffect, useCallback, useRef, useState } from 'react';
import { SandboxCanvas } from './SandboxCanvas';
import { SandboxToolbar } from './SandboxToolbar';
import { SandboxProperties } from './SandboxProperties';
import { LayersPanel } from './LayersPanel';
import { ZoomControls } from './ZoomControls';
import { Rulers } from './Rulers';
import { StylesPanel } from './StylesPanel';
import { AssetsPanel } from './AssetsPanel';
import { SectionSemantics } from './SectionSemantics';
import { ComponentsPanel } from './ComponentsPanel';
import { ATSModePanel } from './ATSModePanel';
import { ContentAssistPanel } from './ContentAssistPanel';
import { JDMatchPanel } from './JDMatchPanel';
import { VersionsPanel } from './VersionsPanel';
import { InlineSuggestions } from './InlineSuggestions';
import { StartingPointsModal } from './StartingPointsModal';
import { SubscriptionTimer } from '../SubscriptionTimer';
import {
    ArrowLeft,
    Download,
    Undo,
    Redo,
    Grid,
    Ruler,
    Magnet,
    Layers,
    Palette,
    Package,
    FileText,
    Settings,
    Component,
    Shield,
    Lightbulb,
    Target,
    GitBranch,
    FilePlus,
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useStore } from 'zustand';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { useTier, UserTier } from '../../contexts/TierContext';

type LeftPanelTab = 'tools' | 'assets' | 'sections' | 'styles' | 'layers' | 'components' | 'ats' | 'assist' | 'target' | 'versions';

export function SandboxEditor() {
    const { undo, redo, pastStates, futureStates } = useStore(useSandboxStore.temporal, (state) => state);
    const {
        data,
        selectedIds,
        removeElement,
        duplicateElement,
        groupElements,
        ungroupElements,
        toggleGrid,
        toggleRulers,
        toggleSnapToGrid,
        alignElements,
        distributeElements,
        clearSelection,
    } = useSandboxStore();

    const tierCtx = useTier();

    const [isExporting, setIsExporting] = React.useState(false);
    const [leftTab, setLeftTab] = useState<LeftPanelTab>('tools');
    const canvasRef = useRef<HTMLDivElement>(null);

    // Show starting points modal when canvas is empty
    const [showStartingPoints, setShowStartingPoints] = useState(() => {
        return useSandboxStore.getState().data.elements.length === 0;
    });

    // Reset canvas and show starting points modal
    const handleNewResume = () => {
        if (!confirm('Start a new resume? This will clear your current work.')) return;

        // Clear all elements
        useSandboxStore.setState(state => ({
            data: {
                ...state.data,
                elements: [],
                currentVersionId: undefined,
            },
            selectedIds: [],
        }));

        // Show starting points modal
        setShowStartingPoints(true);
    };

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (isInputFocused) return;

        if (e.key === 'Delete' || e.key === 'Backspace') {
            selectedIds.forEach((id) => removeElement(id));
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                redo();
            } else {
                undo();
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            redo();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            selectedIds.forEach((id) => duplicateElement(id));
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            if (e.shiftKey) {
                const element = data.elements.find((el) => selectedIds.includes(el.id));
                if (element?.groupId) {
                    ungroupElements(element.groupId);
                }
            } else if (selectedIds.length >= 2) {
                groupElements(selectedIds);
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const currentPage = data.pages[data.currentPageIndex];
            const pageElementIds = data.elements
                .filter((el) => el.pageId === currentPage?.id)
                .map((el) => el.id);
            useSandboxStore.setState({ selectedIds: pageElementIds });
        }

        if (e.key === 'Escape') {
            clearSelection();
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedIds.length > 0) {
            e.preventDefault();
            const nudgeAmount = e.shiftKey ? 10 : 1;
            const direction = {
                ArrowUp: { top: -nudgeAmount },
                ArrowDown: { top: nudgeAmount },
                ArrowLeft: { left: -nudgeAmount },
                ArrowRight: { left: nudgeAmount },
            }[e.key];

            if (direction) {
                selectedIds.forEach((id) => {
                    const element = data.elements.find((el) => el.id === id);
                    if (element && !element.locked) {
                        useSandboxStore.getState().updateElementStyle(id, {
                            left: element.style.left + (direction.left || 0),
                            top: element.style.top + (direction.top || 0),
                        });
                    }
                });
            }
        }
    }, [selectedIds, undo, redo, removeElement, duplicateElement, groupElements, ungroupElements, clearSelection, data]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Track view on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`${import.meta.env.VITE_API_URL || ''}/api/analytics/track`, {
                event_type: 'view',
                metadata: { page: 'sandbox', source: 'sandbox_editor' }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => console.error('Failed to track view:', err));
        }
    }, []);

    const [showExportMenu, setShowExportMenu] = useState(false);
    const [customWatermark, setCustomWatermark] = useState('');
    const [watermarkStyle, setWatermarkStyle] = useState<'tiled' | 'corner'>('tiled');

    const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
        try {
            setIsExporting(true);
            setShowExportMenu(false);

            const API_URL = import.meta.env.VITE_API_URL || '';
            const endpoints = {
                pdf: `${API_URL}/api/generate-sandbox-pdf`,
                docx: `${API_URL}/api/generate-sandbox-docx`,
                txt: `${API_URL}/api/generate-sandbox-text`,
            };

            // Include isPro flag, custom watermark, and style for watermark control
            const exportData = {
                ...data,
                isPro: tierCtx.isPro,
                customWatermark: tierCtx.tier === 'pro_plus' && customWatermark.trim() ? customWatermark.trim() : undefined,
                watermarkStyle: tierCtx.tier === 'pro_plus' ? watermarkStyle : 'tiled',
            };

            const token = localStorage.getItem('token');
            const response = await fetch(endpoints[format], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(exportData),
            });

            if (!response.ok) throw new Error(`Failed to generate ${format.toUpperCase()}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sandbox_resume.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Track download
            // token is already declared above
            if (token) {
                axios.post(`${import.meta.env.VITE_API_URL || ''}/api/analytics/track`, {
                    event_type: 'download',
                    metadata: { format, source: 'sandbox' }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => console.error('Failed to track download:', err));
            }

        } catch (error) {
            console.error('Export failed:', error);
            alert(`Failed to export ${format.toUpperCase()}`);
        } finally {
            setIsExporting(false);
        }
    };

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        border: 'none',
        background: 'transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
    };

    const activeButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: 'var(--color-bg-input)',
        color: 'var(--color-primary)',
    };

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 8px',
        cursor: 'pointer',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        backgroundColor: isActive ? 'var(--color-bg-input)' : 'transparent',
        borderRight: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
        transition: 'all 0.15s',
    });

    const TABS: { id: LeftPanelTab; icon: typeof Package; label: string }[] = [
        { id: 'tools', icon: Settings, label: 'Tools' },
        { id: 'assets', icon: Package, label: 'Assets' },
        { id: 'sections', icon: FileText, label: 'Sections' },
        { id: 'styles', icon: Palette, label: 'Styles' },
        { id: 'components', icon: Component, label: 'Components' },
        { id: 'layers', icon: Layers, label: 'Layers' },
        { id: 'ats', icon: Shield, label: 'ATS Mode' },
        { id: 'assist', icon: Lightbulb, label: 'Assist' },
        { id: 'target', icon: Target, label: 'Target' },
        { id: 'versions', icon: GitBranch, label: 'Versions' },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <div
                style={{
                    height: '56px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-bg-elevated)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/" style={{ ...buttonStyle, textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>Resume Sandbox</h1>
                    <span
                        style={{
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: tierCtx.tier === 'free' ? 'rgba(253, 230, 138, 0.1)' : tierCtx.tier === 'pro' ? 'rgba(187, 247, 208, 0.1)' : 'rgba(221, 214, 254, 0.1)',
                            color: tierCtx.tier === 'free' ? '#fcd34d' : tierCtx.tier === 'pro' ? '#4ade80' : '#a78bfa',
                            fontWeight: 500,
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        {tierCtx.tier === 'free' ? 'Free' : tierCtx.tier === 'pro' ? 'Pro' : 'Pro+'}
                    </span>
                    <SubscriptionTimer />

                    <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 8px' }} />

                    <button
                        onClick={handleNewResume}
                        style={{
                            ...buttonStyle,
                            width: 'auto',
                            padding: '6px 12px',
                            gap: '6px',
                            fontSize: '12px',
                            color: 'var(--color-text-secondary)',
                        }}
                        title="Start New Resume"
                    >
                        <FilePlus size={16} />
                        New
                    </button>

                    <button
                        onClick={() => undo()}
                        disabled={pastStates.length === 0}
                        style={{ ...buttonStyle, opacity: pastStates.length === 0 ? 0.4 : 1 }}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        onClick={() => redo()}
                        disabled={futureStates.length === 0}
                        style={{ ...buttonStyle, opacity: futureStates.length === 0 ? 0.4 : 1 }}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo size={18} />
                    </button>

                    <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 8px' }} />

                    <button
                        onClick={toggleGrid}
                        style={data.gridEnabled ? activeButtonStyle : buttonStyle}
                        title="Toggle Grid"
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={toggleRulers}
                        style={data.showRulers ? activeButtonStyle : buttonStyle}
                        title="Toggle Rulers"
                    >
                        <Ruler size={18} />
                    </button>
                    <button
                        onClick={toggleSnapToGrid}
                        style={data.snapToGrid ? activeButtonStyle : buttonStyle}
                        title="Snap to Grid"
                    >
                        <Magnet size={18} />
                    </button>
                </div>

                {selectedIds.length >= 2 && (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginRight: '8px' }}>Align:</span>
                        {(['left', 'center', 'right', 'top', 'middle', 'bottom'] as const).map((align) => (
                            <button
                                key={align}
                                onClick={() => alignElements(align)}
                                style={{
                                    ...buttonStyle,
                                    width: '28px',
                                    height: '28px',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                }}
                                title={`Align ${align}`}
                            >
                                {align.charAt(0).toUpperCase()}
                            </button>
                        ))}
                        <div style={{ width: '1px', height: '20px', background: 'var(--color-border)', margin: '0 4px' }} />
                        <button
                            onClick={() => distributeElements('horizontal')}
                            style={{ ...buttonStyle, width: '28px', height: '28px', fontSize: '9px' }}
                            title="Distribute Horizontally"
                        >
                            ⇔
                        </button>
                        <button
                            onClick={() => distributeElements('vertical')}
                            style={{ ...buttonStyle, width: '28px', height: '28px', fontSize: '9px' }}
                            title="Distribute Vertically"
                        >
                            ⇕
                        </button>
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={isExporting}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 500,
                            fontSize: '14px',
                            cursor: isExporting ? 'not-allowed' : 'pointer',
                            opacity: isExporting ? 0.7 : 1,
                        }}
                    >
                        <Download size={16} />
                        {isExporting ? 'Exporting...' : 'Export ▾'}
                    </button>

                    {showExportMenu && !isExporting && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '4px',
                            backgroundColor: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            minWidth: '200px',
                            zIndex: 100,
                            overflow: 'hidden',
                        }}>
                            {/* Watermark Status Banner */}
                            <div style={{
                                padding: '10px 12px',
                                borderBottom: '1px solid var(--color-border)',
                                backgroundColor: tierCtx.tier === 'free' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            }}>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: tierCtx.tier === 'free' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                                    {tierCtx.tier === 'free' ? '🔒 Free Tier' : tierCtx.tier === 'pro' ? '✓ Pro' : '✓ Pro+'}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                    {tierCtx.tier === 'free'
                                        ? 'Watermark: "Created with Resume Sandbox"'
                                        : tierCtx.tier === 'pro_plus' && customWatermark.trim()
                                            ? `Custom: "${customWatermark.trim()}"`
                                            : 'No watermark on exports'}
                                </div>
                            </div>

                            {/* Custom Watermark Input for Pro+ */}
                            {tierCtx.tier === 'pro_plus' && (
                                <div style={{
                                    padding: '10px 12px',
                                    borderBottom: '1px solid var(--color-border)',
                                    backgroundColor: 'rgba(124, 58, 237, 0.05)',
                                }}>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#a78bfa', marginBottom: '6px' }}>
                                        ✨ Custom Watermark (Pro+ Feature)
                                    </div>
                                    <input
                                        type="text"
                                        value={customWatermark}
                                        onChange={(e) => setCustomWatermark(e.target.value)}
                                        placeholder="e.g. Confidential, yourname.com"
                                        style={{
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            outline: 'none',
                                            backgroundColor: 'var(--color-bg-input)',
                                            color: 'var(--color-text)',
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    {/* Watermark Style Toggle */}
                                    <div style={{ marginTop: '8px' }}>
                                        <div style={{ fontSize: '9px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Style:</div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setWatermarkStyle('tiled'); }}
                                                style={{
                                                    flex: 1,
                                                    padding: '5px 8px',
                                                    border: watermarkStyle === 'tiled' ? '2px solid #7c3aed' : '1px solid var(--color-border)',
                                                    borderRadius: '4px',
                                                    background: watermarkStyle === 'tiled' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                                                    cursor: 'pointer',
                                                    fontSize: '9px',
                                                    fontWeight: watermarkStyle === 'tiled' ? 600 : 400,
                                                    color: watermarkStyle === 'tiled' ? '#a78bfa' : 'var(--color-text-secondary)',
                                                }}
                                            >
                                                🔄 Tiled (Repeated)
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setWatermarkStyle('corner'); }}
                                                style={{
                                                    flex: 1,
                                                    padding: '5px 8px',
                                                    border: watermarkStyle === 'corner' ? '2px solid #7c3aed' : '1px solid var(--color-border)',
                                                    borderRadius: '4px',
                                                    background: watermarkStyle === 'corner' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                                                    cursor: 'pointer',
                                                    fontSize: '9px',
                                                    fontWeight: watermarkStyle === 'corner' ? 600 : 400,
                                                    color: watermarkStyle === 'corner' ? '#a78bfa' : 'var(--color-text-secondary)',
                                                }}
                                            >
                                                📍 Corner
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                                        Leave empty for no watermark
                                    </div>
                                </div>
                            )}

                            {[
                                { format: 'pdf', label: 'PDF', icon: '📄', desc: tierCtx.tier === 'free' ? 'With watermark' : 'No watermark' },
                                { format: 'docx', label: 'Word (DOCX)', icon: '📝', desc: 'Editable format' },
                                { format: 'txt', label: 'Plain Text', icon: '📋', desc: 'ATS-friendly' },
                            ].map(({ format, label, icon, desc }) => (
                                <button
                                    key={format}
                                    onClick={() => handleExport(format as 'pdf' | 'docx' | 'txt')}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        borderBottom: format !== 'txt' ? '1px solid var(--color-border)' : 'none',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-input)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <span style={{ fontSize: '16px' }}>{icon}</span>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{label}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{desc}</div>
                                    </div>
                                </button>
                            ))}

                            {/* Upgrade prompt for free users */}
                            {tierCtx.tier === 'free' && (
                                <div style={{
                                    padding: '10px 12px',
                                    borderTop: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-panel)',
                                }}>
                                    <button
                                        onClick={() => {
                                            tierCtx.setTier('pro');
                                            setShowExportMenu(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ⚡ Upgrade to Pro — Remove Watermark
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left sidebar tabs */}
                <div
                    style={{
                        width: '64px',
                        borderRight: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-elevated)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {TABS.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => setLeftTab(tab.id)}
                            style={tabStyle(leftTab === tab.id)}
                            onMouseEnter={(e) => {
                                if (leftTab !== tab.id) {
                                    e.currentTarget.style.backgroundColor = 'var(--color-bg-input)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (leftTab !== tab.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <tab.icon size={20} />
                            <span style={{ fontSize: '9px', fontWeight: 500 }}>{tab.label}</span>
                        </div>
                    ))}
                </div>

                {/* Left panel content */}
                <div
                    style={{
                        width: '260px',
                        borderRight: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-elevated)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {leftTab === 'tools' && <SandboxToolbar />}
                        {leftTab === 'assets' && <AssetsPanel />}
                        {leftTab === 'sections' && <SectionSemantics />}
                        {leftTab === 'styles' && <StylesPanel />}
                        {leftTab === 'components' && <ComponentsPanel />}
                        {leftTab === 'layers' && <LayersPanel />}
                        {leftTab === 'ats' && <ATSModePanel />}
                        {leftTab === 'assist' && <ContentAssistPanel />}
                        {leftTab === 'target' && <JDMatchPanel />}
                        {leftTab === 'versions' && <VersionsPanel />}
                    </div>
                </div>

                {/* Center: Canvas */}
                <div ref={canvasRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {data.showRulers && <Rulers canvasRef={canvasRef} />}
                    <div
                        style={{
                            position: 'absolute',
                            top: data.showRulers ? '24px' : 0,
                            left: data.showRulers ? '24px' : 0,
                            right: 0,
                            bottom: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <SandboxCanvas />
                    </div>
                    <ZoomControls />
                    <InlineSuggestions />
                </div>

                {/* Right: Properties */}
                <div
                    style={{
                        width: '280px',
                        borderLeft: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-elevated)',
                        padding: '20px',
                        overflowY: 'auto',
                    }}
                >
                    <SandboxProperties />
                </div>
            </div>

            {/* Starting Points Modal */}
            <StartingPointsModal
                isOpen={showStartingPoints}
                onClose={() => setShowStartingPoints(false)}
            />
        </div>
    );
}
