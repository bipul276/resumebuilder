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

function ensureHttps(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
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

function renderSectionsInOrder(data: ResumeData, renderFn: (section: SectionType) => string, skipSections: SectionType[] = []): string {
  return getSectionOrder(data).filter(s => !skipSections.includes(s)).map(s => renderFn(s)).join('\n      ');
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
// GLANCE TEMPLATE
// ================================
export function renderGlanceTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const accent = settings?.primaryColor || '#0891b2';

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">Profile</div><p style="color:#475569">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
        ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><div><div class="entry-title">${escapeHtml(j.position)}</div><div class="entry-company">${escapeHtml(j.company)}</div></div><div class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</div></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
        ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><div><div class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</div><div class="entry-company">${escapeHtml(e.institution)}</div></div><div class="entry-date">${formatDate(e.endDate)}</div></div></div>`).join('')}</div>` : '';
      case 'skills': return ''; // Skills are in the sidebar
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
        ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><div class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}${(p.githubUrl || p.liveUrl) ? `<span style="font-size: 0.85em; margin-left: 8px; font-weight: normal;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#d1d5db; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</span>` : ''}</div>${p.description ? `<p style="color:#475569;margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:${accent}}
    html,body{width:210mm;min-height:297mm;font-family:'Outfit',sans-serif;font-size:10pt;line-height:1.6;color:#333;background:#fff}
    @page{size:A4;margin:0}
    .container{display:grid;grid-template-columns:80mm 1fr;min-height:297mm}
    .sidebar{background:#f8fafc;padding:${getMarginStyle(settings?.margin, 20)};border-right:1px solid #e2e8f0;display:flex;flex-direction:column;align-items:center;text-align:center}
    .main{padding:${getMarginStyle(settings?.margin, 20)}}
    .photo{width:140px;height:140px;border-radius:50%;object-fit:cover;margin-bottom:20px;border:4px solid #fff;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
    .name{font-size:24pt;font-weight:700;line-height:1.2;margin-bottom:8px;color:#1e293b}
    .title{font-size:11pt;color:var(--accent);font-weight:500;margin-bottom:24px;text-transform:uppercase;letter-spacing:1px}
    .contact-item{font-size:9.5pt;color:#64748b;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:6px}
    .sidebar-section{width:100%;text-align:left;margin-top:32px}
    .sidebar-title{font-size:10pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1e293b;border-bottom:2px solid var(--accent);padding-bottom:4px;margin-bottom:12px}
    .skill-tag{display:inline-block;background:#fff;border:1px solid #e2e8f0;padding:4px 10px;border-radius:20px;font-size:9pt;margin:0 4px 6px 0;color:#475569}
    .section{margin-bottom:28px}
    .section-title{font-size:14pt;font-weight:700;color:#1e293b;margin-bottom:16px;display:flex;align-items:center;gap:10px}
    .section-title::after{content:'';flex:1;height:1px;background:#e2e8f0}
    .entry{margin-bottom:20px}
    .entry-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
    .entry-title{font-weight:600;font-size:11pt;color:#1e293b}
    .entry-company{color:var(--accent);font-weight:500}
    .entry-date{font-size:9pt;color:#94a3b8}
    .bullets{margin-left:16px;color:#475569}
    .bullets li{margin-bottom:4px}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <div class="container">
    <aside class="sidebar">
      ${personalInfo.photo ? `<img src="${personalInfo.photo}" class="photo" alt="Profile">` : '<div class="photo" style="background:#e2e8f0;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:32pt">?</div>'}
      <h1 class="name">${escapeHtml(fullName)}</h1>
      ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
      
      <div style="width:100%">
        ${personalInfo.email ? `<div class="contact-item">✉️ ${escapeHtml(personalInfo.email)}</div>` : ''}
        ${personalInfo.phone ? `<div class="contact-item">📱 ${escapeHtml(personalInfo.phone)}</div>` : ''}
        ${personalInfo.location ? `<div class="contact-item">📍 ${escapeHtml(personalInfo.location)}</div>` : ''}
        ${personalInfo.linkedIn ? `<div class="contact-item">🔗 <a href="${escapeHtml(ensureHttps(personalInfo.linkedIn))}" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a></div>` : ''}
        ${personalInfo.github ? `<div class="contact-item">💻 <a href="${escapeHtml(ensureHttps(personalInfo.github))}" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a></div>` : ''}
        ${personalInfo.portfolio ? `<div class="contact-item">🌐 <a href="${escapeHtml(ensureHttps(personalInfo.portfolio))}" style="color:inherit;text-decoration:none">${(settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a></div>` : ''}
      </div>

      ${skills.length > 0 ? `<div class="sidebar-section"><div class="sidebar-title">Skills</div>
        <div>${skills.map((s: Skill) => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}</div></div>` : ''}
    </aside>
    <main class="main">
      ${renderSectionsInOrder(data, renderSection)}
    </main>
  </div></body></html>`;
}

// ================================
// IDENTITY TEMPLATE
// ================================
export function renderIdentityTemplate(data: ResumeData): string {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;
  const settings = data.settings;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const accent = settings?.primaryColor || '#2563eb';

  const renderSection = (section: SectionType): string => {
    switch (section) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">About</div><p style="color:#4b5563">${escapeHtml(summary)}</p></div>` : '';
      case 'workExperience': return workExperience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>
    ${workExperience.sort((a, b) => a.order - b.order).map((j: WorkExperience) => `<div class="entry"><div class="entry-header"><div><span class="entry-title">${escapeHtml(j.position)}</span> <span class="entry-company">at ${escapeHtml(j.company)}</span></div><span class="entry-date">${formatDate(j.startDate)} – ${j.isCurrentRole ? 'Present' : formatDate(j.endDate)}</span></div>${j.bullets.filter((b: string) => b.trim()).length > 0 ? `<ul class="bullets">${j.bullets.filter((b: string) => b.trim()).map((b: string) => `<li>${parseMarkdownLinks(escapeHtml(b))}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : '';
      case 'education': return education.length > 0 ? `<div class="section"><div class="section-title">Education</div>
    ${education.sort((a, b) => a.order - b.order).map((e: Education) => `<div class="entry"><div class="entry-header"><span class="entry-title">${escapeHtml(e.degree)}${e.field ? ` in ${escapeHtml(e.field)}` : ''}</span><span class="entry-date">${formatDate(e.endDate)}</span></div><div class="entry-company">${escapeHtml(e.institution)}</div></div>`).join('')}</div>` : '';
      case 'skills': return skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map((s: Skill) => `<span class="skill">${escapeHtml(s.name)}</span>`).join('')}</div></div>` : '';
      case 'projects': return projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>
    ${projects.sort((a, b) => a.order - b.order).map((p: Project) => `<div class="entry"><span class="entry-title">${p.url && !p.githubUrl && !p.liveUrl ? `<a href="${escapeHtml(p.url)}" target="_blank" style="color:inherit;text-decoration:none">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</span>${(p.githubUrl || p.liveUrl) ? `<span style="font-size: 0.9em; margin-left: 8px;">${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.githubUrl.replace(/^https?:\/\//, '')) : 'GitHub'}</a>` : ''}${p.githubUrl && p.liveUrl ? `<span style="color:#d1d5db; margin:0 4px;">|</span>` : ''}${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color:var(--accent); text-decoration: none;">${data.settings?.useFullUrls ? escapeHtml(p.liveUrl.replace(/^https?:\/\//, '')) : 'Live Demo'}</a>` : ''}</span>` : ''}${p.description ? `<p style="color:#4b5563;margin-top:4px">${formatDescription(p.description)}</p>` : ''}</div>`).join('')}</div>` : '';
      case 'certifications': return renderCertificationsHtml(data);
      default:
        if (typeof section === 'string' && section.startsWith('custom_')) return renderCustomSectionHtml(data, section);
        return '';
    }
  };

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><title>${escapeHtml(fullName)} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:${accent}}
    html,body{width:210mm;min-height:297mm;font-family:'Manrope',sans-serif;font-size:10pt;line-height:1.5;color:#1f2937;background:#fff;padding:${getMarginStyle(settings?.margin, 20)}}
    @page{size:A4;margin:0}
    .header{display:flex;align-items:center;gap:24px;margin-bottom:32px;border-bottom:2px solid #f3f4f6;padding-bottom:24px}
    .photo{width:100px;height:100px;border-radius:12px;object-fit:cover;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
    .header-info{flex:1}
    .name{font-size:28pt;font-weight:800;color:#111827;line-height:1.1;margin-bottom:4px}
    .title{font-size:12pt;color:var(--accent);font-weight:600}
    .contact{margin-top:12px;display:flex;flex-wrap:wrap;gap:12px;font-size:9.5pt;color:#6b7280}
    .section{margin-bottom:24px}
    .section-title{font-size:12pt;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
    .section-title::before{content:'';width:24px;height:4px;background:var(--accent);border-radius:2px}
    .entry{margin-bottom:16px}
    .entry-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px}
    .entry-title{font-weight:700;font-size:11pt;color:#111827}
    .entry-company{color:#4b5563;font-weight:500}
    .entry-date{font-size:9pt;color:#6b7280;font-weight:600}
    .bullets{margin-left:16px;color:#4b5563}
    .bullets li{margin-bottom:3px}
    .skills{display:flex;flex-wrap:wrap;gap:8px}
    .skill{padding:4px 12px;background:#f3f4f6;color:#374151;border-radius:6px;font-size:9pt;font-weight:600}
    @media print {
      html, body { min-height: auto; height: auto; }
      .section { break-inside: auto; }
      .entry { break-inside: avoid; }
    }
  </style></head><body>
  <header class="header">
    ${personalInfo.photo ? `<img src="${personalInfo.photo}" class="photo" alt="Profile">` : ''}
    <div class="header-info">
      <h1 class="name">${escapeHtml(fullName)}</h1>
      ${personalInfo.title ? `<div class="title">${escapeHtml(personalInfo.title)}</div>` : ''}
      <div class="contact">${[
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedIn ? `<a href="${escapeHtml(ensureHttps(personalInfo.linkedIn))}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.linkedIn)) : 'LinkedIn'}</a>` : '',
      personalInfo.github ? `<a href="${escapeHtml(ensureHttps(personalInfo.github))}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.github)) : 'GitHub'}</a>` : '',
      personalInfo.portfolio ? `<a href="${escapeHtml(ensureHttps(personalInfo.portfolio))}" style="color:inherit;text-decoration:none">${(data.settings?.useFullUrls ?? true) ? escapeHtml(formatDisplayUrl(personalInfo.portfolio)) : 'Portfolio'}</a>` : ''
    ].filter(Boolean).join(' • ')}</div>
    </div>
  </header>
  ${renderSectionsInOrder(data, renderSection)}
  </body></html>`;
}
