import React from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
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
                <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>Privacy Policy</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <div style={{ lineHeight: 1.7, color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <p>At ResumeSandbox, your privacy is our top priority. We follow a <strong>local-first architecture</strong> — your resume data never leaves your device. This Privacy Policy outlines how we collect, use, and protect your information.</p>
                    
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>1. Local-First Data Storage</h2>
                    <p><strong>We do not store your resume data on our servers.</strong> All resume content you create is saved exclusively in your browser's local storage (localStorage). When you export a PDF or DOCX, your data is sent to our server only for the duration of file generation and is immediately discarded — it is never persisted, logged, or stored.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>2. Information We Collect</h2>
                    <p>We collect minimal personal data necessary to provide you with our services:</p>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li><strong>Account Information:</strong> When you create an account, we collect your email address, name, and an encrypted password hash. This is stored securely in our database for authentication and subscription management only.</li>
                        <li><strong>Payment Records:</strong> We store payment transaction records (Razorpay payment IDs, amounts, plan type) as required by financial regulations. We do not store your credit card information.</li>
                        <li><strong>Anonymous Analytics:</strong> We track basic usage events (views, downloads, exports) using a randomly generated anonymous UUID tied to your resume — not your user account. This data cannot be linked back to your personal identity.</li>
                        <li><strong>Google Analytics & Ads:</strong> We use Google Analytics and Google Ads to understand site traffic patterns and ad performance. These are governed by Google's own privacy policies.</li>
                    </ul>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>3. How We Use Your Data</h2>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li>To authenticate your account and manage your subscription tier.</li>
                        <li>To process payments via Razorpay.</li>
                        <li>To generate PDF, DOCX, and text exports (data is processed transiently and never stored).</li>
                        <li>To track anonymous usage metrics to improve our platform.</li>
                    </ul>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>4. Third-Party Services</h2>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li><strong>Razorpay:</strong> For secure payment processing.</li>
                        <li><strong>Google Analytics & Google Ads:</strong> For tracking website traffic and ad performance.</li>
                    </ul>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>5. Data Retention</h2>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li><strong>Resume Data:</strong> Stored only in your browser. If you clear your browser cache or use the "Clear Data" button, your resume data is permanently deleted. We have no copy.</li>
                        <li><strong>Account Information:</strong> Retained for as long as your account is active.</li>
                        <li><strong>Payment Records:</strong> Retained as required by financial regulations and applicable laws.</li>
                        <li><strong>Anonymous Analytics:</strong> Retained indefinitely but cannot be linked to your identity.</li>
                    </ul>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>6. Data Security</h2>
                    <p>We implement strict security measures to ensure your data is safe. Your resume content is never transmitted to our servers for storage. We do not share any of your data with recruiters, advertisers, or any external entities.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>7. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:bipulnandan276@gmail.com" style={{ color: '#0071e3', textDecoration: 'none' }}>bipulnandan276@gmail.com</a></p>
                </div>
            </div>
        </div>
    );
}
