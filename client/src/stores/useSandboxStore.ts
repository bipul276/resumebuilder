import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import {
    SandboxData,
    SandboxElement,
    SandboxPage,
    ElementGroup,
    generateId,
    createEmptySandbox,
    PAGE_SIZES,
    PageSize,
} from '@resumebuilder/shared';

interface SandboxStore {
    data: SandboxData;
    selectedIds: string[];

    // Viewport actions
    setZoom: (zoom: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    pan: (deltaX: number, deltaY: number) => void;
    resetViewport: () => void;

    // Page actions
    addPage: (size?: PageSize) => void;
    removePage: (pageId: string) => void;
    setCurrentPage: (index: number) => void;
    updatePage: (pageId: string, updates: Partial<SandboxPage>) => void;

    // Element actions
    addElement: (type: SandboxElement['type'], content?: string) => void;
    updateElement: (id: string, updates: Partial<SandboxElement>) => void;
    updateElementStyle: (id: string, styleUpdates: Partial<SandboxElement['style']>) => void;
    removeElement: (id: string) => void;
    duplicateElement: (id: string) => void;

    // Selection
    selectElement: (id: string | null) => void;
    selectMultiple: (ids: string[]) => void;
    addToSelection: (id: string) => void;
    clearSelection: () => void;

    // Layer actions
    toggleVisibility: (id: string) => void;
    toggleLock: (id: string) => void;
    renameElement: (id: string, name: string) => void;
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    moveLayerUp: (id: string) => void;
    moveLayerDown: (id: string) => void;

    // Grouping
    groupElements: (ids: string[]) => void;
    ungroupElements: (groupId: string) => void;

    // Guides
    addGuide: (orientation: 'horizontal' | 'vertical', position: number) => void;
    removeGuide: (id: string) => void;
    updateGuide: (id: string, position: number) => void;

    // Settings
    toggleGrid: () => void;
    setGridSize: (size: number) => void;
    toggleSnapToGrid: () => void;
    toggleSnapToGuides: () => void;
    toggleSnapToElements: () => void;
    toggleRulers: () => void;
    setUnit: (unit: 'px' | 'mm' | 'pt') => void;

    // Global styles
    setPrimaryColor: (color: string) => void;
    setAccentColor: (color: string) => void;

    // Alignment
    alignElements: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    distributeElements: (direction: 'horizontal' | 'vertical') => void;

    // Reset
    resetSandbox: () => void;
}

// Zoom levels
const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

export const useSandboxStore = create<SandboxStore>()(
    temporal(
        persist(
            (set, get) => ({
                data: createEmptySandbox(),
                selectedIds: [],

                // Viewport
                setZoom: (zoom) => set((state) => ({
                    data: {
                        ...state.data,
                        viewport: { ...state.data.viewport, zoom: Math.max(0.1, Math.min(4, zoom)) }
                    }
                })),

                zoomIn: () => {
                    const current = get().data.viewport.zoom;
                    const nextLevel = ZOOM_LEVELS.find(z => z > current) || 4;
                    set((state) => ({
                        data: { ...state.data, viewport: { ...state.data.viewport, zoom: nextLevel } }
                    }));
                },

                zoomOut: () => {
                    const current = get().data.viewport.zoom;
                    const prevLevel = [...ZOOM_LEVELS].reverse().find(z => z < current) || 0.1;
                    set((state) => ({
                        data: { ...state.data, viewport: { ...state.data.viewport, zoom: prevLevel } }
                    }));
                },

                resetZoom: () => set((state) => ({
                    data: { ...state.data, viewport: { ...state.data.viewport, zoom: 1 } }
                })),

                pan: (deltaX, deltaY) => set((state) => ({
                    data: {
                        ...state.data,
                        viewport: {
                            ...state.data.viewport,
                            panX: state.data.viewport.panX + deltaX,
                            panY: state.data.viewport.panY + deltaY,
                        }
                    }
                })),

                resetViewport: () => set((state) => ({
                    data: { ...state.data, viewport: { zoom: 1, panX: 0, panY: 0 } }
                })),

                // Pages
                addPage: (size = 'A4') => set((state) => {
                    const newPage: SandboxPage = {
                        id: generateId(),
                        name: `Page ${state.data.pages.length + 1}`,
                        size,
                        width: PAGE_SIZES[size].width,
                        height: PAGE_SIZES[size].height,
                        backgroundColor: '#ffffff',
                    };
                    return {
                        data: {
                            ...state.data,
                            pages: [...state.data.pages, newPage],
                            currentPageIndex: state.data.pages.length,
                        }
                    };
                }),

                removePage: (pageId) => set((state) => {
                    if (state.data.pages.length <= 1) return state;
                    const newPages = state.data.pages.filter(p => p.id !== pageId);
                    const newElements = state.data.elements.filter(e => e.pageId !== pageId);
                    return {
                        data: {
                            ...state.data,
                            pages: newPages,
                            elements: newElements,
                            currentPageIndex: Math.min(state.data.currentPageIndex, newPages.length - 1),
                        }
                    };
                }),

                setCurrentPage: (index) => set((state) => ({
                    data: { ...state.data, currentPageIndex: Math.max(0, Math.min(index, state.data.pages.length - 1)) }
                })),

                updatePage: (pageId, updates) => set((state) => ({
                    data: {
                        ...state.data,
                        pages: state.data.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
                    }
                })),

                // Elements
                addElement: (type, content = 'New Item') => set((state) => {
                    const currentPage = state.data.pages[state.data.currentPageIndex];
                    if (!currentPage) return state;

                    const pageElements = state.data.elements.filter(e => e.pageId === currentPage.id);
                    const offset = pageElements.length * 10;
                    const maxZ = Math.max(...state.data.elements.map(e => e.style.zIndex), 0);

                    const elementNames: Record<SandboxElement['type'], string> = {
                        text: 'Text',
                        image: 'Image',
                        shape: 'Rectangle',
                        icon: 'Icon',
                        divider: 'Divider',
                        skillbar: 'Skill Bar',
                        timeline: 'Timeline',
                        rating_dots: 'Rating Dots',
                        progress_ring: 'Progress Ring',
                        container: 'Container',
                        tag_cloud: 'Tag Cloud',
                        icon_list: 'Icon List',
                        metrics: 'Metrics',
                    };

                    // Default sizes by type
                    const getDefaultSize = (t: SandboxElement['type']) => {
                        switch (t) {
                            case 'text': return { width: 200, height: 50 };
                            case 'divider': return { width: 300, height: 2 };
                            case 'container': return { width: 300, height: 200 };
                            case 'tag_cloud': return { width: 280, height: 80 };
                            case 'icon_list': return { width: 200, height: 120 };
                            case 'metrics': return { width: 300, height: 60 };
                            default: return { width: 100, height: 100 };
                        }
                    };

                    const defaultSize = getDefaultSize(type);

                    // Default props by type
                    const getDefaultProps = (t: SandboxElement['type']) => {
                        switch (t) {
                            case 'container':
                                return {
                                    direction: 'column' as const,
                                    gap: 16,
                                    padding: 16,
                                    alignItems: 'stretch' as const,
                                    justifyContent: 'flex-start' as const,
                                    heightMode: 'auto' as const,
                                    widthMode: 'fixed' as const,
                                };
                            case 'tag_cloud':
                                return {
                                    tags: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
                                    colors: ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706'],
                                };
                            case 'icon_list':
                                return {
                                    items: [
                                        { icon: 'Mail', label: 'email@example.com' },
                                        { icon: 'Phone', label: '(555) 123-4567' },
                                        { icon: 'MapPin', label: 'San Francisco, CA' },
                                    ],
                                    layout: 'vertical',
                                };
                            case 'metrics':
                                return {
                                    items: [
                                        { label: 'YOE', value: '5+', unit: 'years' },
                                        { label: 'Projects', value: '20+', unit: '' },
                                        { label: 'Impact', value: '$2M+', unit: 'saved' },
                                    ],
                                };
                            default:
                                return {};
                        }
                    };

                    const newElement: SandboxElement = {
                        id: generateId(),
                        type,
                        content: type === 'text' ? 'Double click to edit' : content,
                        name: `${elementNames[type]} ${pageElements.length + 1}`,
                        pageId: currentPage.id,
                        locked: false,
                        visible: true,
                        style: {
                            left: 50 + (offset % 100),
                            top: 50 + (offset % 100),
                            width: defaultSize.width,
                            height: defaultSize.height,
                            zIndex: maxZ + 1,
                            fontSize: 14,
                            color: '#000000',
                            textAlign: 'left',
                            fontFamily: 'Inter',
                            borderWidth: type === 'shape' ? 2 : 0,
                            borderColor: '#000000',
                            backgroundColor: type === 'shape' || type === 'container' ? 'transparent' : undefined,
                            opacity: 1,
                            lineHeight: 1.5,
                            letterSpacing: 0,
                        },
                        props: getDefaultProps(type),
                    };

                    return {
                        data: { ...state.data, elements: [...state.data.elements, newElement] },
                        selectedIds: [newElement.id]
                    };
                }),

                updateElement: (id, updates) => set((state) => ({
                    data: {
                        ...state.data,
                        elements: state.data.elements.map(el =>
                            el.id === id ? { ...el, ...updates } : el
                        ),
                    },
                })),

                updateElementStyle: (id, styleUpdates) => set((state) => ({
                    data: {
                        ...state.data,
                        elements: state.data.elements.map(el =>
                            el.id === id ? { ...el, style: { ...el.style, ...styleUpdates } } : el
                        ),
                    },
                })),

                removeElement: (id) => set((state) => ({
                    data: { ...state.data, elements: state.data.elements.filter(el => el.id !== id) },
                    selectedIds: state.selectedIds.filter(sid => sid !== id),
                })),

                duplicateElement: (id) => set((state) => {
                    const element = state.data.elements.find(el => el.id === id);
                    if (!element) return state;

                    const maxZ = Math.max(...state.data.elements.map(e => e.style.zIndex), 0);
                    const newElement: SandboxElement = {
                        ...element,
                        id: generateId(),
                        name: `${element.name} copy`,
                        style: {
                            ...element.style,
                            left: element.style.left + 20,
                            top: element.style.top + 20,
                            zIndex: maxZ + 1,
                        },
                    };

                    return {
                        data: { ...state.data, elements: [...state.data.elements, newElement] },
                        selectedIds: [newElement.id]
                    };
                }),

                // Selection
                selectElement: (id) => set({ selectedIds: id ? [id] : [] }),
                selectMultiple: (ids) => set({ selectedIds: ids }),
                addToSelection: (id) => set((state) => ({
                    selectedIds: state.selectedIds.includes(id)
                        ? state.selectedIds.filter(sid => sid !== id)
                        : [...state.selectedIds, id]
                })),
                clearSelection: () => set({ selectedIds: [] }),

                // Layers
                toggleVisibility: (id) => set((state) => ({
                    data: {
                        ...state.data,
                        elements: state.data.elements.map(el =>
                            el.id === id ? { ...el, visible: !el.visible } : el
                        ),
                    },
                })),

                toggleLock: (id) => set((state) => ({
                    data: {
                        ...state.data,
                        elements: state.data.elements.map(el =>
                            el.id === id ? { ...el, locked: !el.locked } : el
                        ),
                    },
                })),

                renameElement: (id, name) => set((state) => ({
                    data: {
                        ...state.data,
                        elements: state.data.elements.map(el =>
                            el.id === id ? { ...el, name } : el
                        ),
                    },
                })),

                bringToFront: (id) => set((state) => {
                    const maxZ = Math.max(...state.data.elements.map(el => el.style.zIndex), 0);
                    return {
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el =>
                                el.id === id ? { ...el, style: { ...el.style, zIndex: maxZ + 1 } } : el
                            ),
                        },
                    };
                }),

                sendToBack: (id) => set((state) => {
                    const minZ = Math.min(...state.data.elements.map(el => el.style.zIndex), 0);
                    return {
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el =>
                                el.id === id ? { ...el, style: { ...el.style, zIndex: minZ - 1 } } : el
                            ),
                        },
                    };
                }),

                moveLayerUp: (id) => set((state) => {
                    const elements = [...state.data.elements].sort((a, b) => b.style.zIndex - a.style.zIndex);
                    const index = elements.findIndex(el => el.id === id);
                    if (index <= 0) return state;

                    const current = elements[index];
                    const above = elements[index - 1];
                    const tempZ = current.style.zIndex;

                    return {
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el => {
                                if (el.id === id) return { ...el, style: { ...el.style, zIndex: above.style.zIndex } };
                                if (el.id === above.id) return { ...el, style: { ...el.style, zIndex: tempZ } };
                                return el;
                            }),
                        },
                    };
                }),

                moveLayerDown: (id) => set((state) => {
                    const elements = [...state.data.elements].sort((a, b) => b.style.zIndex - a.style.zIndex);
                    const index = elements.findIndex(el => el.id === id);
                    if (index < 0 || index >= elements.length - 1) return state;

                    const current = elements[index];
                    const below = elements[index + 1];
                    const tempZ = current.style.zIndex;

                    return {
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el => {
                                if (el.id === id) return { ...el, style: { ...el.style, zIndex: below.style.zIndex } };
                                if (el.id === below.id) return { ...el, style: { ...el.style, zIndex: tempZ } };
                                return el;
                            }),
                        },
                    };
                }),

                // Grouping
                groupElements: (ids) => set((state) => {
                    if (ids.length < 2) return state;

                    const newGroup: ElementGroup = {
                        id: generateId(),
                        name: `Group ${state.data.groups.length + 1}`,
                        elementIds: ids,
                        locked: false,
                        visible: true,
                    };

                    return {
                        data: {
                            ...state.data,
                            groups: [...state.data.groups, newGroup],
                            elements: state.data.elements.map(el =>
                                ids.includes(el.id) ? { ...el, groupId: newGroup.id } : el
                            ),
                        },
                    };
                }),

                ungroupElements: (groupId) => set((state) => ({
                    data: {
                        ...state.data,
                        groups: state.data.groups.filter(g => g.id !== groupId),
                        elements: state.data.elements.map(el =>
                            el.groupId === groupId ? { ...el, groupId: undefined } : el
                        ),
                    },
                })),

                // Guides
                addGuide: (orientation, position) => set((state) => ({
                    data: {
                        ...state.data,
                        guides: [...state.data.guides, { id: generateId(), orientation, position, locked: false }],
                    },
                })),

                removeGuide: (id) => set((state) => ({
                    data: {
                        ...state.data,
                        guides: state.data.guides.filter(g => g.id !== id),
                    },
                })),

                updateGuide: (id, position) => set((state) => ({
                    data: {
                        ...state.data,
                        guides: state.data.guides.map(g => g.id === id ? { ...g, position } : g),
                    },
                })),

                // Settings
                toggleGrid: () => set((state) => ({
                    data: { ...state.data, gridEnabled: !state.data.gridEnabled }
                })),
                setGridSize: (size) => set((state) => ({
                    data: { ...state.data, gridSize: size }
                })),
                toggleSnapToGrid: () => set((state) => ({
                    data: { ...state.data, snapToGrid: !state.data.snapToGrid }
                })),
                toggleSnapToGuides: () => set((state) => ({
                    data: { ...state.data, snapToGuides: !state.data.snapToGuides }
                })),
                toggleSnapToElements: () => set((state) => ({
                    data: { ...state.data, snapToElements: !state.data.snapToElements }
                })),
                toggleRulers: () => set((state) => ({
                    data: { ...state.data, showRulers: !state.data.showRulers }
                })),
                setUnit: (unit) => set((state) => ({
                    data: { ...state.data, unit }
                })),

                // Global styles
                setPrimaryColor: (color) => set((state) => ({
                    data: {
                        ...state.data,
                        globalStyles: { ...state.data.globalStyles, primaryColor: color }
                    }
                })),
                setAccentColor: (color) => set((state) => ({
                    data: {
                        ...state.data,
                        globalStyles: { ...state.data.globalStyles, accentColor: color }
                    }
                })),

                // Alignment
                alignElements: (alignment) => set((state) => {
                    if (state.selectedIds.length < 2) return state;

                    const selectedElements = state.data.elements.filter(el => state.selectedIds.includes(el.id));

                    let alignValue: number;
                    switch (alignment) {
                        case 'left':
                            alignValue = Math.min(...selectedElements.map(el => el.style.left));
                            break;
                        case 'center':
                            const leftmost = Math.min(...selectedElements.map(el => el.style.left));
                            const rightmost = Math.max(...selectedElements.map(el => el.style.left + el.style.width));
                            alignValue = (leftmost + rightmost) / 2;
                            break;
                        case 'right':
                            alignValue = Math.max(...selectedElements.map(el => el.style.left + el.style.width));
                            break;
                        case 'top':
                            alignValue = Math.min(...selectedElements.map(el => el.style.top));
                            break;
                        case 'middle':
                            const topmost = Math.min(...selectedElements.map(el => el.style.top));
                            const bottommost = Math.max(...selectedElements.map(el => el.style.top + el.style.height));
                            alignValue = (topmost + bottommost) / 2;
                            break;
                        case 'bottom':
                            alignValue = Math.max(...selectedElements.map(el => el.style.top + el.style.height));
                            break;
                    }

                    return {
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el => {
                                if (!state.selectedIds.includes(el.id)) return el;

                                switch (alignment) {
                                    case 'left':
                                        return { ...el, style: { ...el.style, left: alignValue } };
                                    case 'center':
                                        return { ...el, style: { ...el.style, left: alignValue - el.style.width / 2 } };
                                    case 'right':
                                        return { ...el, style: { ...el.style, left: alignValue - el.style.width } };
                                    case 'top':
                                        return { ...el, style: { ...el.style, top: alignValue } };
                                    case 'middle':
                                        return { ...el, style: { ...el.style, top: alignValue - el.style.height / 2 } };
                                    case 'bottom':
                                        return { ...el, style: { ...el.style, top: alignValue - el.style.height } };
                                    default:
                                        return el;
                                }
                            }),
                        },
                    };
                }),

                distributeElements: (direction) => set((state) => {
                    if (state.selectedIds.length < 3) return state;

                    const selectedElements = state.data.elements
                        .filter(el => state.selectedIds.includes(el.id))
                        .sort((a, b) => direction === 'horizontal'
                            ? a.style.left - b.style.left
                            : a.style.top - b.style.top
                        );

                    const first = selectedElements[0];
                    const last = selectedElements[selectedElements.length - 1];

                    const totalSpace = direction === 'horizontal'
                        ? (last.style.left + last.style.width) - first.style.left
                        : (last.style.top + last.style.height) - first.style.top;

                    const totalElementSize = selectedElements.reduce(
                        (sum, el) => sum + (direction === 'horizontal' ? el.style.width : el.style.height),
                        0
                    );

                    const gap = (totalSpace - totalElementSize) / (selectedElements.length - 1);

                    let currentPos = direction === 'horizontal' ? first.style.left : first.style.top;
                    const newPositions: Map<string, number> = new Map();

                    selectedElements.forEach((el) => {
                        newPositions.set(el.id, currentPos);
                        currentPos += (direction === 'horizontal' ? el.style.width : el.style.height) + gap;
                    });

                    return {
                        data: {
                            ...state.data,
                            elements: state.data.elements.map(el => {
                                if (!newPositions.has(el.id)) return el;
                                const pos = newPositions.get(el.id)!;
                                return {
                                    ...el,
                                    style: {
                                        ...el.style,
                                        [direction === 'horizontal' ? 'left' : 'top']: pos,
                                    },
                                };
                            }),
                        },
                    };
                }),

                // Reset
                resetSandbox: () => set({
                    data: createEmptySandbox(),
                    selectedIds: [],
                }),
            }),
            { name: 'resume-sandbox-storage-v2' }
        ),
        {
            limit: 100,
            partialize: (state) => ({ data: state.data }),
        }
    )
);
