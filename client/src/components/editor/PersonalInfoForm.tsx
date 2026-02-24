import { useResumeStore } from '../../stores/useResumeStore';
import { CONSTRAINTS } from '@resumebuilder/shared';
import { AiAssistButton } from './AiAssistButton';

export function PersonalInfoForm() {
    const { resume, updatePersonalInfo, updateSummary } = useResumeStore();
    const { personalInfo, summary } = resume;

    const summaryLength = summary?.length || 0;
    const summaryMax = CONSTRAINTS.summary.maxLength;
    const summaryStatus = summaryLength > summaryMax ? 'error' : summaryLength > summaryMax * 0.8 ? 'warning' : '';

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('File size must be less than 1MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updatePersonalInfo('photo', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fade-in">
            <div className="form-section">
                <h2 className="form-section-title">Contact Information</h2>

                <div className="form-row full">
                    <div className="form-group">
                        <label className="form-label">Profile Photo</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {personalInfo.photo && (
                                <img
                                    src={personalInfo.photo}
                                    alt="Profile"
                                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="form-input"
                                style={{ width: 'auto' }}
                            />
                            {personalInfo.photo && (
                                <button
                                    onClick={() => updatePersonalInfo('photo', '')}
                                    style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            Recommended: Square JPG or PNG, max 1MB.
                        </p>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">First Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Your Name"
                            value={personalInfo.firstName}
                            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Last Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Surname"
                            value={personalInfo.lastName}
                            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Professional Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Senior Software Engineer"
                            value={personalInfo.title || ''}
                            onChange={(e) => updatePersonalInfo('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="+91 98765 43210"
                            value={personalInfo.phone || ''}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Bangalore, India"
                            value={personalInfo.location || ''}
                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">LinkedIn</label>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="linkedin.com/in/johndoe"
                            value={personalInfo.linkedIn || ''}
                            onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">GitHub</label>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="github.com/johndoe"
                            value={personalInfo.github || ''}
                            onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row full">
                    <div className="form-group">
                        <label className="form-label">Portfolio / Website</label>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="https://johndoe.dev"
                            value={personalInfo.portfolio || ''}
                            onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h2 className="form-section-title">Professional Summary</h2>

                <div className="form-row full">
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Summary</span>
                            <AiAssistButton
                                text={summary || ''}
                                type="summary"
                                context={`${personalInfo.title} at ${personalInfo.location}`}
                                onImprove={(newText) => updateSummary(newText)}
                            />
                        </label>
                        <textarea
                            className={`form-textarea ${summaryStatus}`}
                            placeholder="A brief 2-3 sentence summary highlighting your experience and key strengths..."
                            rows={4}
                            value={summary || ''}
                            onChange={(e) => updateSummary(e.target.value)}
                        />
                        <span className={`char-count ${summaryStatus}`}>
                            {summaryLength} / {summaryMax} characters
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
