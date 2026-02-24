import type { ResumeData, WorkExperience, Education, Skill, Project, Certification, CustomSection, CustomSectionItem, SectionType } from '@resumebuilder/shared';
import { renderTechTemplate } from './tech-template.js';
import { renderMinimalTemplate, renderExecutiveTemplate, renderCreativeTemplate, renderCompactTemplate, renderProfessionalTemplate } from './templates-extra.js';
import { renderElegantTemplate, renderBoldTemplate, renderSimpleTemplate, renderAcademicTemplate, renderTimelineTemplate } from './templates-more.js';
import { renderGlanceTemplate, renderIdentityTemplate } from './templates-photo.js';

/**
 * Render resume data to HTML using the selected template
 */
export function renderTemplate(data: ResumeData): string {
  const template = data.templateId || 'modern';

  console.log(`renderTemplate called for template: ${template}`);
  console.log(`Data stats - Skills: ${data.skills?.length}, Projects: ${data.projects?.length}, Exp: ${data.workExperience?.length}`);

  switch (template) {
    case 'modern':
      return renderModernTemplate(data);
    case 'classic':
      return renderClassicTemplate(data);
    case 'tech':
      return renderTechTemplate(data);
    case 'minimal':
      return renderMinimalTemplate(data);
    case 'executive':
      return renderExecutiveTemplate(data);
    case 'creative':
      return renderCreativeTemplate(data);
    case 'compact':
      return renderCompactTemplate(data);
    case 'professional':
      return renderProfessionalTemplate(data);
    case 'elegant':
      return renderElegantTemplate(data);
    case 'bold':
      return renderBoldTemplate(data);
    case 'simple':
      return renderSimpleTemplate(data);
    case 'academic':
      return renderAcademicTemplate(data);
    case 'timeline':
      return renderTimelineTemplate(data);
    case 'glance':
      return renderGlanceTemplate(data);
    case 'identity':
      return renderIdentityTemplate(data);
    default:
      return renderModernTemplate(data);
  }
}

// Helper functions
function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDescription(str: string | undefined): string {
  if (!str) return '';
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  try {
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  } catch {
    return dateStr;
  }
}

