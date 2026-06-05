import React from 'react';
import { Link } from 'react-router-dom';

export function ContactUsPage() {
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
                <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>Contact Us</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>We're here to help.</p>
                
                <div style={{ 
                    lineHeight: 1.7, 
                    color: '#e4e4e7', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '24px',
                    backgroundColor: '#1c1c1e',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid #2c2c2e'
                }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Email Support</h2>
                        <p style={{ color: '#a1a1aa', marginBottom: '16px' }}>For technical issues, billing inquiries, or general questions, the fastest way to reach us is via email:</p>
                        <a href="mailto:bipulnandan276@gmail.com" style={{ 
                            display: 'inline-block',
                            padding: '12px 24px', 
                            backgroundColor: '#0071e3', 
                            color: '#fff', 
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 500
                        }}>bipulnandan276@gmail.com</a>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #2c2c2e' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Business Information</h2>
                        <p style={{ color: '#a1a1aa', marginBottom: '8px' }}><strong>Operating Name:</strong> ResumeSandbox</p>
                        <p style={{ color: '#a1a1aa', marginBottom: '8px' }}><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (IST)</p>
                        <p style={{ color: '#a1a1aa', fontSize: '13px', marginTop: '16px' }}>* For compliance with payment gateways, this entity is registered in India. All digital services are delivered instantly upon successful payment.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
