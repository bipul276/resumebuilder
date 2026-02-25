import { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';

export function ResumePreview() {
    const { resume, previewHtml, constraints, setTemplateId } = useResumeStore();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [zoom, setZoom] = useState(0.6);

    useEffect(() => {
        if (iframeRef.current && previewHtml) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(previewHtml);
                doc.close();
            }
        }
    }, [previewHtml]);

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.2));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.3));

    const getConstraintIcon = () => {
        if (!constraints) return null;
        switch (constraints.status) {
            case 'ok':
                return <CheckCircle size={16} />;
            case 'warning':
                return <AlertCircle size={16} />;
            case 'overflow':
                return <AlertTriangle size={16} />;
        }
    };

    const getConstraintText = () => {
        if (!constraints) return 'Loading preview...';
        const pages = constraints.currentPages;
        switch (constraints.status) {
            case 'ok':
                return `${pages} page${pages > 1 ? 's' : ''} - Perfect fit!`;
            case 'warning':
                return `${pages} pages - Content is getting long`;
            case 'overflow':
                return `${pages} pages - Content overflows! Please shorten.`;
        }
    };

    return (
        <div className="preview-container">
            <div className="preview-toolbar">
                <div className="preview-toolbar-left">
                    <select
                        className="template-select"
                        value={resume.templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                    >
                        <optgroup label="With Photo">
                            <option value="glance">Glance</option>
                            <option value="identity">Identity</option>
                        </optgroup>
                        <optgroup label="Popular">
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="professional">Professional</option>
                            <option value="minimal">Minimal</option>
                        </optgroup>
                        <optgroup label="Creative">
                            <option value="creative">Creative</option>
                            <option value="bold">Bold</option>
                            <option value="timeline">Timeline</option>
                        </optgroup>
                        <optgroup label="Corporate">
                            <option value="executive">Executive</option>
                            <option value="elegant">Elegant</option>
                        </optgroup>
                        <optgroup label="Specialized">
                            <option value="tech">Tech Developer</option>
                            <option value="academic">Academic/CV</option>
                            <option value="compact">Compact</option>
                            <option value="simple">Simple</option>
                        </optgroup>
                    </select>
                </div>

                <div className="zoom-controls">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={handleZoomOut}>
                        <ZoomOut size={16} />
                    </button>
                    <span className="zoom-value">{Math.round(zoom * 100)}%</span>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={handleZoomIn}>
                        <ZoomIn size={16} />
                    </button>
                </div>
            </div>

            <div
                className="preview-frame-wrapper"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    marginBottom: `${(zoom - 1) * 1123}px`,
                }}
            >
                {previewHtml ? (
                    <iframe
                        ref={iframeRef}
                        className="preview-frame"
                        title="Resume Preview"
                        sandbox="allow-same-origin allow-scripts"
                    />
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#666',
                        fontSize: '14px',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: '8px' }}>📄 Preview will appear here</p>
                            <p style={{ fontSize: '12px', opacity: 0.7 }}>
                                Start filling out your information on the left
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className={`page-indicator ${constraints?.status || ''}`}>
                {getConstraintIcon()}
                <span>{getConstraintText()}</span>
            </div>
        </div>
    );
}
