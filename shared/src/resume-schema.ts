/**
 * Resume Builder - JSON Resume Schema
 * Standardized data structure for resume data
 */

// ============================================
// CORE TYPES
// ============================================

export interface ResumeData {
    id: string;
    createdAt: string;
    updatedAt: string;
    templateId: string;
    personalInfo: PersonalInfo;
    summary?: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    languages: Language[];
    customSections: CustomSection[];
    settings: ResumeSettings;
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    title?: string; // e.g., "Senior Software Engineer"
    photo?: string; // Base64 or URL
}

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string; // ISO date format: YYYY-MM
    endDate?: string; // ISO date or "Present"
    isCurrentRole: boolean;
    bullets: string[];
    order: number;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    honors?: string;
    order: number;
}

export interface Skill {
    id: string;
    name: string;
    category?: string; // e.g., "Programming Languages", "Frameworks"
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    level?: number; // 0-100 for progress bars
    order: number;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    url?: string;
    githubUrl?: string;
    liveUrl?: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    bullets: string[];
    order: number;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date?: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
    order: number;
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'basic' | 'conversational' | 'professional' | 'native';
    order: number;
}

export interface CustomSection {
    id: string;
    title: string;
    items: CustomSectionItem[];
    order: number;
}

export interface CustomSectionItem {
    id: string;
    title?: string;
    subtitle?: string;
    date?: string;
    description?: string;
    bullets: string[];
    order: number;
}

// ============================================
// SETTINGS & TEMPLATES
// ============================================

export interface ResumeSettings {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: string;
    primaryColor: string;
    showIcons: boolean;
    useFullUrls: boolean;
    margin: { top: number; right: number; bottom: number; left: number };
    sectionOrder: SectionType[];
}

export type SectionType =
    | 'summary'
    | 'workExperience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'certifications'
    | 'languages'
    | 'custom';

// ============================================
// CONSTRAINT SYSTEM (Traffic Light)
// ============================================

export type ConstraintStatus = 'ok' | 'warning' | 'overflow';

export interface FieldConstraint {
    fieldPath: string;
    maxLength?: number;
    currentLength: number;
    status: ConstraintStatus;
    message?: string;
}

export interface PageConstraint {
    currentPages: number;
    maxPages: number;
    overflowingSections: string[];
    status: ConstraintStatus;
}

// ============================================
// API TYPES
// ============================================

export interface GeneratePDFRequest {
    resumeData: ResumeData;
    templateId?: string;
}

export interface GeneratePDFResponse {
    success: boolean;
    pdfBuffer?: Buffer;
    error?: string;
    constraints?: PageConstraint;
}

export interface PreviewRequest {
    resumeData: ResumeData;
    templateId?: string;
}

export interface PreviewResponse {
    success: boolean;
    html?: string;
    constraints?: PageConstraint;
    error?: string;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function createEmptyResume(): ResumeData {
    const now = new Date().toISOString();
    return {
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        templateId: 'modern',
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
        },
        summary: '',
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
        settings: {
            fontSize: 'medium',
            fontFamily: 'Inter',
            primaryColor: '#2563eb',
            showIcons: true,
            useFullUrls: true,
            margin: { top: 18, right: 18, bottom: 18, left: 18 },
            sectionOrder: ['summary', 'workExperience', 'education', 'skills', 'projects', 'certifications'],
        },
    };
}

// ============================================
// SANDBOX TYPES (Enhanced Design Tool)
// ============================================

// Page size presets
export type PageSize = 'A4' | 'US_LETTER' | 'CUSTOM';

export const PAGE_SIZES: Record<PageSize, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },         // mm
    US_LETTER: { width: 215.9, height: 279.4 }, // mm
    CUSTOM: { width: 210, height: 297 },     // default to A4
};

// Viewport state for zoom/pan
export interface SandboxViewport {
    zoom: number;       // 0.1 to 4.0 (10% to 400%)
    panX: number;       // horizontal offset
    panY: number;       // vertical offset
}

// Guide lines (horizontal/vertical rulers)
export interface Guide {
    id: string;
    orientation: 'horizontal' | 'vertical';
    position: number;   // in mm from edge
    locked: boolean;
}

// Text styles for typography system
export interface TextStyle {
    id: string;
    name: string;       // "Heading 1", "Body", etc.
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    lineHeight: number;
    letterSpacing: number;
    color: string;
    isDefault?: boolean;
}

// Global styles & themes
export interface GlobalStyles {
    textStyles: TextStyle[];
    colors: { name: string; value: string }[];
    primaryColor: string;
    accentColor: string;
    mutedColor: string;
}

