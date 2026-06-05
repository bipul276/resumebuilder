import React from 'react';
import { Link } from 'react-router-dom';

export function CompliancePage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            padding: '24px',
        }}>
            <nav style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '64px', paddingTop: '24px' }}>
                <Link to="/" style={{ color: '#0071e3', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</Link>
            </nav>
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>EU Compliance & GDPR</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <div style={{ lineHeight: 1.7, color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <p>ResumeSandbox complies with the General Data Protection Regulation (GDPR) and other relevant EU data protection laws.</p>
                    
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>1. Your Data Rights</h2>
                    <p>If you are a resident of the European Economic Area (EEA), you have the following data protection rights:</p>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                        <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                        <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                        <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                        <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data.</li>
                        <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
                    </ul>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>2. Data Processors</h2>
                    <p>We use third-party services like Razorpay for payments and Google for analytics and advertising. These services act as Data Processors and have their own GDPR compliance measures.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>3. Exercising Your Rights</h2>
                    <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email:</p>
                    <p><a href="mailto:bipulnandan276@gmail.com" style={{ color: '#0071e3', textDecoration: 'none' }}>bipulnandan276@gmail.com</a></p>
                </div>
            </div>
        </div>
    );
}
