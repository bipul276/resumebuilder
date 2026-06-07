import { renderTemplate } from './src/services/template-renderer';

const resume = {
  templateId: 'modern',
  personalInfo: { firstName: 'Test', lastName: 'User' },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

const templates = ['classic', 'modern', 'tech', 'executive', 'creative', 'minimal', 'compact', 'professional', 'elegant', 'bold', 'simple', 'academic', 'timeline', 'glance', 'identity'];

templates.forEach(t => {
  try {
    resume.templateId = t;
    const html = renderTemplate(resume as any);
    console.log(t + ' OK');
  } catch(e: any) {
    console.log(t + ' ERROR: ' + e.message);
  }
});
