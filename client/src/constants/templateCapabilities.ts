
export interface TemplateCapabilities {
    skills: {
        level: boolean; // Progress bar/level indicator
    };
    projects: {
        technologies: boolean;
        url: boolean;
        description: boolean;
    };
    education: {
        gpa: boolean;
    };
    workExperience: {
        location: boolean;
    };
    personalInfo: {
        photo: boolean;
        title: boolean;
        socialIcons: boolean;
    };
    summary: boolean;
}

export const TEMPLATE_CAPABILITIES: Record<string, TemplateCapabilities> = {
    modern: {
        skills: { level: false },
        projects: { technologies: true, url: true, description: true },
        education: { gpa: true },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    classic: {
        skills: { level: false },
        projects: { technologies: true, url: true, description: true },
        education: { gpa: true },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    tech: {
        skills: { level: false },
        projects: { technologies: true, url: true, description: true },
        education: { gpa: true },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    minimal: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: false, title: false, socialIcons: true },
        summary: true
    },
    executive: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    creative: {
        skills: { level: true }, // Supports progress bars
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    compact: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: false, title: false, socialIcons: true },
        summary: true
    },
    professional: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    elegant: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    bold: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    simple: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: false, title: false, socialIcons: true },
        summary: true
    },
    academic: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: true },
        workExperience: { location: true },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    timeline: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: false, title: true, socialIcons: true },
        summary: true
    },
    glance: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: false },
        personalInfo: { photo: true, title: true, socialIcons: true },
        summary: true
    },
    identity: {
        skills: { level: false },
        projects: { technologies: false, url: true, description: true },
        education: { gpa: false },
        workExperience: { location: true },
        personalInfo: { photo: true, title: true, socialIcons: true },
        summary: true
    }
};

export function getTemplateCapabilities(templateId: string): TemplateCapabilities {
    return TEMPLATE_CAPABILITIES[templateId] || TEMPLATE_CAPABILITIES['modern'];
}
