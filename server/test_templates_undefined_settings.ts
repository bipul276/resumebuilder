import { renderTemplate } from './src/services/template-renderer';

const resume = {
  templateId: 'tech',
  personalInfo: { firstName: 'Test', lastName: 'User' },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
  // No settings object at all!
};

try {
  const html = renderTemplate(resume as any);
  console.log('tech OK');
} catch(e: any) {
  console.log('tech ERROR: ' + e.message);
}