function formatDisplayUrl(url: string | undefined): string {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

/**
 * Get section order from settings or default
 */
function getSectionOrder(data: ResumeData): SectionType[] {
  return data.settings?.sectionOrder || ['summary', 'workExperience', 'education', 'skills', 'projects', 'certifications'];
}

/**
 * Group skills by category for organized display
 */
function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

/**
 * Render a custom section by its ID
 */
function renderCustomSectionHtml(data: ResumeData, sectionKey: string): string {
  const sectionId = sectionKey.replace('custom_', '');
  const section = data.customSections?.find(s => s.id === sectionId);
  if (!section || section.items.length === 0) return '';
  return `
    <section class="section" data-section="custom-${escapeHtml(sectionId)}">
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      ${section.items.sort((a: CustomSectionItem, b: CustomSectionItem) => a.order - b.order).map((item: CustomSectionItem) => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-left">
              ${item.title ? `<span class="entry-title">${escapeHtml(item.title)}</span>` : ''}
              ${item.subtitle ? `<span class="entry-subtitle">${escapeHtml(item.subtitle)}</span>` : ''}
            </div>
            ${item.date ? `<span class="entry-date">${formatDate(item.date)}</span>` : ''}
          </div>
          ${item.description ? `<p class="entry-description">${formatDescription(item.description)}</p>` : ''}
          ${item.bullets.filter((b: string) => b.trim()).length > 0 ? `
            <ul class="bullet-list">
              ${item.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </section>
  `;
}

/**
 * Render skills section - grouped by category if categories exist
 */
function renderSkillsSection(skills: Skill[], styleClass: string = 'skills-list'): string {
  if (skills.length === 0) return '';

  const hasCategories = skills.some(s => s.category && s.category !== 'Other' && s.category !== 'Uncategorized');

  if (hasCategories) {
    const grouped = groupSkillsByCategory(skills);
    return Object.entries(grouped).map(([category, catSkills]) => `
      <div class="skill-category">
        <span class="skill-category-label">${escapeHtml(category)}:</span>
        <span class="skill-category-items">${catSkills.map(s => escapeHtml(s.name)).join(', ')}</span>
      </div>
    `).join('');
  }

  return `<div class="${styleClass}">${skills.map(s => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}</div>`;
}

/**
 * Render a single section for Classic template
 */
function renderClassicSection(sectionType: SectionType, data: ResumeData): string {
  const { summary, workExperience, education, skills, projects, certifications } = data;

  // Debug log for specific sections
  if (sectionType === 'projects') {
    console.log(`Rendering projects section. Count: ${projects?.length}`);
  }
  if (sectionType === 'workExperience') {
    console.log(`Rendering workExperience section. Count: ${workExperience?.length}`);
  }

  switch (sectionType) {
    case 'summary':
      if (!summary) return '';
      return `
        <section class="section" data-section="summary">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary-text">${escapeHtml(summary)}</p>
        </section>
      `;

    case 'workExperience':
      if (workExperience.length === 0) return '';
      return `
        <section class="section" data-section="experience">
          <h2 class="section-title">Experience</h2>
          ${workExperience.sort((a: WorkExperience, b: WorkExperience) => a.order - b.order).map((job: WorkExperience) => `
            <div class="entry">
              <div class="entry-header">
                <div class="entry-left">
                  <span class="entry-title">${escapeHtml(job.position)}</span>
                  <span class="entry-subtitle">${escapeHtml(job.company)}${job.location ? `, ${escapeHtml(job.location)}` : ''}</span>
                </div>
                <span class="entry-date">${formatDate(job.startDate)} – ${job.isCurrentRole ? 'Present' : formatDate(job.endDate)}</span>
              </div>
              ${job.bullets.filter((b: string) => b.trim()).length > 0 ? `
                <ul class="bullet-list">
                  ${job.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      `;

    case 'projects':
      if (projects.length === 0) return '';
      return `
        <section class="section" data-section="projects">
          <h2 class="section-title">Projects</h2>
          ${projects.sort((a: Project, b: Project) => a.order - b.order).map((project: Project) => `
            <div class="entry">
              <div class="entry-header">
                <div class="entry-left">
                  ${project.url ?
          `<a href="${escapeHtml(project.url)}" target="_blank" class="entry-title entry-title-link">${escapeHtml(project.name)}</a>` :
          `<span class="entry-title">${escapeHtml(project.name)}</span>`
        }
                </div>
              </div>
              ${project.description ? `<p class="entry-description">${formatDescription(project.description)}</p>` : ''}
              ${project.technologies.length > 0 ? `<p class="tech-list"><strong>Tech:</strong> ${project.technologies.map((t: string) => escapeHtml(t)).join(', ')}</p>` : ''}
            </div>
          `).join('')}
        </section>
      `;

    case 'education':
      if (education.length === 0) return '';
      return `
        <section class="section" data-section="education">
          <h2 class="section-title">Education</h2>
          ${education.sort((a: Education, b: Education) => a.order - b.order).map((edu: Education) => `
            <div class="entry">
              <div class="entry-header">
                <div class="entry-left">
                  <span class="entry-title">${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</span>
                  <span class="entry-subtitle">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</span>
                </div>
                <span class="entry-date">${edu.endDate ? formatDate(edu.endDate) : ''}</span>
              </div>
              ${edu.gpa ? `<p class="entry-description">GPA: ${escapeHtml(edu.gpa)}${edu.honors ? ` • ${escapeHtml(edu.honors)}` : ''}</p>` : ''}
            </div>
          `).join('')}
        </section>
      `;

    case 'skills':
      if (skills.length === 0) return '';
      return `
        <section class="section" data-section="skills">
          <h2 class="section-title">Skills</h2>
          ${renderSkillsSection(skills)}
        </section>
      `;

    case 'certifications':
      if (!certifications || certifications.length === 0) return '';
      return `
        <section class="section" data-section="certifications">
          <h2 class="section-title">Certifications</h2>
          ${certifications.sort((a: Certification, b: Certification) => a.order - b.order).map((cert: Certification) => `
            <div class="entry">
              <div class="entry-header">
                <div class="entry-left">
                  <span class="entry-title">${cert.url ? `<a href="${escapeHtml(cert.url)}" target="_blank" class="entry-title-link">${escapeHtml(cert.name)}</a>` : escapeHtml(cert.name)}</span>
                  <span class="entry-subtitle">${escapeHtml(cert.issuer)}${cert.credentialId ? ` • ID: ${escapeHtml(cert.credentialId)}` : ''}</span>
                </div>
                <span class="entry-date">${cert.date ? formatDate(cert.date) : ''}${cert.expiryDate ? ` – ${formatDate(cert.expiryDate)}` : ''}</span>
              </div>
            </div>
          `).join('')}
        </section>
      `;

    default:
      if (sectionType.startsWith('custom_')) return renderCustomSectionHtml(data, sectionType);
      return '';
  }
}

/**
 * Classic template - Clean single column layout
 */
function renderClassicTemplate(data: ResumeData): string {
  const { personalInfo } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const sectionOrder = getSectionOrder(data);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --primary: ${settings?.primaryColor || '#2563eb'};
      --text: #1f2937;
      --text-light: #6b7280;
      --border: #e5e7eb;
    }
    
    html, body {
      width: 100%;
      min-height: 297mm;
      font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: var(--text);
      background: #fff;
      padding: ${settings?.margin || 15}mm;
    }
    
    @page { size: A4; margin: 0; }
    @media print {
      body { padding: ${settings?.margin || 15}mm; min-height: auto; height: auto; }
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--primary);
    }
    
    .name {
      font-family: 'Merriweather', Georgia, serif;
      font-size: 24pt;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 4px;
    }
    
    .title {
      font-size: 12pt;
      color: var(--text-light);
      margin-bottom: 8px;
    }
    
    .contact {
      font-size: 10pt;
      color: var(--text-light);
    }
    
    .contact a {
      color: var(--primary);
      text-decoration: none;
    }

    .entry-title-link {
      color: var(--primary);
      text-decoration: none;
    }
    .entry-title-link:hover {
      text-decoration: underline;
    }

    /* Sections */
    .section {
      margin-bottom: 14px;
      page-break-inside: auto;
    }
    
    .section-title {
      font-family: 'Merriweather', Georgia, serif;
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--primary);
      border-bottom: 1px solid var(--border);
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    
    .summary-text {
      font-size: 10.5pt;
      color: var(--text);
      line-height: 1.5;
    }
    
    /* Entries */
    .entry {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    
    .entry:last-child { margin-bottom: 0; }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    
    .entry-left {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
    }
    
    .entry-title {
      font-weight: 700;
      font-size: 11pt;
      color: var(--text);
    }
    
    .entry-subtitle {
      font-size: 10.5pt;
      color: var(--text-light);
    }
    
    .entry-date {
      font-size: 10pt;
      color: var(--text-light);
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .entry-description {
      margin-top: 4px;
      font-size: 10pt;
      color: var(--text-light);
    }
    
    .project-link {
      font-size: 10pt;
      color: var(--primary);
      text-decoration: none;
      margin-left: 4px;
    }
    
    .tech-list {
      font-size: 10pt;
      color: var(--text-light);
      margin-top: 4px;
    }
    
    /* Bullet List */
    .bullet-list {
      margin: 4px 0 0 16px;
      padding: 0;
    }
    
    .bullet-list li {
      margin-bottom: 2px;
      font-size: 10.5pt;
      color: var(--text);
    }
    
    /* Skills */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .skill-tag {
      display: inline-block;
      font-size: 9.5pt;
      padding: 3px 10px;
      background: #f3f4f6;
      border-radius: 4px;
      color: var(--text);
    }
    
    .skill-category {
      margin-bottom: 6px;
      font-size: 10pt;
      line-height: 1.6;
    }
    
    .skill-category-label {
      font-weight: 600;
      color: var(--primary);
    }
    
    .skill-category-items {
      color: var(--text);
    }
  </style>
</head>
<body>
  <header class="header">
    <h1 class="name">${escapeHtml(fullName) || 'Your Name'}</h1>
    ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
    <div class="contact">
      ${[
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn ? `<span><a href="${escapeHtml(personalInfo.linkedIn)}" target="_blank">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a></span>` : '',
      personalInfo.github ? `<span><a href="${escapeHtml(personalInfo.github)}" target="_blank">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a></span>` : '',
      personalInfo.portfolio ? `<span><a href="${escapeHtml(personalInfo.portfolio)}" target="_blank">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a></span>` : ''
    ].filter(Boolean).join(' • ')}
    </div>
  </header>
  
  ${sectionOrder.map(section => renderClassicSection(section, data)).join('')}
</body>
</html>
`;
}

/**
 * Render a single section for Modern template
 */
function renderModernMainSection(sectionType: SectionType, data: ResumeData): string {
  const { summary, workExperience, education, projects, certifications } = data;

  switch (sectionType) {
    case 'summary':
      if (!summary) return '';
      return `
        <section class="section" data-section="summary">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary-text">${escapeHtml(summary)}</p>
        </section>
      `;

    case 'workExperience':
      if (workExperience.length === 0) return '';
      return `
        <section class="section" data-section="experience">
          <h2 class="section-title">Experience</h2>
          ${workExperience.sort((a: WorkExperience, b: WorkExperience) => a.order - b.order).map((job: WorkExperience) => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${escapeHtml(job.position)}</div>
                  <div class="entry-company">${escapeHtml(job.company)}${job.location ? ` • ${escapeHtml(job.location)}` : ''}</div>
                </div>
                <div class="entry-date">${formatDate(job.startDate)} - ${job.isCurrentRole ? 'Present' : formatDate(job.endDate)}</div>
              </div>
              ${job.bullets.filter((b: string) => b.trim()).length > 0 ? `
                <ul class="bullet-list">
                  ${job.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      `;

    case 'projects':
      if (projects.length === 0) return '';
      return `
        <section class="section" data-section="projects">
          <h2 class="section-title">Projects</h2>
          ${projects.sort((a: Project, b: Project) => a.order - b.order).map((project: Project) => `
            <div class="entry">
              <div class="entry-header">
                <div class="entry-title">
                  ${project.url ?
          `<a href="${escapeHtml(project.url)}" target="_blank" style="color: inherit; text-decoration: none;">${escapeHtml(project.name)}</a>` :
          escapeHtml(project.name)
        }
                </div>
              </div>
              ${project.description ? `<p class="summary-text" style="margin-bottom: 8px;">${formatDescription(project.description)}</p>` : ''}
              ${project.technologies.length > 0 ? `
                <div class="skills-list" style="margin-top: 8px;">
                  ${project.technologies.map((tech: string) => `<span class="skill-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </section>
      `;

    case 'education':
      if (education.length === 0) return '';
      return `
        <section class="section" data-section="education">
          <h2 class="section-title">Education</h2>
          ${education.sort((a: Education, b: Education) => a.order - b.order).map((edu: Education) => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</div>
                  <div class="entry-company">${escapeHtml(edu.institution)}${edu.location ? ` • ${escapeHtml(edu.location)}` : ''}</div>
                </div>
                <div class="entry-date">${edu.endDate ? formatDate(edu.endDate) : ''}</div>
              </div>
              ${edu.gpa ? `<div class="entry-meta">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
            </div>
          `).join('')}
        </section>
      `;

    case 'skills':
      // Skills go in sidebar for modern template
      return '';

    case 'certifications':
      if (!certifications || certifications.length === 0) return '';
      return `
        <section class="section" data-section="certifications">
          <h2 class="section-title">Certifications</h2>
          ${certifications.sort((a: Certification, b: Certification) => a.order - b.order).map((cert: Certification) => `
            <div class="entry">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${cert.url ? `<a href="${escapeHtml(cert.url)}" target="_blank" style="color: inherit; text-decoration: none;">${escapeHtml(cert.name)}</a>` : escapeHtml(cert.name)}</div>
                  <div class="entry-company">${escapeHtml(cert.issuer)}${cert.credentialId ? ` • ID: ${escapeHtml(cert.credentialId)}` : ''}</div>
                </div>
                <div class="entry-date">${cert.date ? formatDate(cert.date) : ''}${cert.expiryDate ? ` – ${formatDate(cert.expiryDate)}` : ''}</div>
              </div>
            </div>
          `).join('')}
        </section>
      `;

    default:
      if (sectionType.startsWith('custom_')) return renderCustomSectionHtml(data, sectionType);
      return '';
  }
}

/**
 * Modern template - Two column layout with sidebar
 */
function renderModernTemplate(data: ResumeData): string {
  const { personalInfo, skills } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const sectionOrder = getSectionOrder(data);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: ${settings?.primaryColor || '#2563eb'};
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --bg-primary: #ffffff;
      --bg-sidebar: #f8fafc;
      --border-color: #e5e7eb;
      --font-size-base: ${settings?.fontSize === 'small' ? '10px' : settings?.fontSize === 'large' ? '12px' : '11px'};
    }
    html, body {
      width: 210mm;
      min-height: 297mm;
      font-family: '${settings?.fontFamily || 'Inter'}', -apple-system, sans-serif;
      font-size: var(--font-size-base);
      line-height: 1.5;
      color: var(--text-primary);
      background: var(--bg-primary);
    }
    @page { size: A4; margin: 0; }
    .resume-container { display: grid; grid-template-columns: 200px 1fr; min-height: 297mm; }
    .sidebar { background: var(--bg-sidebar); padding: ${settings?.margin || 15}mm; border-right: 1px solid var(--border-color); }
    .main-content { padding: ${settings?.margin || 15}mm; }
    .header { margin-bottom: 20px; }
    .name { font-size: 2em; font-weight: 700; color: var(--primary); letter-spacing: -0.5px; margin-bottom: 4px; }
    .title { font-size: 1.2em; color: var(--text-secondary); font-weight: 400; }
    .contact-info { margin-bottom: 24px; }
    .contact-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.95em; color: var(--text-secondary); word-break: break-word; }
    .contact-item svg { width: 14px; height: 14px; flex-shrink: 0; fill: var(--primary); }
    .section { margin-bottom: 20px; page-break-inside: auto; }
    .section-title { font-size: 1.1em; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid var(--primary); }
    .sidebar .section-title { font-size: 0.95em; border-bottom: 1px solid var(--border-color); }
    .entry { margin-bottom: 16px; page-break-inside: avoid; }
    .entry:last-child { margin-bottom: 0; }
    .entry-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
    .entry-title { font-weight: 600; font-size: 1.05em; color: var(--text-primary); }
    .entry-company { color: var(--primary); font-weight: 500; }
    .entry-meta { display: flex; gap: 8px; font-size: 0.9em; color: var(--text-secondary); margin-bottom: 8px; }
    .entry-date { white-space: nowrap; font-size: 0.85em; color: var(--text-secondary); text-align: right; }
    .bullet-list { list-style: none; padding-left: 0; }
    .bullet-list li { position: relative; padding-left: 16px; margin-bottom: 4px; font-size: 0.95em; color: var(--text-secondary); }
    .bullet-list li::before { content: "•"; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { background: var(--primary); color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.85em; font-weight: 500; }
    .sidebar .skill-tag { background: transparent; color: var(--text-primary); padding: 2px 0; font-size: 0.9em; display: block; }
    .summary-text { font-size: 0.95em; color: var(--text-secondary); line-height: 1.6; }
  </style>
</head>
<body>
  <div class="resume-container">
    <aside class="sidebar">
      <div class="header">
        <h1 class="name">${escapeHtml(fullName) || 'Your Name'}</h1>
        ${personalInfo.title ? `<p class="title">${escapeHtml(personalInfo.title)}</p>` : ''}
      </div>
      <div class="contact-info">
        ${personalInfo.email ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>${escapeHtml(personalInfo.email)}</div>` : ''}
        ${personalInfo.phone ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>${escapeHtml(personalInfo.phone)}</div>` : ''}
        ${personalInfo.location ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${escapeHtml(personalInfo.location)}</div>` : ''}
        ${personalInfo.linkedIn ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg><a href="${escapeHtml(personalInfo.linkedIn)}" target="_blank" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a></div>` : ''}
        ${personalInfo.github ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg><a href="${escapeHtml(personalInfo.github)}" target="_blank" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a></div>` : ''}
      </div>
      ${skills.length > 0 ? `
        <div class="section" data-section="skills">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${skills.map((s: Skill) => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </aside>
    <main class="main-content">
      ${sectionOrder.filter(s => s !== 'skills').map(section => renderModernMainSection(section, data)).join('')}
    </main>
  </div>
</body>
</html>
`;
}
