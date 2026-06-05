import React from 'react';
import { Link } from 'react-router-dom';

export function TermsOfServicePage() {
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
                <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>Terms of Service</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <div style={{ lineHeight: 1.7, color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <p>Welcome to ResumeSandbox. By accessing or using our website and services, you agree to be bound by these Terms of Service.</p>
                    
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>1. Description of Service</h2>
                    <p>ResumeSandbox provides a digital platform for creating, editing, and exporting professional resumes.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>2. User Responsibilities</h2>
                    <p>You are responsible for the content you create and input into our platform. You agree not to use the service for any illegal or unauthorized purpose.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>3. Accounts & Subscriptions</h2>
                    <p>To access premium features, you may be required to purchase a subscription. Subscriptions are billed on a recurring basis. You may cancel your subscription at any time.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>4. Local Data Storage & User Responsibility</h2>
                    <p>ResumeSandbox operates on a <strong>local-first architecture</strong>. All resume data you create is stored exclusively in your web browser's local storage. <strong>We do not maintain a copy of your resume data on our servers.</strong></p>
                    <p>You are solely responsible for:</p>
                    <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                        <li>Downloading your completed resume (PDF, DOCX, or JSON) before clearing your browser cache or cookies.</li>
                        <li>Using the JSON export feature to back up your resume data if you wish to transfer it to another device or browser.</li>
                        <li>Using the "Clear Data" button if you are on a public or shared computer to erase your local data when finished.</li>
                    </ul>
                    <p>If you clear your browser's data (cache, cookies, site data), your resume content will be <strong>permanently lost</strong> and we will be unable to recover it.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>5. Intellectual Property</h2>
                    <p>The templates, design, and software provided by ResumeSandbox are our intellectual property. You may not resell or redistribute our templates or underlying code.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>6. Limitation of Liability</h2>
                    <p>ResumeSandbox is not responsible for your job search outcomes. We provide the tools, but we do not guarantee employment or interview success. The service is provided "as is" without warranties of any kind. We are not liable for any data loss resulting from browser cache clearing or local storage deletion.</p>

                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginTop: '16px' }}>7. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
                </div>
            </div>
        </div>
    );
}
