import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    ResumeData,
    WorkExperience,
    Education,
    Skill,
    Project,
    Certification,
    CustomSection,
    CustomSectionItem,
    PageConstraint,
    SectionType
} from '@resumebuilder/shared';
import { createEmptyResume, generateId } from '@resumebuilder/shared';

interface ResumeStore {
    // State
    resume: ResumeData;
    activeTab: string;
    constraints: PageConstraint | null;
    isGeneratingPDF: boolean;
    previewHtml: string;

    // Actions - Resume
    setResume: (resume: ResumeData) => void;
    updatePersonalInfo: (field: string, value: string) => void;
    updateSummary: (summary: string) => void;
    setTemplateId: (templateId: string) => void;

    // Actions - Work Experience
    addWorkExperience: () => void;
    updateWorkExperience: (id: string, field: string, value: unknown) => void;
    removeWorkExperience: (id: string) => void;
    reorderWorkExperience: (fromIndex: number, toIndex: number) => void;
    addBullet: (experienceId: string) => void;
    updateBullet: (experienceId: string, bulletIndex: number, value: string) => void;
    removeBullet: (experienceId: string, bulletIndex: number) => void;

    // Actions - Education
    addEducation: () => void;
    updateEducation: (id: string, field: string, value: string) => void;
    removeEducation: (id: string) => void;
    reorderEducation: (fromIndex: number, toIndex: number) => void;

    // Actions - Skills
    addSkill: () => void;
    updateSkill: (id: string, name: string) => void;
    updateSkillFull: (id: string, updates: { name?: string; category?: string; level?: number }) => void;
    removeSkill: (id: string) => void;

    // Actions - Projects
    addProject: () => void;
    updateProject: (id: string, field: string, value: unknown) => void;
    removeProject: (id: string) => void;
    reorderProjects: (fromIndex: number, toIndex: number) => void;

    // Actions - Certifications
    addCertification: () => void;
    updateCertification: (id: string, field: string, value: string) => void;
    removeCertification: (id: string) => void;
    reorderCertifications: (fromIndex: number, toIndex: number) => void;

    // Actions - Custom Sections
    addCustomSection: () => void;
    updateCustomSectionTitle: (sectionId: string, title: string) => void;
    removeCustomSection: (sectionId: string) => void;
    addCustomSectionItem: (sectionId: string) => void;
    updateCustomSectionItem: (sectionId: string, itemId: string, field: string, value: unknown) => void;
    removeCustomSectionItem: (sectionId: string, itemId: string) => void;
    reorderCustomSectionItems: (sectionId: string, fromIndex: number, toIndex: number) => void;
    addCustomSectionBullet: (sectionId: string, itemId: string) => void;
    updateCustomSectionBullet: (sectionId: string, itemId: string, bulletIndex: number, value: string) => void;
    removeCustomSectionBullet: (sectionId: string, itemId: string, bulletIndex: number) => void;

    // Actions - Settings
    updateSectionOrder: (order: SectionType[]) => void;
    updateSettings: (field: string, value: unknown) => void;

    // Actions - UI
    setActiveTab: (tab: string) => void;
    setConstraints: (constraints: PageConstraint | null) => void;
    setIsGeneratingPDF: (isGenerating: boolean) => void;
    setPreviewHtml: (html: string) => void;

    // Import/Export
    importResume: (data: ResumeData) => void;

