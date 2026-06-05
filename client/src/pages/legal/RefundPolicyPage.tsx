import React from 'react';
import { Link } from 'react-router-dom';

export function RefundPolicyPage() {
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
                <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>Cancellation & Refund Policy</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <div style={{ lineHeight: 1.7, color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>1. No Refunds</h2>
                    <p>Because ResumeSandbox provides immediate access to digital tools, templates, and exports, <strong>we do not provide refunds once a payment is made.</strong> All sales are final.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>2. Cancellation</h2>
                    <p>You can cancel your subscription at any time. When you cancel, you will continue to have access to your paid features until the end of your current billing cycle. After that, your account will revert to the free tier, and you will not be charged again.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>3. Payment Issues & Missing Access</h2>
                    <p>If you believe you paid but did not get access to your upgraded tier features, please reach out to our support email immediately. <strong>If your transaction is legitimate and verified, we will fix the issue and grant you the appropriate access.</strong></p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>4. Contact for Payment Support</h2>
                    <p>If you experience any issues related to billing or account upgrades, please contact us at: <a href="mailto:bipulnandan276@gmail.com" style={{ color: '#0071e3', textDecoration: 'none' }}>bipulnandan276@gmail.com</a></p>
                </div>
            </div>
        </div>
    );
}
