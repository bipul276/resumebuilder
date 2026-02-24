import type { ResumeData, SectionType, Certification, CustomSectionItem } from '@resumebuilder/shared';

/**
 * Tech template - Developer-focused with GitHub-style colors
 */
export function renderTechTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects, certifications } = data;
  const settings = data.settings;

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const sectionOrder = getSectionOrder(data);

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `
      <section class="section" data-section="summary">
        <div class="section-header">
          <span class="section-title">// about</span>
          <span class="section-line"></span>
        </div>
        <p class="summary-text">${escapeHtml(summary)}</p>
      </section>
    ` : '';
      case 'skills': return skills.length > 0 ? `
      <section class="section" data-section="skills">
        <div class="section-header">
          <span class="section-title">// tech_stack</span>
          <span class="section-line"></span>
        </div>
        <div class="skills-grid">
          ${skills.map(skill => `<span class="skill-badge">${escapeHtml(skill.name)}</span>`).join('')}
        </div>
      </section>
    ` : '';
      case 'workExperience': return workExperience.length > 0 ? `
      <section class="section" data-section="experience">
        <div class="section-header">
          <span class="section-title">// experience</span>
          <span class="section-line"></span>
        </div>
        ${workExperience.sort((a, b) => a.order - b.order).map(job => `
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${escapeHtml(job.position)}</div>
                <div class="card-subtitle">${escapeHtml(job.company)}${job.location ? ` · ${escapeHtml(job.location)}` : ''}</div>
              </div>
              <div class="card-meta">${formatDate(job.startDate)} → ${job.isCurrentRole ? 'present' : formatDate(job.endDate)}</div>
            </div>
            ${job.bullets.length > 0 ? `
              <ul class="bullets">
                ${job.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
    ` : '';
      case 'projects': return projects.length > 0 ? `
      <section class="section" data-section="projects">
        <div class="section-header">
          <span class="section-title">// projects</span>
          <span class="section-line"></span>
        </div>
        ${projects.sort((a, b) => a.order - b.order).map(project => `
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${project.url ? `<a href="${escapeHtml(project.url)}" style="color: inherit; text-decoration: none; border-bottom: 1px dashed var(--accent);">${escapeHtml(project.name)}</a>` : escapeHtml(project.name)}</div>
              </div>
            </div>
            ${project.description ? `<p style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 8px;">${escapeHtml(project.description)}</p>` : ''}
            ${project.technologies.length > 0 ? `
              <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </section>
    ` : '';
      case 'education': return education.length > 0 ? `
      <section class="section" data-section="education">
        <div class="section-header">
          <span class="section-title">// education</span>
          <span class="section-line"></span>
        </div>
        ${education.sort((a, b) => a.order - b.order).map(edu => `
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</div>
                <div class="card-subtitle">${escapeHtml(edu.institution)}</div>
              </div>
              <div class="card-meta">${edu.endDate ? formatDate(edu.endDate) : ''}</div>
            </div>
            ${edu.gpa ? `<div style="font-size: 0.85em; color: var(--text-muted);">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
          </div>
        `).join('')}
      </section>
    ` : '';
      case 'certifications': return certifications && certifications.length > 0 ? `
      <section class="section" data-section="certifications">
        <div class="section-header">
          <span class="section-title">// certifications</span>
          <span class="section-line"></span>
        </div>
        ${certifications.sort((a: Certification, b: Certification) => a.order - b.order).map((cert: Certification) => `
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${cert.url ? `<a href="${escapeHtml(cert.url)}" style="color: inherit; text-decoration: none; border-bottom: 1px dashed var(--accent);">${escapeHtml(cert.name)}</a>` : escapeHtml(cert.name)}</div>
                <div class="card-subtitle">${escapeHtml(cert.issuer)}</div>
              </div>
              <div class="card-meta">${cert.date ? formatDate(cert.date) : ''}${cert.expiryDate ? ` → ${formatDate(cert.expiryDate)}` : ''}</div>
            </div>
            ${cert.credentialId ? `<div style="font-size: 0.85em; color: var(--text-muted);">ID: ${escapeHtml(cert.credentialId)}</div>` : ''}
          </div>
        `).join('')}
      </section>
    ` : '';
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) {
          const customSecId = section.replace('custom_', '');
          const customSec = data.customSections?.find(s => s.id === customSecId);
          if (!customSec || customSec.items.length === 0) return '';
          return `
      <section class="section" data-section="custom-${escapeHtml(customSecId)}">
        <div class="section-header">
          <span class="section-title">// ${escapeHtml(customSec.title).toLowerCase()}</span>
          <span class="section-line"></span>
        </div>
        ${customSec.items.sort((a: CustomSectionItem, b: CustomSectionItem) => a.order - b.order).map((item: CustomSectionItem) => `
          <div class="card">
            <div class="card-header">
              <div>
                ${item.title ? `<div class="card-title">${escapeHtml(item.title)}</div>` : ''}
                ${item.subtitle ? `<div class="card-subtitle">${escapeHtml(item.subtitle)}</div>` : ''}
              </div>
              ${item.date ? `<div class="card-meta">${formatDate(item.date)}</div>` : ''}
            </div>
            ${item.description ? `<div style="font-size: 0.9em; color: var(--text-secondary); margin-top: 4px;">${escapeHtml(item.description)}</div>` : ''}
            ${item.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul style="margin: 4px 0 0 16px; padding: 0; color: var(--text-secondary); font-size: 0.9em;">${item.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}
      </section>
    `;
        }
        return '';
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullName)} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: #58a6ff;
      --accent-muted: #388bfd;
      --bg-canvas: #0d1117;
      --bg-primary: #161b22;
      --bg-secondary: #21262d;
      --border: #30363d;
      --text-primary: #c9d1d9;
      --text-secondary: #8b949e;
      --text-muted: #6e7681;
      --success: #3fb950;
      --font-size-base: ${settings.fontSize === 'small' ? '10px' : settings.fontSize === 'large' ? '12px' : '11px'};
    }
    
    html, body {
      width: 210mm;
      min-height: 297mm;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: var(--font-size-base);
      line-height: 1.5;
      color: var(--text-primary);
      background: var(--bg-canvas);
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    .container {
      padding: 28px;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 24px;
    }
    
    .name-section h1 {
      font-size: 2.2em;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1em;
      color: var(--accent);
    }
    
    .contact-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.9em;
      color: var(--text-secondary);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .contact-item a {
      color: var(--accent);
      text-decoration: none;
    }
    
    /* Section */
    .section {
      margin-bottom: 24px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    
    .section-icon {
      width: 20px;
      height: 20px;
      color: var(--accent);
    }
    
    .section-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1em;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: lowercase;
    }
    
    .section-line {
      flex: 1;
      height: 1px;
      background: var(--border);
    }
    
    /* Cards */
    .card {
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    
    .card-title {
      font-weight: 600;
      font-size: 1.05em;
      color: var(--text-primary);
    }
    
    .card-subtitle {
      color: var(--accent);
      font-size: 0.95em;
    }
    
    .card-meta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8em;
      color: var(--text-muted);
    }
    
    .bullets {
      list-style: none;
    }
    
    .bullets li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 6px;
      font-size: 0.95em;
      color: var(--text-secondary);
    }
    
    .bullets li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--success);
    }
    
    /* Skills Grid */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .skill-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      padding: 6px 12px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 20px;
      color: var(--text-primary);
    }
    
    /* Summary */
    .summary-text {
      font-size: 0.95em;
      color: var(--text-secondary);
      line-height: 1.6;
      padding: 14px;
      background: var(--bg-primary);
      border-left: 3px solid var(--accent);
      border-radius: 0 6px 6px 0;
    }
    
    /* Projects */
    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    
    .tech-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75em;
      padding: 3px 8px;
      background: rgba(88, 166, 255, 0.15);
      border: 1px solid var(--accent-muted);
      border-radius: 4px;
      color: var(--accent);
    }
    
    /* Page break handling */
    .section, .card {
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="name-section">
        <h1>${escapeHtml(fullName) || 'Your Name'}</h1>
        ${personalInfo.title ? `<div class="title">$ ${escapeHtml(personalInfo.title)}</div>` : ''}
      </div>
      <div class="contact-list">
        ${personalInfo.email ? `<span class="contact-item">📧 ${escapeHtml(personalInfo.email)}</span>` : ''}
        ${personalInfo.phone ? `<span class="contact-item">📱 ${escapeHtml(personalInfo.phone)}</span>` : ''}
        ${personalInfo.location ? `<span class="contact-item">📍 ${escapeHtml(personalInfo.location)}</span>` : ''}
        ${personalInfo.github ? `<span class="contact-item">🔗 <a href="https://${escapeHtml(personalInfo.github)}">${escapeHtml(personalInfo.github)}</a></span>` : ''}
        ${personalInfo.linkedIn ? `<span class="contact-item">💼 <a href="https://${escapeHtml(personalInfo.linkedIn)}">LinkedIn</a></span>` : ''}
      </div>
    </header>
    
    ${sectionOrder.map(section => renderSection(section)).join('')}
  </div>
</body>
</html>
`;
}

function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

function getSectionOrder(data: ResumeData): SectionType[] {
  return data.settings?.sectionOrder || ['summary', 'workExperience', 'education', 'skills', 'projects', 'certifications'];
}
