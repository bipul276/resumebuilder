import { Rnd } from 'react-rnd';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { SandboxElement } from '@resumebuilder/shared';
import * as LucideIcons from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DraggableElementProps {
    element: SandboxElement;
    zoom: number;
}

export function DraggableElement({ element, zoom }: DraggableElementProps) {
    const {
        updateElementStyle,
        updateElement,
        selectElement,
        addToSelection,
        selectedIds,
        data,
    } = useSandboxStore();

    const { gridEnabled, gridSize, snapToGrid } = data;
    const isSelected = selectedIds.includes(element.id);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(element.content);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Handle double-click to edit text
    const handleDoubleClick = () => {
        if (element.type === 'text' && !element.locked) {
            setIsEditing(true);
            setEditContent(element.content);
        }
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleFinishEdit = () => {
        if (editContent.trim() !== element.content) {
            updateElement(element.id, { content: editContent });
        }
        setIsEditing(false);
    };

    // Don't render if not visible
    if (!element.visible) return null;

    // Get icon component
    const IconComponent = element.type === 'icon' ? (LucideIcons as any)[element.content] : null;

    // Calculate grid snap
    const gridSnap: [number, number] = snapToGrid && gridEnabled
        ? [gridSize * zoom, gridSize * zoom]
        : [1, 1];

    // Render divider
    const renderDivider = () => (
        <div
            style={{
                width: '100%',
                height: element.style.borderWidth || 2,
                backgroundColor: element.style.color || '#e5e7eb',
                borderRadius: element.style.borderRadius || 0,
            }}
        />
    );

    // Render skill bar
    const renderSkillBar = () => {
        const level = element.props?.level || 75;
        const isSmall = element.style.height < 32;

        return (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {element.content && (
                    <span style={{
                        fontSize: element.style.fontSize || 12,
                        color: element.style.color,
                        marginBottom: isSmall ? 0 : '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        zIndex: 1
                    }}>
                        {element.content}
                    </span>
                )}
                <div
                    style={{
                        height: isSmall ? '6px' : '8px',
                        width: '100%',
                        backgroundColor: '#e5e7eb',
                        borderRadius: element.style.borderRadius || 4,
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: isSmall ? 'absolute' : 'relative',
                        bottom: isSmall ? 0 : 'auto',
                        marginTop: isSmall ? 0 : 'auto',
                    }}
                >
                    <div
                        style={{
                            width: `${level}%`,
                            height: '100%',
                            backgroundColor: element.style.backgroundColor || '#2563eb',
                            transition: 'width 0.3s ease',
                        }}
                    />
                </div>
            </div>
        );
    };

    // Render rating dots
    const renderRatingDots = () => {
        const level = element.props?.level || 4;
        const maxDots = element.props?.maxDots || 5;
        const dotSize = Math.min(element.style.width / (maxDots * 1.5), element.style.height * 0.8) * zoom;
        const activeColor = element.style.backgroundColor || '#2563eb';

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * zoom}px`, width: '100%', height: '100%', justifyContent: 'center' }}>
                {Array.from({ length: maxDots }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: `${dotSize}px`,
                            height: `${dotSize}px`,
                            borderRadius: '50%',
                            backgroundColor: i < level ? activeColor : '#e5e7eb',
                            transition: 'background-color 0.2s ease',
                        }}
                    />
                ))}
            </div>
        );
    };

    // Render progress ring
    const renderProgressRing = () => {
        const level = element.props?.level || 75;
        const size = Math.min(element.style.width, element.style.height) * zoom;
        const strokeWidth = size * 0.12;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (level / 100) * circumference;
        const activeColor = element.style.backgroundColor || '#2563eb';

        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={activeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                    />
                </svg>
                <span
                    style={{
                        position: 'absolute',
                        fontSize: `${size * 0.25}px`,
                        fontWeight: 600,
                        color: element.style.color || '#374151',
                    }}
                >
                    {level}%
                </span>
            </div>
        );
    };

    // Render timeline
    const renderTimeline = () => {
        const steps = element.props?.steps || 3;
        const markerSize = 12 * zoom;
        const lineWidth = 2 * zoom;
        const color = element.style.backgroundColor || '#2563eb';

        return (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    top: markerSize / 2,
                    bottom: markerSize / 2,
                    width: lineWidth,
                    backgroundColor: color,
                    opacity: 0.5
                }} />

                {/* Dots */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    zIndex: 1
                }}>
                    {Array.from({ length: steps }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: markerSize,
                                height: markerSize,
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: `2px solid #fff`,
                                boxSizing: 'border-box'
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // Render tag cloud
    const renderTagCloud = () => {
        const tags = element.props?.tags || ['Skill 1', 'Skill 2', 'Skill 3'];
        const colors = element.props?.colors || ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706'];

        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: `${6 * zoom}px`,
                padding: `${4 * zoom}px`,
                width: '100%',
                height: '100%',
                alignContent: 'flex-start',
            }}>
                {tags.map((tag: string, i: number) => (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            padding: `${4 * zoom}px ${10 * zoom}px`,
                            borderRadius: `${12 * zoom}px`,
                            backgroundColor: colors[i % colors.length] + '20',
                            color: colors[i % colors.length],
                            fontSize: `${11 * zoom}px`,
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        );
    };

    // Render icon list
    const renderIconList = () => {
        const items = element.props?.items || [
            { icon: 'Mail', label: 'email@example.com' },
            { icon: 'Phone', label: '(555) 123-4567' },
        ];
        const layout = element.props?.layout || 'vertical';
        const iconColor = element.style.backgroundColor || '#6b7280';

        return (
            <div style={{
                display: 'flex',
                flexDirection: layout === 'vertical' ? 'column' : 'row',
                gap: `${8 * zoom}px`,
                padding: `${4 * zoom}px`,
                width: '100%',
                height: '100%',
            }}>
                {items.map((item: { icon: string; label: string }, i: number) => {
                    const ItemIcon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
                    return (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: `${6 * zoom}px`,
                            }}
                        >
                            <ItemIcon size={14 * zoom} color={iconColor} />
                            <span style={{
                                fontSize: `${11 * zoom}px`,
                                color: element.style.color || '#374151',
                            }}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Render metrics
    const renderMetrics = () => {
        const items = element.props?.items || [
            { label: 'YOE', value: '5+', unit: 'years' },
            { label: 'Projects', value: '20+', unit: '' },
        ];
        const accentColor = element.style.backgroundColor || '#2563eb';

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                gap: `${16 * zoom}px`,
            }}>
                {items.map((item: { label: string; value: string; unit: string }, i: number) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <span style={{
                            fontSize: `${22 * zoom}px`,
                            fontWeight: 700,
                            color: accentColor,
                            lineHeight: 1,
                        }}>
                            {item.value}
                        </span>
                        <span style={{
                            fontSize: `${9 * zoom}px`,
                            color: element.style.color || '#6b7280',
                            marginTop: `${2 * zoom}px`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>
                            {item.unit || item.label}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    // Render container
    const renderContainer = () => {
        const children = data.elements.filter(el => el.parentId === element.id);
        const {
            direction = 'column',
            gap = 16,
            padding = 16,
            alignItems = 'stretch',
            justifyContent = 'flex-start',
            heightMode = 'fixed',
            widthMode = 'fixed',
            minHeight,
            maxHeight,
            minWidth,
            maxWidth
        } = element.props || {};

        // Calculate container styles based on sizing modes
        const containerStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: direction as any,
            gap: `${gap * zoom}px`,
            padding: `${padding * zoom}px`,
            alignItems,
            justifyContent,
            boxSizing: 'border-box',
            overflow: heightMode === 'fixed' ? 'hidden' : 'visible',
            // Width handling
            width: widthMode === 'fill' ? '100%' : widthMode === 'auto' ? 'auto' : '100%',
            minWidth: minWidth ? `${minWidth * zoom}px` : undefined,
            maxWidth: maxWidth ? `${maxWidth * zoom}px` : undefined,
            // Height handling
            height: heightMode === 'hug' ? 'auto' : heightMode === 'auto' ? 'auto' : '100%',
            minHeight: minHeight ? `${minHeight * zoom}px` : undefined,
            maxHeight: maxHeight ? `${maxHeight * zoom}px` : undefined,
        };

        return (
            <div style={containerStyle}>
                {children.length === 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: 12 * zoom,
                        padding: 16 * zoom,
                        border: `1px dashed #d1d5db`,
                        borderRadius: 4,
                        width: '100%',
                        minHeight: 60 * zoom,
                    }}>
                        Drop elements here
                    </div>
                )}
                {children.map(child => (
                    <DraggableElement key={child.id} element={child} zoom={zoom} />
                ))}
            </div>
        );
    };

    const renderContent = () => {
        switch (element.type) {
            case 'image':
                return (
                    <img
                        src={element.content}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                    />
                );
            case 'icon':
                return IconComponent ? (
                    <IconComponent
                        size={Math.min(element.style.width, element.style.height) * 0.8 * zoom}
                        color={element.style.color}
                        strokeWidth={element.style.fontWeight === 'bold' ? 3 : 2}
                    />
                ) : (
                    <span style={{ color: element.style.color }}>{element.content}</span>
                );
            case 'divider':
                return renderDivider();
            case 'skillbar':
                return renderSkillBar();
            case 'rating_dots':
                return renderRatingDots();
            case 'progress_ring':
                return renderProgressRing();
            case 'timeline':
                return renderTimeline();
            case 'container':
                return renderContainer();
            case 'tag_cloud':
                return renderTagCloud();
            case 'icon_list':
                return renderIconList();
            case 'metrics':
                return renderMetrics();
            case 'text':
                if (isEditing) {
                    return (
                        <textarea
                            ref={inputRef}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onBlur={handleFinishEdit}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setEditContent(element.content);
                                    setIsEditing(false);
                                }
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleFinishEdit();
                                }
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: element.style.fontFamily,
                                fontSize: (element.style.fontSize || 14) * zoom,
                                fontWeight: element.style.fontWeight,
                                textAlign: element.style.textAlign,
                                color: element.style.color,
                                backgroundColor: 'transparent',
                                lineHeight: element.style.lineHeight || 1.5,
                                letterSpacing: element.style.letterSpacing || 0,
                            }}
                        />
                    );
                }
                return (
                    <div
                        onDoubleClick={handleDoubleClick}
                        style={{
                            width: '100%',
                            height: '100%',
                            fontFamily: element.style.fontFamily,
                            fontSize: (element.style.fontSize || 14) * zoom,
                            fontWeight: element.style.fontWeight,
                            textAlign: element.style.textAlign,
                            color: element.style.color,
                            lineHeight: element.style.lineHeight || 1.5,
                            letterSpacing: element.style.letterSpacing || 0,
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            cursor: element.locked ? 'default' : 'text',
                        }}
                    >
                        {element.content}
                    </div>
                );
            default:
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#9ca3af', fontSize: 12 }}>
                        {element.type}
                    </div>
                );
        }
    };

    // If element is a child of a container, render as static div (controlled by parent layout)
    if (element.parentId) {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (!element.locked) {
                        if (e.shiftKey) {
                            addToSelection(element.id);
                        } else {
                            selectElement(element.id);
                        }
                    }
                }}
                style={{
                    width: element.style.width ? `${element.style.width * zoom}px` : 'auto',
                    height: element.style.height ? `${element.style.height * zoom}px` : 'auto',
                    flexShrink: 0,
                    position: 'relative',
                    outline: isSelected ? '2px solid #2563eb' : 'none',
                    opacity: element.style.opacity,
                    transform: `rotate(${element.style.rotation || 0}deg)`,
                    zIndex: element.style.zIndex,
                }}
            >
                {renderContent()}
            </div>
        );
    }

    return (
        <Rnd
            size={{ width: element.style.width * zoom, height: element.style.height * zoom }}
            position={{ x: element.style.left * zoom, y: element.style.top * zoom }}
            onDragStart={() => {
                if (!isSelected) selectElement(element.id);
            }}
            onDrag={(e, d) => {
                updateElementStyle(element.id, {
                    left: d.x / zoom,
                    top: d.y / zoom,
                });
            }}
            onResize={(e, direction, ref, delta, position) => {
                updateElementStyle(element.id, {
                    width: parseInt(ref.style.width) / zoom,
                    height: parseInt(ref.style.height) / zoom,
                    left: position.x / zoom,
                    top: position.y / zoom,
                });
            }}
            disableDragging={element.locked}
            enableResizing={!element.locked}
            bounds="parent"
            dragGrid={gridSnap}
            resizeGrid={gridSnap}
            style={{
                border: isSelected
                    ? '1px solid #2563eb'
                    : element.locked
                        ? '1px dashed #dc2626'
                        : '1px dashed transparent',
                zIndex: element.style.zIndex,
                boxSizing: 'border-box',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isSelected && !element.locked) {
                    e.currentTarget.style.border = '1px dashed #9ca3af';
                }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isSelected) {
                    e.currentTarget.style.border = element.locked
                        ? '1px dashed #dc2626'
                        : '1px dashed transparent';
                }
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    fontSize: (element.style.fontSize || 14) * zoom,
                    fontWeight: element.style.fontWeight,
                    textAlign: element.style.textAlign,
                    color: element.style.color,
                    backgroundColor: ['rating_dots', 'progress_ring', 'timeline', 'skillbar', 'container'].includes(element.type)
                        ? 'transparent'
                        : element.style.backgroundColor,
                    borderRadius: (element.style.borderRadius || 0) * zoom,
                    borderWidth: element.style.borderWidth ? element.style.borderWidth * zoom : 0,
                    borderColor: element.style.borderColor,
                    borderStyle: element.style.borderWidth ? 'solid' : 'none',
                    opacity: element.style.opacity,
                    transform: `rotate(${element.style.rotation || 0}deg)`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!element.locked) {
                        if (e.shiftKey) {
                            addToSelection(element.id);
                        } else {
                            selectElement(element.id);
                        }
                    }
                }}
            >
                {renderContent()}
            </div>
        </Rnd>
    );
}