// Individual page (multi-page support)
export interface SandboxPage {
    id: string;
    name: string;
    size: PageSize;
    width: number;      // in mm
    height: number;     // in mm
    backgroundColor?: string;
    elementIds?: string[];
    locked?: boolean;
    visible?: boolean;
}

// Element types
export type SandboxElementType = 'text' | 'image' | 'shape' | 'icon' | 'divider' | 'skillbar' | 'timeline' | 'rating_dots' | 'progress_ring' | 'container' | 'tag_cloud' | 'icon_list' | 'metrics';

export interface ContainerProps {
    direction: 'row' | 'column';
    gap: number;
    padding: number;
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between';
    wrap?: boolean;

    // Auto-sizing modes
    heightMode: 'fixed' | 'auto' | 'hug';  // fixed=manual, auto=grow with content, hug=shrink to content
    widthMode: 'fixed' | 'auto' | 'fill';   // fixed=manual, auto=grow, fill=fill parent width

    // Size constraints
    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
}

export interface ElementConstraints {
    // Anchor target - what this element is positioned relative to
    anchor: 'page' | 'parent' | 'section' | null;

    // Pin edges - keep distance constant from edge on resize
    pinLeft: boolean;
    pinRight: boolean;
    pinTop: boolean;
    pinBottom: boolean;

    // Margins from anchor edges (when pinned)
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
}

export interface SandboxElement {
    id: string;
    type: SandboxElementType;
    content: string; // URL for image, text content for text
    name: string;
    pageId: string;

    // Layer properties
    locked: boolean;
    visible: boolean;
    groupId?: string;   // Group membership
    parentId?: string;  // For nested elements in containers

    // Styling
    style: {
        left: number;
        top: number;
        width: number;
        height: number;
        zIndex: number;
        fontSize?: number;
        fontWeight?: string;
        textAlign?: 'left' | 'center' | 'right';
        color?: string;
        backgroundColor?: string;
        borderRadius?: number;
        borderWidth?: number;
        borderColor?: string;
        opacity?: number;
        fontFamily?: string;
        lineHeight?: number;
        letterSpacing?: number;
        rotation?: number;
    };

    // Constraints for positioning
    constraints?: ElementConstraints;

    // Style reference (for global styles)
    textStyleId?: string;

    // Additional properties
    props?: Record<string, any> & Partial<ContainerProps>;
}

// Group of elements
export interface ElementGroup {
    id: string;
    name: string;
    elementIds: string[];
    locked: boolean;
    visible: boolean;
}

// Component System
export interface ComponentVariant {
    id: string;
    name: string;                          // e.g., "Compact", "Dense", "Minimal"
    overrides: Record<string, any>;        // Property overrides for this variant
}

export interface ComponentDefinition {
    id: string;
    name: string;                          // User-friendly name
    description?: string;
    sourceElementIds: string[];            // Original elements that make up this component
    variants: ComponentVariant[];
    defaultVariantId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ComponentInstance {
    componentId: string;                   // Reference to ComponentDefinition
    variantId?: string;                    // Which variant is active
    overrides: Record<string, any>;        // Instance-level property overrides
    detached: boolean;                     // If true, no longer synced with master
}

// Section Semantics (for sandbox)
export type SandboxSectionType = 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'summary' | 'custom';

export interface SectionRules {
    dateAlignment: 'left' | 'right' | 'inline';
    bulletStyle: 'disc' | 'dash' | 'arrow' | 'check' | 'none';
    hierarchyOrder: ('company' | 'role' | 'date' | 'location')[];
    density: 'compact' | 'normal' | 'spacious';
    keepTogether: boolean;                 // Page break control
}

export interface SemanticSection {
    id: string;
    type: SandboxSectionType;
    name: string;
    elementIds: string[];
    rules: SectionRules;
    order: number;                         // For ordering sections on the page
}

// Main sandbox data structure
export interface SandboxData {
    // Multi-page support
    pages: SandboxPage[];
    currentPageIndex: number;

    // All elements (across all pages)
    elements: SandboxElement[];

    // Groups
    groups: ElementGroup[];

    // Components (reusable element groups)
    components: ComponentDefinition[];

    // Semantic sections
    sections: SemanticSection[];

    // Viewport state
    viewport: SandboxViewport;

    // Guides
    guides: Guide[];

    // Global styles
    globalStyles: GlobalStyles;