    // Reset
    resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>()(
    persist(
        (set, get) => ({
            // Initial State
            resume: createEmptyResume(),
            activeTab: 'personal',
            constraints: null,
            isGeneratingPDF: false,
            previewHtml: '',

            // Resume Actions
            setResume: (resume) => set({ resume }),

            updatePersonalInfo: (field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    personalInfo: { ...state.resume.personalInfo, [field]: value },
                    updatedAt: new Date().toISOString(),
                },
            })),

            updateSummary: (summary) => set((state) => ({
                resume: {
                    ...state.resume,
                    summary,
                    updatedAt: new Date().toISOString(),
                },
            })),

            setTemplateId: (templateId) => set((state) => ({
                resume: { ...state.resume, templateId },
            })),

            // Work Experience Actions
            addWorkExperience: () => set((state) => {
                const newExp: WorkExperience = {
                    id: generateId(),
                    company: '',
                    position: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrentRole: false,
                    bullets: [''],
                    order: state.resume.workExperience.length,
                };
                return {
                    resume: {
                        ...state.resume,
                        workExperience: [...state.resume.workExperience, newExp],
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateWorkExperience: (id, field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    workExperience: state.resume.workExperience.map((exp) =>
                        exp.id === id ? { ...exp, [field]: value } : exp
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeWorkExperience: (id) => set((state) => ({
                resume: {
                    ...state.resume,
                    workExperience: state.resume.workExperience.filter((exp) => exp.id !== id),
                    updatedAt: new Date().toISOString(),
                },
            })),

            reorderWorkExperience: (fromIndex, toIndex) => set((state) => {
                const items = [...state.resume.workExperience];
                const [removed] = items.splice(fromIndex, 1);
                items.splice(toIndex, 0, removed);
                return {
                    resume: {
                        ...state.resume,
                        workExperience: items.map((item, index) => ({ ...item, order: index })),
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            addBullet: (experienceId) => set((state) => ({
                resume: {
                    ...state.resume,
                    workExperience: state.resume.workExperience.map((exp) =>
                        exp.id === experienceId
                            ? { ...exp, bullets: [...exp.bullets, ''] }
                            : exp
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            updateBullet: (experienceId, bulletIndex, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    workExperience: state.resume.workExperience.map((exp) =>
                        exp.id === experienceId
                            ? {
                                ...exp,
                                bullets: exp.bullets.map((b, i) => (i === bulletIndex ? value : b)),
                            }
                            : exp
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeBullet: (experienceId, bulletIndex) => set((state) => ({
                resume: {
                    ...state.resume,
                    workExperience: state.resume.workExperience.map((exp) =>
                        exp.id === experienceId
                            ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) }
                            : exp
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            // Education Actions
            addEducation: () => set((state) => {
                const newEdu: Education = {
                    id: generateId(),
                    institution: '',
                    degree: '',
                    field: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    gpa: '',
                    order: state.resume.education.length,
                };
                return {
                    resume: {
                        ...state.resume,
                        education: [...state.resume.education, newEdu],
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateEducation: (id, field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    education: state.resume.education.map((edu) =>
                        edu.id === id ? { ...edu, [field]: value } : edu
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeEducation: (id) => set((state) => ({
                resume: {
                    ...state.resume,
                    education: state.resume.education.filter((edu) => edu.id !== id),
                    updatedAt: new Date().toISOString(),
                },
            })),

            reorderEducation: (fromIndex, toIndex) => set((state) => {
                const items = [...state.resume.education];
                const [removed] = items.splice(fromIndex, 1);
                items.splice(toIndex, 0, removed);
                return {
                    resume: {
                        ...state.resume,
                        education: items.map((item, index) => ({ ...item, order: index })),
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            // Skill Actions
            addSkill: () => set((state) => {
                const newSkill: Skill = {
                    id: generateId(),
                    name: '',
                    order: state.resume.skills.length,
                };
                return {
                    resume: {
                        ...state.resume,
                        skills: [...state.resume.skills, newSkill],
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateSkill: (id, name) => set((state) => ({
                resume: {
                    ...state.resume,
                    skills: state.resume.skills.map((skill) =>
                        skill.id === id ? { ...skill, name } : skill
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            updateSkillFull: (id, updates) => set((state) => ({
                resume: {
                    ...state.resume,
                    skills: state.resume.skills.map((skill) =>
                        skill.id === id ? { ...skill, ...updates } : skill
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeSkill: (id) => set((state) => ({
                resume: {
                    ...state.resume,
                    skills: state.resume.skills.filter((skill) => skill.id !== id),
                    updatedAt: new Date().toISOString(),
                },
            })),

            // Project Actions
            addProject: () => set((state) => {
                const newProject: Project = {
                    id: generateId(),
                    name: '',
                    description: '',
                    url: '',
                    technologies: [],
                    bullets: [],
                    order: state.resume.projects.length,
                };
                return {
                    resume: {
                        ...state.resume,
                        projects: [...state.resume.projects, newProject],
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateProject: (id, field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    projects: state.resume.projects.map((proj) =>
                        proj.id === id ? { ...proj, [field]: value } : proj
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeProject: (id) => set((state) => ({
                resume: {
                    ...state.resume,
                    projects: state.resume.projects.filter((proj) => proj.id !== id),
                    updatedAt: new Date().toISOString(),
                },
            })),

            reorderProjects: (fromIndex, toIndex) => set((state) => {
                const items = [...state.resume.projects];
                const [removed] = items.splice(fromIndex, 1);
                items.splice(toIndex, 0, removed);
                return {
                    resume: {
                        ...state.resume,
                        projects: items.map((item, index) => ({ ...item, order: index })),
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            // Certification Actions
            addCertification: () => set((state) => {
                const newCert: Certification = {
                    id: generateId(),
                    name: '',
                    issuer: '',
                    date: '',
                    expiryDate: '',
                    credentialId: '',
                    url: '',
                    order: state.resume.certifications.length,
                };
                return {
                    resume: {
                        ...state.resume,
                        certifications: [...state.resume.certifications, newCert],
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateCertification: (id, field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    certifications: state.resume.certifications.map((cert) =>
                        cert.id === id ? { ...cert, [field]: value } : cert
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeCertification: (id) => set((state) => ({
                resume: {
                    ...state.resume,
                    certifications: state.resume.certifications.filter((cert) => cert.id !== id),
                    updatedAt: new Date().toISOString(),
                },
            })),

            reorderCertifications: (fromIndex, toIndex) => set((state) => {
                const items = [...state.resume.certifications];
                const [removed] = items.splice(fromIndex, 1);
                items.splice(toIndex, 0, removed);
                return {
                    resume: {
                        ...state.resume,
                        certifications: items.map((item, index) => ({ ...item, order: index })),
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            // Custom Section Actions
            addCustomSection: () => set((state) => {
                const newSection: CustomSection = {
                    id: generateId(),
                    title: 'Custom Section',
                    items: [],
                    order: state.resume.customSections.length,
                };
                const newOrder = [...state.resume.settings.sectionOrder, `custom_${newSection.id}` as SectionType];
                return {
                    resume: {
                        ...state.resume,
                        customSections: [...state.resume.customSections, newSection],
                        settings: { ...state.resume.settings, sectionOrder: newOrder },
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateCustomSectionTitle: (sectionId, title) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) =>
                        s.id === sectionId ? { ...s, title } : s
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeCustomSection: (sectionId) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.filter((s) => s.id !== sectionId),
                    settings: {
                        ...state.resume.settings,
                        sectionOrder: state.resume.settings.sectionOrder.filter((s) => s !== `custom_${sectionId}`),
                    },
                    updatedAt: new Date().toISOString(),
                },
            })),

            addCustomSectionItem: (sectionId) => set((state) => {
                const section = state.resume.customSections.find((s) => s.id === sectionId);
                const newItem: CustomSectionItem = {
                    id: generateId(),
                    title: '',
                    subtitle: '',
                    date: '',
                    description: '',
                    bullets: [],
                    order: section ? section.items.length : 0,
                };
                return {
                    resume: {
                        ...state.resume,
                        customSections: state.resume.customSections.map((s) =>
                            s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
                        ),
                        updatedAt: new Date().toISOString(),
                    },
                };
            }),

            updateCustomSectionItem: (sectionId, itemId, field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) =>
                        s.id === sectionId
                            ? { ...s, items: s.items.map((item) => item.id === itemId ? { ...item, [field]: value } : item) }
                            : s
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeCustomSectionItem: (sectionId, itemId) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) =>
                        s.id === sectionId
                            ? { ...s, items: s.items.filter((item) => item.id !== itemId) }
                            : s
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            reorderCustomSectionItems: (sectionId, fromIndex, toIndex) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) => {
                        if (s.id !== sectionId) return s;
                        const items = [...s.items];
                        const [removed] = items.splice(fromIndex, 1);
                        items.splice(toIndex, 0, removed);
                        return { ...s, items: items.map((item, idx) => ({ ...item, order: idx })) };
                    }),
                    updatedAt: new Date().toISOString(),
                },
            })),

            addCustomSectionBullet: (sectionId, itemId) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) =>
                        s.id === sectionId
                            ? { ...s, items: s.items.map((item) => item.id === itemId ? { ...item, bullets: [...item.bullets, ''] } : item) }
                            : s
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            updateCustomSectionBullet: (sectionId, itemId, bulletIndex, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) =>
                        s.id === sectionId
                            ? {
                                ...s,
                                items: s.items.map((item) =>
                                    item.id === itemId
                                        ? { ...item, bullets: item.bullets.map((b, i) => i === bulletIndex ? value : b) }
                                        : item
                                ),
                            }
                            : s
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            removeCustomSectionBullet: (sectionId, itemId, bulletIndex) => set((state) => ({
                resume: {
                    ...state.resume,
                    customSections: state.resume.customSections.map((s) =>
                        s.id === sectionId
                            ? {
                                ...s,
                                items: s.items.map((item) =>
                                    item.id === itemId
                                        ? { ...item, bullets: item.bullets.filter((_, i) => i !== bulletIndex) }
                                        : item
                                ),
                            }
                            : s
                    ),
                    updatedAt: new Date().toISOString(),
                },
            })),

            // Settings Actions
            updateSectionOrder: (order) => set((state) => ({
                resume: {
                    ...state.resume,
                    settings: { ...state.resume.settings, sectionOrder: order },
                    updatedAt: new Date().toISOString(),
                },
            })),

            updateSettings: (field, value) => set((state) => ({
                resume: {
                    ...state.resume,
                    settings: { ...state.resume.settings, [field]: value },
                    updatedAt: new Date().toISOString(),
                },
            })),

            // UI Actions
            setActiveTab: (tab) => set({ activeTab: tab }),
            setConstraints: (constraints) => set({ constraints }),
            setIsGeneratingPDF: (isGenerating) => set({ isGeneratingPDF: isGenerating }),
            setPreviewHtml: (html) => set({ previewHtml: html }),

            // Import
            importResume: (data) => set({ resume: { ...data, updatedAt: new Date().toISOString() } }),

            // Reset
            resetResume: () => set({ resume: createEmptyResume() }),
        }),
        {
            name: 'resume-storage',
            partialize: (state) => ({ resume: state.resume }),
        }
    )
);
