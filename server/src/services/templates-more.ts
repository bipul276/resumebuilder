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
  return parseMarkdownLinks(escapeHtml(str)).replace(/\n/g, '<br>');
}

function parseMarkdownLinks(str: string): string {
  if (!str) return '';
  return str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">$1</a>');
}

function formatDisplayUrl(url: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

type MarginObj = { top: number; right: number; bottom: number; left: number };
function getMarginStyle(margin?: MarginObj | number, fallback: number = 20): string {
  if (typeof margin === 'object' && margin !== null) {
    return `${margin.top}mm ${margin.right}mm ${margin.bottom}mm ${margin.left}mm`;
  }
  const m = margin !== undefined && typeof margin === 'number' ? margin : fallback;
  return `${m}mm`;
}

function getSectionOrder(data: ResumeData): SectionType[] {
  return data.settings?.sectionOrder || ['summary', 'workExperience', 'education', 'skills', 'projects', 'certifications'];
}

function renderSectionsInOrder(data: ResumeData, renderFn: (section: SectionType) => string): string {
  return getSectionOrder(data).map(s => renderFn(s)).join('\n  ');
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
    ${section.items.sort((a: CustomSectionItem, b: CustomSectionItem) => a.order - b.order).map((item: CustomSectionItem) => `<div class="entry"><div class="entry-header"><span>${item.title ? `<span class="entry-title">${escapeHtml(item.title)}</span>` : ''}${item.subtitle ? ` <span class="entry-company">${escapeHtml(item.subtitle)}</span>` : ''}</span>${item.date ? `<span class="entry-date">${formatDate(item.date)}</span>` : ''}</div>${item.description ? `<p style="color:#555;margin-top:4px">${formatDescription(item.description)}</p>` : ''}${item.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul style="margin:4px 0 0 16px;padding:0">${item.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>`;
}

// ================================
// ELEGANT TEMPLATE
// ================================
export function renderElegantTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Profile</div><p style="text-align:center;color:#4b5563">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><div><span class="entry-title">${escapeHtml(j.position)}</span><br><span class="entry-company">${escapeHtml(j.company)}</span></div><span class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry" style="text-align:center"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</span><br><span class="entry-company">${escapeHtml(e.institution)}</span><span style="color:#9ca3af"> · ${formatDate(e.endDate)}</span></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Expertise</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join(' · ')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry" style="text-align:center"><span class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${(p.githubUrl || p.liveUrl) ? `<br><span style="font-size: 0.85em;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:#d4af37; text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#e5e7eb; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:#d4af37; text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</span>` : ''}${p.description ? `<p style="color:#4b5563;margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:'Montserrat',sans-serif;font-size:10pt;line-height:1.6;color:#374151;background:#fff;padding:${getMarginStyle(data.settings?.margin, 20)}}
    @page{size:A4;margin:0}
    .header{text-align:center;margin-bottom:28px}
    .name{font-family:'Cormorant Garamond',serif;font-size:36pt;font-weight:700;color:#111827;letter-spacing:3px;text-transform:uppercase}
    .title{font-size:11pt;color:#9ca3af;letter-spacing:4px;text-transform:uppercase;margin:8px 0}
    .divider{width:60px;height:2px;background:#d4af37;margin:12px auto}
    .contact{font-size:9pt;color:#6b7280}
    .section{margin-bottom:22px}
    .section-title{font-family:'Cormorant Garamond',serif;font-size:14pt;font-weight:600;color:#111827;text-align:center;margin-bottom:14px;letter-spacing:2px;text-transform:uppercase}
    .section-title::after{content:'';display:block;width:40px;height:1px;background:#d4af37;margin:6px auto 0}
    .entry{margin-bottom:14px}
    .entry-header{display:flex;justify-content:space-between;margin-bottom:4px}
    .entry-title{font-weight:600;color:#111827}
    .entry-company{color:#6b7280;font-style:italic}
    .entry-date{font-size:9pt;color:#9ca3af}
    .bullets{margin-left:16px;color:#4b5563}
    .bullets li{margin-bottom:3px}
    .skills{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
    .skill{font-size:9pt;color:#374151}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <header class="header">
    <h1 class="name">${escapeHtml(fullName)}</h1>
    ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
    <div class="divider"></div>
    <div class="contact">${[
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn ? `<a href="${escapeHtml(personalInfo.linkedIn)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a>` : '',
      personalInfo.github ? `<a href="${escapeHtml(personalInfo.github)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a>` : '',
      personalInfo.portfolio ? `<a href="${escapeHtml(personalInfo.portfolio)}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a>` : ''
    ].filter(Boolean).join(' · ')}</div>
  </header>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}

// ================================
// BOLD TEMPLATE
// ================================
export function renderBoldTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const accent = settings?.primaryColor || '#dc2626';

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">About</div><p>${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><div><span class="entry-title">${escapeHtml(j.position)}</span><br><span class="entry-company">${escapeHtml(j.company)}</span></div><span class="entry-date">${formatDate(j.startDate)} - ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join('')}</div></div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><span class="entry-title">${escapeHtml(e.degree)}</span> - ${escapeHtml(e.institution)} (${formatDate(e.endDate)})</div>`).join('')}</div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${(p.githubUrl || p.liveUrl) ? `<span style="font-size: 0.9em; margin-left: 8px;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#ccc; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</span>` : ''}${p.description ? `<p style="margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:${accent}}
    html,body{width:210mm;min-height:297mm;font-family:'Open Sans',sans-serif;font-size:10pt;line-height:1.5;color:#1f2937;background:#fff;padding:0}
    @page{size:A4;margin:0}
    .header{background:var(--accent);color:#fff;padding:${getMarginStyle(settings?.margin, 20)};margin-bottom:20px}
    .name{font-family:'Oswald',sans-serif;font-size:36pt;font-weight:700;text-transform:uppercase;letter-spacing:2px}
    .title{font-size:14pt;opacity:0.9;margin-top:4px}
    .contact{margin-top:12px;font-size:10pt;opacity:0.9}
    .main{padding:0 ${typeof settings?.margin === 'object' ? (settings.margin as any).right : (settings?.margin || 20)}mm ${typeof settings?.margin === 'object' ? (settings.margin as any).bottom : (settings?.margin || 20)}mm ${typeof settings?.margin === 'object' ? (settings.margin as any).left : (settings?.margin || 20)}mm}
    .section{margin-bottom:20px}
    .section-title{font-family:'Oswald',sans-serif;font-size:16pt;font-weight:600;text-transform:uppercase;color:var(--accent);border-bottom:3px solid var(--accent);padding-bottom:4px;margin-bottom:12px}
    .entry{margin-bottom:14px}
    .entry-header{display:flex;justify-content:space-between;margin-bottom:4px}
    .entry-title{font-weight:700;font-size:11pt;text-transform:uppercase}
    .entry-company{color:#4b5563}
    .entry-date{font-size:9pt;color:#6b7280;background:#f3f4f6;padding:2px 8px;border-radius:2px}
    .bullets{margin-left:16px}
    .bullets li{margin-bottom:3px}
    .skills{display:flex;flex-wrap:wrap;gap:8px}
    .skill{padding:6px 14px;background:var(--accent);color:#fff;font-size:9pt;font-weight:600;text-transform:uppercase}
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
  <main class="main">
  ${renderSectionsInOrder(data, renderSection)}
  </main></body></html>`;
}

// ================================
// SIMPLE TEMPLATE
// ================================
export function renderSimpleTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Summary</div><p>${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><span><span class="entry-title">${escapeHtml(j.position)}</span> - ${escapeHtml(j.company)}</span><span class="entry-date">${formatDate(j.startDate)} - ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` - ${escapeHtml(e.field)}` : ''}</span><span class="entry-date">${formatDate(e.endDate)}</span></div><div>${escapeHtml(e.institution)}</div></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><p>${skills.map((s: Skill) => escapeHtml(s.name)).join(', ')}</p></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${(p.githubUrl || p.liveUrl) ? `<span style="font-size: 0.9em; margin-left: 8px;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:#000; text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#ccc; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:#000; text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</span>` : ''}${p.description ? ` - ${formatDescription(p.description)}` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.5;color:#000;background:#fff;padding:${getMarginStyle(data.settings?.margin, 18)}}
    @page{size:A4;margin:0}
    .name{font-size:24pt;font-weight:bold;margin-bottom:4px}
    .contact{font-size:10pt;color:#444;margin-bottom:16px}
    .section{margin-bottom:16px}
    .section-title{font-size:12pt;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:4px;margin-bottom:10px}
    .entry{margin-bottom:12px}
    .entry-header{display:flex;justify-content:space-between}
    .entry-title{font-weight:bold}
    .entry-date{font-size:10pt;color:#666}
    .bullets{margin-left:20px}
    .bullets li{margin-bottom:2px}
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
    ].filter(Boolean).join(' | ')}</div>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}

// ================================
// ACADEMIC TEMPLATE
// ================================
export function renderAcademicTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Research Interests</div><p>${escapeHtml(summary)}</p></div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</span><span class="entry-date">${formatDate(e.endDate)}</span></div><div class="entry-venue">${escapeHtml(e.institution)}</div>${e.gpa ? `<div class="entry-description">GPA: ${escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}</div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Research Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(j.position)}</span><span class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div><div class="entry-venue">${escapeHtml(j.company)}</div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects &amp; Publications</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${(p.githubUrl || p.liveUrl) ? `<span style="font-size: 0.9em; margin-left: 8px; font-weight: normal;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:#555; text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#ccc; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:#555; text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</span>` : ''}${p.description ? ` - ${formatDescription(p.description)}` : ''}</div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Technical Skills</div><p>${skills.map((s: Skill) => escapeHtml(s.name)).join(', ')}</p></div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - CV</title>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:210mm;min-height:297mm;font-family:'EB Garamond',Georgia,serif;font-size:11pt;line-height:1.6;color:#1a1a1a;background:#fff;padding:${getMarginStyle(data.settings?.margin, 20)}}
    @page{size:A4;margin:0}
    .header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #333}
    .name{font-size:24pt;font-weight:700;letter-spacing:1px}
    .title{font-size:12pt;font-style:italic;color:#555;margin-top:4px}
    .contact{font-size:10pt;margin-top:8px}
    .contact a{color:#1a1a1a}
    .section{margin-bottom:20px}
    .section-title{font-size:13pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;color:#333}
    .entry{margin-bottom:12px}
    .entry-header{display:flex;justify-content:space-between}
    .entry-title{font-weight:700}
    .entry-venue{font-style:italic;color:#555}
    .entry-date{font-size:10pt;color:#666}
    .entry-description{margin-top:4px}
    .bullets{margin-left:20px;margin-top:4px}
    .bullets li{margin-bottom:2px}
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
    ].filter(Boolean).join(' • ')}</div>
  </header>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}

// ================================
// TIMELINE TEMPLATE
// ================================
export function renderTimelineTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const accent = settings?.primaryColor || '#059669';

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">About</div><p style="color:#4b5563">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div><div class="timeline">
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="timeline-entry"><div class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</div><div class="entry-title">${escapeHtml(j.position)}</div><div class="entry-company">${escapeHtml(j.company)}</div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div></div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div><div class="timeline">
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="timeline-entry"><div class="entry-date">${formatDate(e.endDate)}</div><div class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</div><div class="entry-company">${escapeHtml(e.institution)}</div></div>`).join('')}</div></div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join('')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div><div class="timeline">
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="timeline-entry"><div class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</div>${(p.githubUrl || p.liveUrl) ? `<div style="font-size: 0.85em; margin-top: 2px;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#d1d5db; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</div>` : ''}${p.description ? `<div class="entry-company">${formatDescription(p.description)}</div>` : ''}</div>`).join('')}</div></div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:${accent}}
    html,body{width:210mm;min-height:297mm;font-family:'Nunito',sans-serif;font-size:10pt;line-height:1.5;color:#374151;background:#fff;padding:${settings?.margin || 18}mm}
    @page{size:A4;margin:0}
    .header{margin-bottom:24px}
    .name{font-size:28pt;font-weight:700;color:#111827}
    .title{font-size:12pt;color:var(--accent);margin-top:2px}
    .contact{font-size:9pt;color:#6b7280;margin-top:8px}
    .section{margin-bottom:22px}
    .section-title{font-size:12pt;font-weight:700;color:#111827;margin-bottom:14px;display:flex;align-items:center;gap:8px}
    .section-title::before{content:'';width:4px;height:20px;background:var(--accent);border-radius:2px}
    .timeline{position:relative;padding-left:24px}
    .timeline::before{content:'';position:absolute;left:6px;top:0;bottom:0;width:2px;background:#e5e7eb}
    .timeline-entry{position:relative;margin-bottom:16px}
    .timeline-entry::before{content:'';position:absolute;left:-18px;top:6px;width:10px;height:10px;background:var(--accent);border-radius:50%;border:2px solid #fff}
    .entry-date{font-size:9pt;color:var(--accent);font-weight:600;margin-bottom:2px}
    .entry-title{font-weight:700;font-size:11pt;color:#111827}
    .entry-company{color:#6b7280;font-size:10pt}
    .entry-description{margin-top:6px;color:#4b5563}
    .bullets{margin-left:16px;margin-top:4px}
    .bullets li{margin-bottom:2px}
    .skills{display:flex;flex-wrap:wrap;gap:8px}
    .skill{padding:4px 10px;background:#ecfdf5;color:var(--accent);border-radius:4px;font-size:9pt;font-weight:600}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry, .timeline-entry { break-inside: avoid; }
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
    ].filter(Boolean).join(' · ')}</div>
  </header>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}
