import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PenTool, Rocket, Bot } from 'lucide-react';

// REPLACE THESE WITH YOUR ACTUAL RAZORPAY PAYMENT PAGE URLs
const RAZORPAY_PRO_LINK = 'https://rzp.io/rzp/resume-pro';
const RAZORPAY_PRO_PLUS_LINK = 'https://rzp.io/rzp/resume-plus';

export function PricingPage() {
    const { user } = useAuth();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            padding: '24px',
        }}>
            {/* Navigation */}
            <nav style={{
                maxWidth: '1200px',
                margin: '0 auto',
                marginBottom: '64px',
            }}>
                <Link to="/" style={{
                    color: '#0071e3',
                    textDecoration: 'none',
                    fontSize: '14px',
                }}>
                    ← Back to Home
                </Link>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginBottom: '16px',
                }}>
                    Choose your plan
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#a0a0a6',
                    fontSize: '21px',
                    marginBottom: '48px',
                }}>
                    {user ? `Currently on: ${user.tier.replace('_', ' ').toUpperCase()}` : 'Sign in to upgrade'}
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}>
                    {/* Free Tier */}
                    <div style={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: '24px',
                        padding: '48px',
                        border: user?.tier === 'free' ? '2px solid #30d158' : '1px solid #2c2c2e',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            opacity: 0.05,
                            transform: 'rotate(15deg)',
                        }}>
                            <PenTool size={200} />
                        </div>

                        {user?.tier === 'free' && (
                            <div style={{
                                backgroundColor: '#30d158',
                                color: '#000',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-block',
                                marginBottom: '16px',
                            }}>
                                CURRENT PLAN
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                padding: '10px',
                                backgroundColor: 'rgba(48, 209, 88, 0.1)',
                                borderRadius: '12px',
                                color: '#30d158'
                            }}>
                                <PenTool size={24} />
                            </div>
                            <div style={{ fontSize: '14px', color: '#86868b', fontWeight: 600, letterSpacing: '1px' }}>FREE</div>
                        </div>
                        <div style={{ fontSize: '56px', fontWeight: 600, marginBottom: '8px' }}>₹0</div>
                        <div style={{ color: '#86868b', marginBottom: '32px' }}>Forever free</div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                            {[
                                { text: 'All templates', included: true },
                                { text: 'Sandbox editor', included: true },
                                { text: 'PDF/DOCX export', included: true },
                                { text: 'Basic ATS score', included: true },
                                { text: 'Template exports — watermark-free', included: true },
                                { text: 'Sandbox exports — watermark-free', included: false },
                            ].map((feature, i) => (
                                <li key={i} style={{
                                    padding: '14px 0',
                                    borderBottom: '1px solid #2c2c2e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: feature.included ? '#fff' : '#86868b',
                                }}>
                                    <span style={{ color: feature.included ? '#30d158' : '#ff453a' }}>
                                        {feature.included ? '✓' : '✕'}
                                    </span>
                                    {feature.text}
                                </li>
                            ))}
                        </ul>

                        <Link to="/sandbox" style={{
                            display: 'block',
                            padding: '16px',
                            backgroundColor: '#2c2c2e',
                            color: '#fff',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            textAlign: 'center',
                            fontWeight: 500,
                            fontSize: '16px',
                        }}>
                            Continue with Free
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0071e3 0%, #00c7be 100%)',
                        borderRadius: '24px',
                        padding: '48px',
                        position: 'relative',
                        border: user?.tier === 'pro' ? '2px solid #fff' : 'none',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            opacity: 0.1,
                            transform: 'rotate(15deg)',
                            color: '#fff'
                        }}>
                            <Rocket size={200} />
                        </div>

                        <div style={{
                            position: 'absolute',
                            top: '-14px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fff',
                            color: '#0071e3',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                        }}>
                            MOST POPULAR
                        </div>
                        {user?.tier === 'pro' && (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: '#fff',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-block',
                                marginBottom: '16px',
                            }}>
                                CURRENT PLAN
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                color: '#fff'
                            }}>
                                <Rocket size={24} />
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: 600, letterSpacing: '1px' }}>PRO</div>
                        </div>

                        <div style={{ fontSize: '56px', fontWeight: 600, marginBottom: '8px' }}>₹299</div>
                        <div style={{ opacity: 0.8, marginBottom: '32px' }}>per month</div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', position: 'relative', zIndex: 1 }}>
                            {[
                                'Everything in Free',
                                'No watermark ✨',
                                'Advanced ATS tools',
                                'JD matching',
                                'Priority rendering',
                            ].map((feature, i) => (
                                <li key={i} style={{
                                    padding: '14px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    <span>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <a
                            href={user?.tier === 'pro' || user?.tier === 'pro_plus' ? '#' : RAZORPAY_PRO_LINK}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '16px',
                                backgroundColor: '#fff',
                                color: '#0071e3',
                                border: 'none',
                                borderRadius: '14px',
                                fontSize: '16px',
                                fontWeight: 600,
                                textAlign: 'center',
                                textDecoration: 'none',
                                cursor: user?.tier === 'pro' || user?.tier === 'pro_plus' ? 'default' : 'pointer',
                                opacity: user?.tier === 'pro' || user?.tier === 'pro_plus' ? 0.5 : 1,
                                position: 'relative',
                                zIndex: 1
                            }}
                            onClick={(e) => {
                                if (user?.tier === 'pro' || user?.tier === 'pro_plus') {
                                    e.preventDefault();
                                }
                            }}
                        >
                            {user?.tier === 'pro' ? 'Current Plan' :
                                user?.tier === 'pro_plus' ? 'Included in Pro+' :
                                    'Upgrade to Pro'}
                        </a>
                    </div>

                    {/* Pro+ Tier */}
                    <div style={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: '24px',
                        padding: '48px',
                        border: user?.tier === 'pro_plus' ? '2px solid #a78bfa' : '1px solid #a78bfa',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            opacity: 0.05,
                            transform: 'rotate(15deg)',
                            color: '#a78bfa'
                        }}>
                            <Bot size={200} />
                        </div>

                        {user?.tier === 'pro_plus' && (
                            <div style={{
                                backgroundColor: '#a78bfa',
                                color: '#000',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-block',
                                marginBottom: '16px',
                            }}>
                                CURRENT PLAN
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                padding: '10px',
                                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                                borderRadius: '12px',
                                color: '#a78bfa'
                            }}>
                                <Bot size={24} />
                            </div>
                            <div style={{ fontSize: '14px', color: '#a78bfa', fontWeight: 600, letterSpacing: '1px' }}>PRO+</div>
                        </div>

                        <div style={{ fontSize: '56px', fontWeight: 600, marginBottom: '8px' }}>₹499</div>
                        <div style={{ color: '#86868b', marginBottom: '32px' }}>per month</div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', position: 'relative', zIndex: 1 }}>
                            {[
                                'Everything in Pro',
                                'Custom watermark',
                                'AI writing assist',
                                'Analytics dashboard',
                                'Priority support',
                            ].map((feature, i) => (
                                <li key={i} style={{
                                    padding: '14px 0',
                                    borderBottom: '1px solid #2c2c2e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    <span style={{ color: '#a78bfa' }}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <a
                            href={user?.tier === 'pro_plus' ? '#' : RAZORPAY_PRO_PLUS_LINK}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '16px',
                                backgroundColor: '#a78bfa',
                                color: '#000',
                                border: 'none',
                                borderRadius: '14px',
                                fontSize: '16px',
                                fontWeight: 600,
                                textAlign: 'center',
                                textDecoration: 'none',
                                cursor: user?.tier === 'pro_plus' ? 'default' : 'pointer',
                                opacity: user?.tier === 'pro_plus' ? 0.5 : 1,
                                position: 'relative',
                                zIndex: 1
                            }}
                            onClick={(e) => {
                                if (user?.tier === 'pro_plus') {
                                    e.preventDefault();
                                }
                            }}
                        >
                            {user?.tier === 'pro_plus' ? 'Current Plan' :
                                'Upgrade to Pro+'}
                        </a>
                    </div>
                </div>

                {/* FAQ or additional info */}
                <div style={{
                    maxWidth: '600px',
                    margin: '80px auto 0',
                    textAlign: 'center',
                }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
                        Questions?
                    </h3>
                    <p style={{ color: '#a0a0a6', lineHeight: 1.6 }}>
                        All plans are billed monthly. Cancel anytime.
                        🔒 Payments secured by Razorpay. Your data stays private — we never share your resume.
                        Contact us at support@resumesandbox.com for help.
                    </p>
                </div>
            </div>
        </div>
    );
}
