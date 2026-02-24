import type { ResumeData, SectionType, WorkExperience, Education, Skill, Project, Certification, CustomSectionItem } from '@resumebuilder/shared';

// Helper functions
function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  try {
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  } catch { return dateStr; }
}

function formatDescription(str: string | undefined): string {
  if (!str) return '';
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function formatDisplayUrl(url: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function getSectionOrder(data: ResumeData): SectionType[] {
  return data.settings?.sectionOrder || ['summary', 'workExperience', 'education', 'skills', 'projects', 'certifications'];
}

function renderSectionsInOrder(data: ResumeData, renderFn: (section: SectionType) => string, skipSections: SectionType[] = []): string {
  return getSectionOrder(data).filter(s => !skipSections.includes(s)).map(s => renderFn(s)).join('\n  ');
}

function renderCertificationsHtml(data: ResumeData, sectionTitle: string = 'Certifications'): string {
  const certs = data.certifications;
  if (!certs || certs.length === 0) return '';
  return `<div class="section"><div class="section-title">${sectionTitle}</div>
    ${certs.sort((a: Certification, b: Certification) => a.order - b.order).map((c: Certification) => `<div class="entry"><div class="entry-header"><span><span class="entry-title">${c.url ? `<a href="${escapeHtml(c.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(c.name)}</a>` : escapeHtml(c.name)}</span> <span class="entry-company">${escapeHtml(c.issuer)}</span></span><span class="entry-date">${c.date ? formatDate(c.date) : ''}${c.expiryDate ? ` – ${formatDate(c.expiryDate)}` : ''}</span></div>${c.credentialId ? `<div style="font-size:9pt;color:#666">ID: ${escapeHtml(c.credentialId)}</div>` : ''}</div>`).join('')}</div>`;
}

function renderCustomSectionHtml(data: ResumeData, sectionKey: string): string {
  const sectionId = sectionKey.replace('custom_', '');
  const section = data.customSections?.find(s => s.id === sectionId);
  if (!section || section.items.length === 0) return '';
  return `<div class="section"><div class="section-title">${escapeHtml(section.title)}</div>
    ${section.items.sort((a: CustomSectionItem, b: CustomSectionItem) => a.order - b.order).map((item: CustomSectionItem) => `<div class="entry"><div class="entry-header"><span>${item.title ? `<span class="entry-title">${escapeHtml(item.title)}</span>` : ''}${item.subtitle ? ` <span class="entry-company">${escapeHtml(item.subtitle)}</span>` : ''}</span>${item.date ? `<span class="entry-date">${formatDate(item.date)}</span>` : ''}</div>${item.description ? `<p style="color:#555;margin-top:4px">${formatDescription(item.description)}</p>` : ''}${item.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul style="margin:4px 0 0 16px;padding:0">${item.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>`;
}

// ================================
// MINIMAL TEMPLATE
// ================================
export function renderMinimalTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">About</div><p style="color:#555">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><span><span class="entry-title">${escapeHtml(j.position)}</span> <span class="entry-company">at ${escapeHtml(j.company)}</span></span><span class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</span><span class="entry-date">${formatDate(e.endDate)}</span></div><div class="entry-company">${escapeHtml(e.institution)}</div></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join(' · ')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${p.description ? `<p style="color:#555;margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:'IBM Plex Sans',sans-serif;font-size:10.5pt;line-height:1.6;color:#333;background:#fff;padding:${data.settings?.margin || 18}mm}
    @page{size:A4;margin:0}
    .name{font-size:28pt;font-weight:300;margin-bottom:4px}
    .contact{font-size:9pt;color:#666;margin-bottom:24px}
    .section{margin-bottom:20px}
    .section-title{font-size:9pt;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:12px}
    .entry{margin-bottom:14px}
    .entry-header{display:flex;justify-content:space-between;margin-bottom:2px}
    .entry-title{font-weight:600}
    .entry-company{color:#666}
    .entry-date{font-size:9pt;color:#999}
    .bullets{margin-left:16px;color:#555}
    .bullets li{margin-bottom:2px}
    .skills{display:flex;flex-wrap:wrap;gap:8px}
    .skill{font-size:9pt;color:#666}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <h1 class="name">${escapeHtml(fullName)}</h1>
  <div class="contact">${[
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn ? `<a href="${escapeHtml(personalInfo.linkedIn)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a>` : '',
      personalInfo.github ? `<a href="${escapeHtml(personalInfo.github)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a>` : '',
      personalInfo.portfolio ? `<a href="${escapeHtml(personalInfo.portfolio)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a>` : ''
    ].filter(Boolean).join(' · ')}</div>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}

// ================================
// EXECUTIVE TEMPLATE
// ================================
export function renderExecutiveTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Executive Summary</div><p style="color:#4a5568;font-size:11pt">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Professional Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><div><span class="entry-title">${escapeHtml(j.position)}</span><br><span class="entry-company">${escapeHtml(j.company)}${j.location ? `, ${escapeHtml(j.location)}` : ''}</span></div><span class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</span><span class="entry-date">${formatDate(e.endDate)}</span></div><div class="entry-company">${escapeHtml(e.institution)}</div></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Core Competencies</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join('')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Key Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${p.description ? `<p style="color:#4a5568;margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:'Source Sans 3',sans-serif;font-size:11pt;line-height:1.5;color:#2d3748;background:#fff;padding:${data.settings?.margin || 20}mm}
    @page{size:A4;margin:0}
    .header{text-align:center;border-bottom:3px solid #1a365d;padding-bottom:20px;margin-bottom:24px}
    .name{font-family:'Playfair Display',serif;font-size:32pt;color:#1a365d;margin-bottom:8px}
    .title{font-size:14pt;color:#4a5568;margin-bottom:8px}
    .contact{font-size:10pt;color:#718096}
    .section{margin-bottom:20px}
    .section-title{font-family:'Playfair Display',serif;font-size:14pt;color:#1a365d;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px}
    .entry{margin-bottom:14px}
    .entry-header{display:flex;justify-content:space-between;margin-bottom:4px}
    .entry-title{font-weight:600;font-size:12pt;color:#2d3748}
    .entry-company{color:#4a5568}
    .entry-date{font-size:10pt;color:#718096}
    .bullets{margin-left:18px;color:#4a5568}
    .bullets li{margin-bottom:3px}
    .skills{display:flex;flex-wrap:wrap;gap:10px}
    .skill{padding:4px 12px;background:#edf2f7;border-radius:4px;font-size:10pt}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <header class="header">
    <h1 class="name">${escapeHtml(fullName)}</h1>
    ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
    <div class="contact">${[
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn ? `<a href="${escapeHtml(personalInfo.linkedIn)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a>` : '',
      personalInfo.github ? `<a href="${escapeHtml(personalInfo.github)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a>` : '',
      personalInfo.portfolio ? `<a href="${escapeHtml(personalInfo.portfolio)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a>` : ''
    ].filter(Boolean).join(' | ')}</div>
  </header>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}

// ================================
// CREATIVE TEMPLATE
// ================================
export function renderCreativeTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const accent = settings?.primaryColor || '#6366f1';

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">About Me</div><p style="color:#4b5563">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
        ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-title">${escapeHtml(j.position)}</div><div class="entry-meta">${escapeHtml(j.company)} · ${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
        ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</div><div class="entry-meta">${escapeHtml(e.institution)} · ${formatDate(e.endDate)}</div></div>`).join('')}</div>` : '';
      case 'skills': return ''; // Skills are in the sidebar
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
         ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><div class="entry-title">${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</div>${p.description ? `<p style="font-size:10pt;color:#4b5563">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:${accent}}
    html,body{width:210mm;min-height:297mm;font-family:'Poppins',sans-serif;font-size:10pt;line-height:1.6;color:#1f2937;background:#fff}
    @page{size:A4;margin:0}
    .container{display:grid;grid-template-columns:75mm 1fr;min-height:297mm}
    .sidebar{background:linear-gradient(180deg,var(--accent),#4f46e5);color:#fff;padding:${settings?.margin || 15}mm}
    .main{padding:${settings?.margin || 15}mm}
    .name{font-size:26pt;font-weight:700;margin-bottom:4px}
    .title{font-size:12pt;opacity:0.9;margin-bottom:20px}
    .contact-item{margin-bottom:8px;font-size:9pt;opacity:0.9}
    .sidebar-section{margin-top:24px}
    .sidebar-title{font-size:10pt;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;opacity:0.9}
    .skill-bar{margin-bottom:8px}
    .skill-name{font-size:9pt;margin-bottom:4px}
    .skill-level{height:4px;background:rgba(255,255,255,0.3);border-radius:2px}
    .skill-fill{height:100%;background:#fff;border-radius:2px;width:85%}
    .section{margin-bottom:24px}
    .section-title{font-size:14pt;font-weight:600;color:var(--accent);margin-bottom:14px}
    .entry{margin-bottom:16px;padding-left:16px;border-left:3px solid var(--accent)}
    .entry-title{font-weight:600;font-size:11pt}
    .entry-meta{font-size:9pt;color:#6b7280;margin-bottom:4px}
    .bullets{margin-left:16px;margin-top:6px}
    .bullets li{margin-bottom:3px;font-size:10pt;color:#4b5563}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <div class="container">
    <aside class="sidebar">
      <h1 class="name">${escapeHtml(fullName)}</h1>
      ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
      <div class="sidebar-section">
        ${personalInfo.email ? `<div class="contact-item">📧 ${escapeHtml(personalInfo.email)}</div>` : ''}
        ${personalInfo.phone ? `<div class="contact-item">📱 ${escapeHtml(personalInfo.phone)}</div>` : ''}
        ${personalInfo.location ? `<div class="contact-item">📍 ${escapeHtml(personalInfo.location)}</div>` : ''}
        ${personalInfo.linkedIn ? `<div class="contact-item">🔗 <a href="${escapeHtml(personalInfo.linkedIn)}" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a></div>` : ''}
        ${personalInfo.github ? `<div class="contact-item">💻 <a href="${escapeHtml(personalInfo.github)}" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a></div>` : ''}
        ${personalInfo.portfolio ? `<div class="contact-item">🌐 <a href="${escapeHtml(personalInfo.portfolio)}" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a></div>` : ''}
      </div>
      ${skills.length > 0 ? `<div class="sidebar-section"><div class="sidebar-title">Skills</div>
        ${skills.slice(0, 8).map((s: Skill) => `<div class="skill-bar"><div class="skill-name">${escapeHtml(s.name)}</div><div class="skill-level"><div class="skill-fill" style="width:${s.level ?? 80}%"></div></div></div>`).join('')}</div>` : ''}
    </aside>
    <main class="main">
      ${renderSectionsInOrder(data, renderSection)}
    </main>
  </div></body></html>`;
}

// ================================
// COMPACT TEMPLATE
// ================================
export function renderCompactTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Summary</div><p style="font-size:9pt">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><span><span class="entry-title">${escapeHtml(j.position)}</span> - <span class="entry-company">${escapeHtml(j.company)}</span></span><span class="entry-date">${formatDate(j.startDate)}-${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-title">${escapeHtml(e.degree)}</div><div class="entry-company">${escapeHtml(e.institution)} · ${formatDate(e.endDate)}</div></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map((s: Skill) => escapeHtml(s.name)).join(' • ')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).slice(0, 3).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span> - ${formatDescription(p.description) || ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:'Roboto',sans-serif;font-size:9pt;line-height:1.4;color:#333;background:#fff;padding:${data.settings?.margin || 10}mm}
    @page{size:A4;margin:0}
    .header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:12px}
    .name{font-size:22pt;font-weight:700}
    .contact{font-size:8pt;text-align:right;color:#555}
    .section{margin-bottom:10px}
    .section-title{font-size:10pt;font-weight:700;text-transform:uppercase;background:#f0f0f0;padding:3px 6px;margin-bottom:6px}
    .entry{margin-bottom:8px}
    .entry-header{display:flex;justify-content:space-between}
    .entry-title{font-weight:700;font-size:9.5pt}
    .entry-company{font-size:9pt;color:#555}
    .entry-date{font-size:8pt;color:#666}
    .bullets{margin-left:14px;margin-top:3px}
    .bullets li{margin-bottom:1px;font-size:8.5pt}
    .skills{font-size:8.5pt;color:#444}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <header class="header">
    <h1 class="name">${escapeHtml(fullName)}</h1>
    <div class="contact">
      ${personalInfo.email ? `${escapeHtml(personalInfo.email)}<br>` : ''}
      ${personalInfo.phone || ''}
      ${personalInfo.location ? `<br>${escapeHtml(personalInfo.location)}` : ''}
      ${personalInfo.linkedIn ? `<br><a href="${escapeHtml(personalInfo.linkedIn)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a>` : ''}
      ${personalInfo.github ? `<br><a href="${escapeHtml(personalInfo.github)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a>` : ''}
    </div>
  </header>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}

// ================================
// PROFESSIONAL TEMPLATE
// ================================
export function renderProfessionalTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Profile</div><p>${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Work Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><div><span class="entry-title">${escapeHtml(j.position)}</span><br><span class="entry-company">${escapeHtml(j.company)}</span></div><span class="entry-date">${formatDate(j.startDate)} - ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` - ${escapeHtml(e.field)}` : ''}</span><span class="entry-date">${formatDate(e.endDate)}</span></div><div class="entry-company">${escapeHtml(e.institution)}</div></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join('')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${p.description ? `<p style="color:#4b5563;margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:'Lato',sans-serif;font-size:10.5pt;line-height:1.5;color:#333;background:#fff;padding:${data.settings?.margin || 16}mm}
    @page{size:A4;margin:0}
    .name{font-size:30pt;font-weight:900;color:#1e40af;margin-bottom:4px}
    .title{font-size:12pt;color:#6b7280;margin-bottom:8px}
    .contact{font-size:10pt;color:#6b7280;margin-bottom:20px}
    .contact a{color:#1e40af;text-decoration:none}
    hr{border:none;border-top:2px solid #1e40af;margin:16px 0}
    .section{margin-bottom:18px}
    .section-title{font-size:12pt;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
    .entry{margin-bottom:14px}
    .entry-header{display:flex;justify-content:space-between;margin-bottom:2px}
    .entry-title{font-weight:700;font-size:11pt}
    .entry-company{color:#4b5563}
    .entry-date{font-size:10pt;color:#6b7280}
    .bullets{margin-left:18px}
    .bullets li{margin-bottom:3px}
    .skills{display:flex;flex-wrap:wrap;gap:8px}
    .skill{padding:4px 12px;background:#dbeafe;color:#1e40af;border-radius:4px;font-size:9pt;font-weight:700}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <h1 class="name">${escapeHtml(fullName)}</h1>
  ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
  <div class="contact">${[
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn ? `<a href="${escapeHtml(personalInfo.linkedIn)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a>` : '',
      personalInfo.github ? `<a href="${escapeHtml(personalInfo.github)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a>` : '',
      personalInfo.portfolio ? `<a href="${escapeHtml(personalInfo.portfolio)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a>` : ''
    ].filter(Boolean).join(' | ')}</div>
  <hr>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}