    // Settings
    gridEnabled: boolean;
    gridSize: number;
    snapToGrid: boolean;
    snapToGuides: boolean;
    snapToElements: boolean;
    showRulers: boolean;
    unit: 'px' | 'mm' | 'pt';

    // ATS Mode
    atsEnabled?: boolean;

    // Version Control
    versions?: ResumeVersion[];
    currentVersionId?: string;
}

// Resume Version (for version control)
export interface ResumeVersion {
    id: string;
    name: string;                          // "Resume for Google", "Startup Version"
    description?: string;
    elements: SandboxElement[];            // Snapshot of elements
    pages: SandboxPage[];                  // Snapshot of pages
    createdAt: string;
    updatedAt: string;
}

// ATS Analysis Types
export type ATSWarningSeverity = 'error' | 'warning' | 'info';

export interface ATSWarning {
    id: string;
    elementId?: string;           // Which element triggered this (if applicable)
    severity: ATSWarningSeverity;
    category: 'layout' | 'graphics' | 'fonts' | 'structure' | 'content';
    message: string;
    suggestion: string;
}

export interface ATSAnalysis {
    score: number | null;          // 0-100 ATS compatibility score, null if draft
    isDraft: boolean;              // True if content is below minimum threshold
    minWordsRequired: number;      // Minimum words needed for score
    warnings: ATSWarning[];
    extractedText: string;         // Plain text extraction
    wordCount: number;
    keywordDensity?: KeywordDensity;  // Keyword frequency analysis
    analyzedAt: string;           // ISO timestamp
}

export interface KeywordDensity {
    topKeywords: { word: string; count: number; density: number }[];
    totalWords: number;
    uniqueWords: number;
}

// Default text styles
export const DEFAULT_TEXT_STYLES: TextStyle[] = [
    { id: 'h1', name: 'Heading 1', fontSize: 28, fontWeight: '700', fontFamily: 'Inter', lineHeight: 1.2, letterSpacing: -0.5, color: '#111827', isDefault: true },
    { id: 'h2', name: 'Heading 2', fontSize: 20, fontWeight: '600', fontFamily: 'Inter', lineHeight: 1.3, letterSpacing: -0.25, color: '#111827', isDefault: true },
    { id: 'h3', name: 'Heading 3', fontSize: 16, fontWeight: '600', fontFamily: 'Inter', lineHeight: 1.4, letterSpacing: 0, color: '#374151', isDefault: true },
    { id: 'body', name: 'Body', fontSize: 12, fontWeight: '400', fontFamily: 'Inter', lineHeight: 1.5, letterSpacing: 0, color: '#374151', isDefault: true },
    { id: 'caption', name: 'Caption', fontSize: 10, fontWeight: '400', fontFamily: 'Inter', lineHeight: 1.4, letterSpacing: 0.25, color: '#6b7280', isDefault: true },
    { id: 'meta', name: 'Meta', fontSize: 9, fontWeight: '500', fontFamily: 'Inter', lineHeight: 1.3, letterSpacing: 0.5, color: '#9ca3af', isDefault: true },
];

// Create empty sandbox with defaults
export function createEmptySandbox(): SandboxData {
    const defaultPage: SandboxPage = {
        id: generateId(),
        name: 'Page 1',
        size: 'A4',
        width: PAGE_SIZES.A4.width,
        height: PAGE_SIZES.A4.height,
        backgroundColor: '#ffffff',
    };

    return {
        pages: [defaultPage],
        currentPageIndex: 0,
        elements: [],
        groups: [],
        viewport: { zoom: 1, panX: 0, panY: 0 },
        guides: [],
        globalStyles: {
            textStyles: [...DEFAULT_TEXT_STYLES],
            colors: [
                { name: 'Primary', value: '#2563eb' },
                { name: 'Accent', value: '#8b5cf6' },
                { name: 'Muted', value: '#6b7280' },
                { name: 'Dark', value: '#111827' },
                { name: 'Light', value: '#f3f4f6' },
            ],
            primaryColor: '#2563eb',
            accentColor: '#8b5cf6',
            mutedColor: '#6b7280',
        },
        components: [],
        sections: [],
        gridEnabled: true,
        gridSize: 10,
        snapToGrid: true,
        snapToGuides: true,
        snapToElements: true,
        showRulers: true,
        unit: 'mm',
    };
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validation constraints
export const CONSTRAINTS = {
    summary: { maxLength: 400 },
    bulletPoint: { maxLength: 200 },
    companyName: { maxLength: 100 },
    position: { maxLength: 100 },
    skillName: { maxLength: 50 },
};
