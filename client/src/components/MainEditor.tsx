import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Download, FileText, RotateCcw, Sparkles, Save, Upload, Palette, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useResumeStore } from '../stores/useResumeStore';
import { PersonalInfoForm } from './editor/PersonalInfoForm';
import { WorkExperienceForm } from './editor/WorkExperienceForm';
import { EducationForm } from './editor/EducationForm';
import { SkillsForm } from './editor/SkillsForm';
import { ProjectsForm } from './editor/ProjectsForm';
import { CertificationsForm } from './editor/CertificationsForm';
import { CustomSectionsForm } from './editor/CustomSectionsForm';
import { ATSChecker } from './editor/ATSChecker';
import { SettingsForm } from './editor/SettingsForm';
import { ResumePreview } from './preview/ResumePreview';
import { Link } from 'react-router-dom';
import { SubscriptionTimer } from './SubscriptionTimer';

const TABS = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'custom', label: '✏️ Custom' },
    { id: 'settings', label: '⚙️ Settings' },
    { id: 'ats', label: '🎯 ATS Check' },
];

export function MainEditor() {
    const {
        resume,
        activeTab,
        setActiveTab,
        isGeneratingPDF,
        setIsGeneratingPDF,
        constraints,
        resetResume,
    } = useResumeStore();

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updatePreview = useCallback(async () => {
        try {
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: resume }),
            });

            if (response.ok) {
                const data = await response.json();
                useResumeStore.getState().setPreviewHtml(data.html);
                useResumeStore.getState().setConstraints(data.constraints);
            }
        } catch (error) {
            console.error('Preview update failed:', error);
        }
    }, [resume]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(updatePreview, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [resume, updatePreview]);

    // Track view on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Use a timeout to avoid double-tracking in strict mode if possible, 
            // or just accept it for now.
            axios.post('/api/analytics/track', {
                event_type: 'view',
                metadata: { page: 'editor', source: 'main_editor' }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => console.error('Failed to track view:', err));
        }
    }, []);

    const handleDownloadPDF = async () => {
        if (constraints?.status === 'overflow') {
            toast.error('Please fix layout issues before downloading');
            return;
        }

        setIsGeneratingPDF(true);

        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: resume }),
            });

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // Response wasn't JSON
                }
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            if (blob.size === 0) {
                toast.success('PDF download initiated!');
                return;
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resume.personalInfo.firstName || 'resume'}_resume.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('PDF downloaded successfully!');

            // Track download
            const token = localStorage.getItem('token');
            if (token) {
                axios.post('/api/analytics/track', {
                    event_type: 'download',
                    metadata: { type: 'resume_pdf', source: 'editor' }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => console.error('Failed to track download:', err));
            }

        } catch (error) {
            console.error('PDF download failed:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to generate PDF: ${message}`);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset your resume? This cannot be undone.')) {
            resetResume();
            toast.success('Resume reset to blank');
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(resume, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.personalInfo.firstName || 'resume'}_data.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Resume data exported successfully!');

        // Track copy (export json)
        const token = localStorage.getItem('token');
        if (token) {
            axios.post('/api/analytics/track', {
                event_type: 'copy',
                metadata: { type: 'json_export', source: 'editor' }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => console.error('Failed to track copy:', err));
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                if (!data.personalInfo || !data.workExperience) {
                    throw new Error('Invalid resume data format');
                }

                useResumeStore.getState().importResume(data);
                toast.success('Resume data imported successfully!');
            } catch (error) {
                console.error('Import failed:', error);
                toast.error('Failed to import: Invalid file format');
            }
        };
        input.click();
    };

    const tabContent = useMemo(() => {
        switch (activeTab) {
            case 'personal':
                return <PersonalInfoForm />;
            case 'experience':
                return <WorkExperienceForm />;
            case 'education':
                return <EducationForm />;
            case 'skills':
                return <SkillsForm />;
            case 'projects':
                return <ProjectsForm />;
            case 'certifications':
                return <CertificationsForm />;
            case 'custom':
                return <CustomSectionsForm />;
            case 'settings':
                return <SettingsForm />;
            case 'ats':
                return <ATSChecker />;
            default:
                return <PersonalInfoForm />;
        }
    }, [activeTab]);

    return (
        <div className="app-container">
            <header className="header">
                <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/" className="btn btn-ghost" style={{ padding: '8px' }} title="Back to Home">
                        <ChevronLeft size={20} />
                    </Link>
                    <FileText size={28} />
                    <h1>Resume Builder</h1>
                    <SubscriptionTimer />
                </div>

                <div className="header-actions">
                    <Link to="/sandbox" className="btn btn-ghost" title="Try the new Sandbox Editor" style={{ color: '#8b5cf6', fontWeight: 600 }}>
                        <Palette size={18} />
                        Sandbox
                    </Link>

                    <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 8px' }}></div>

                    {/* File Operations Group - Simplified visual grouping */}
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                        <button className="btn btn-ghost" onClick={handleImport} title="Load resume data" style={{ fontSize: '13px' }}>
                            <Upload size={16} />
                            Load
                        </button>
                        <button className="btn btn-ghost" onClick={handleExport} title="Save resume data" style={{ fontSize: '13px' }}>
                            <Save size={16} />
                            Save
                        </button>
                        <button className="btn btn-ghost" onClick={handleReset} style={{ fontSize: '13px' }}>
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 8px' }}></div>

                    <button
                        className="btn btn-primary"
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF || constraints?.status === 'overflow'}
                        style={{ padding: '10px 24px', fontWeight: 600 }}
                    >
                        {isGeneratingPDF ? (
                            <>
                                <Sparkles size={18} className="animate-pulse" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="editor-pane">
                    <div className="editor-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`editor-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="editor-content">
                        {tabContent}
                    </div>
                </div>

                <div className="preview-pane">
                    <ResumePreview />
                </div>
            </main>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#1f1f26',
                        color: '#f4f4f5',
                        border: '1px solid #2e2e3a',
                    },
                }}
            />
        </div>
    );
}
