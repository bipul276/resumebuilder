import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    const loadGTM = () => {
        if (window.dataLayer) return; // Already loaded

        // Inject exact GTM script snippet
        const script = document.createElement('script');
        script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MVSRLF5M');`;
        document.head.appendChild(script);

        // Inject noscript into body
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-MVSRLF5M";
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
    };

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        } else if (consent === 'accepted') {
            loadGTM();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
        loadGTM();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 48px)',
            maxWidth: '600px',
            backgroundColor: '#1f1f26',
            border: '1px solid #2e2e3a',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            color: '#e4e4e7',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>We value your privacy</h3>
                <button onClick={handleDecline} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }} aria-label="Close">
                    <X size={18} />
                </button>
            </div>
            
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                We use cookies and similar tracking technologies (like Google Analytics) to improve your experience and measure site performance. 
                By clicking "Accept", you agree to our use of these technologies. (Note: Essential data like your logged-in session and local resume saves are required for the app to function and do not require consent.) Read our <Link to="/privacy" style={{ color: '#0071e3', textDecoration: 'none' }}>Privacy Policy</Link> for more details.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button 
                    onClick={handleDecline}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid #3f3f46',
                        color: '#d4d4d8',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    Decline
                </button>
                <button 
                    onClick={handleAccept}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#0071e3',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0071e3'}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
