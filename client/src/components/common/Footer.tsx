import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer style={{
            padding: '60px 24px',
            borderTop: '1px solid #3f3f46',
            backgroundColor: '#0a0a0a',
            color: '#a1a1aa'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px'
            }}>
                <div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
                        Resume<span style={{ color: '#81b9f2' }}>+</span><span style={{ color: '#0071e3' }}>Sandbox</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
                        Build resumes that get you hired. Beat ATS filters, impress recruiters, and land interviews faster.
                    </p>
                </div>
                <div>
                    <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '16px' }}>Legal & Compliance</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/privacy" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>Privacy Policy</Link></li>
                        <li><Link to="/terms" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>Terms of Service</Link></li>
                        <li><Link to="/refund" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>Cancellation & Refund Policy</Link></li>
                        <li><Link to="/compliance" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>EU Compliance & GDPR</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '16px' }}>Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/contact" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>Contact Us</Link></li>
                        <li><Link to="/pricing" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>Pricing</Link></li>
                    </ul>
                </div>
            </div>
            <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '13px' }}>
                &copy; {new Date().getFullYear()} ResumeSandbox. All rights reserved.
            </div>
        </footer>
    );
}
