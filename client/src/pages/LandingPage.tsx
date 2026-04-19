import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon, ChevronDown, PenTool, Rocket, Bot } from 'lucide-react';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { SubscriptionTimer } from '../components/SubscriptionTimer';
import { ScrollBackground } from '../components/ScrollBackground';

export function LandingPage() {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'transparent',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}>
            <ScrollBackground />
            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 600 }}>
                        Resume<span style={{ color: '#81b9f2' }}>+</span><span style={{ color: '#0071e3' }}>Sandbox</span>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        <a href="#features" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>Features</a>
                        <a href="#pricing" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {/* Subscription Info */}
                                {user.tier !== 'free' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            color: user.tier === 'pro_plus' ? '#a78bfa' : '#0071e3',
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            padding: '4px 8px',
                                            backgroundColor: user.tier === 'pro_plus' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(0, 113, 227, 0.1)',
                                            borderRadius: '6px',
                                            border: `1px solid ${user.tier === 'pro_plus' ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0, 113, 227, 0.2)'}`,
                                            textTransform: 'uppercase'
                                        }}>
                                            {user.tier.replace('_', '+')}
                                        </span>
                                        <SubscriptionTimer />
                                    </div>
                                )}

                                <div
                                    style={{ position: 'relative' }}
                                    onMouseEnter={() => setShowUserMenu(true)}
                                    onMouseLeave={() => setShowUserMenu(false)}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                    }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: '#0071e3',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>
                                            {user.name?.split(' ')[0] || 'User'}
                                        </span>
                                        <ChevronDown size={14} color="#a1a1aa" />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            width: '200px',
                                            paddingTop: '8px', // Bridge the gap
                                            zIndex: 10,
                                        }}>
                                            <div style={{
                                                backgroundColor: '#1c1c1e',
                                                border: '1px solid #2c2c2e',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                                overflow: 'hidden',
                                                padding: '4px',
                                            }}>
                                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #2c2c2e', marginBottom: '4px' }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{user.name || 'User'}</div>
                                                    <div style={{ fontSize: '10px', color: '#a1a1aa' }}>{user.email}</div>
                                                </div>

                                                <Link to="/sandbox" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '8px 12px',
                                                    color: '#fff',
                                                    textDecoration: 'none',
                                                    fontSize: '13px',
                                                    borderRadius: '6px',
                                                    transition: 'background-color 0.2s',
                                                }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <div style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#0071e3' }}>
                                                        <UserIcon size={14} color="#fff" />
                                                    </div>
                                                    Open Editor
                                                </Link>

                                                <button
                                                    onClick={logout}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '8px 12px',
                                                        color: '#ef4444',
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '13px',
                                                        cursor: 'pointer',
                                                        borderRadius: '6px',
                                                        textAlign: 'left',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <LogOut size={14} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" style={{
                                padding: '8px 20px',
                                backgroundColor: '#0071e3',
                                color: '#fff',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav >

            {/* Hero Section */}
            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '120px 24px 60px',
                backgroundColor: 'transparent',
            }}>
                <h1 style={{
                    fontSize: 'clamp(48px, 10vw, 96px)',
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                }}>
                    Build resumes that<br />
                    <span style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        get you hired.
                    </span>
                </h1>
                <p style={{
                    fontSize: '24px',
                    color: '#d0d0d4',
                    maxWidth: '600px',
                    margin: '24px 0 32px',
                    lineHeight: 1.5,
                    fontWeight: 500,
                }}>
                    Beat ATS filters. Impress recruiters. <br />Land interviews faster.
                </p>

                {/* Credibility Signals */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '48px',
                }}>
                    {[
                        'ATS-friendly templates',
                        'Export: PDF + DOCX',
                        'No signup to preview',
                        'Privacy-first',
                    ].map((signal, i) => (
                        <span key={i} style={{
                            padding: '6px 14px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            fontSize: '13px',
                            color: '#e4e4e7',
                            fontWeight: 500,
                        }}>
                            {signal}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link to="/sandbox" style={{
                            padding: '18px 42px',
                            backgroundColor: '#0071e3',
                            color: '#fff',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 14px 0 rgba(0,113,227,0.39)',
                        }}>
                            Start Free
                        </Link>
                        <Link to="/templates" style={{
                            padding: '18px 36px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: 500,
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease',
                        }}>
                            View Templates
                        </Link>
                    </div>
                    <div style={{ fontSize: '13px', color: '#9a9aa2' }}>
                        No credit card required · Export: PDF + DOCX · Cancel anytime
                    </div>
                </div>
            </section>

            {/* Analytics Section (Only for logged in users) */}
            {user && <AnalyticsDashboard />}

            {/* Template Preview Strip */}
            <section style={{
                padding: '60px 24px 80px',
                backgroundColor: 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        backgroundColor: 'rgba(48, 209, 88, 0.1)',
                        border: '1px solid rgba(48, 209, 88, 0.2)',
                        borderRadius: '20px',
                        marginBottom: '24px',
                        fontSize: '13px',
                        color: '#30d158',
                        fontWeight: 600,
                    }}>
                        ✓ ATS-friendly · Recruiter-tested formatting
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '40px', color: '#fff' }}>
                        15 Professional Templates
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '16px',
                        maxWidth: '900px',
                        margin: '0 auto 32px',
                    }}>
                        {[
                            { name: 'Classic', color: '#3b82f6', file: 'classic' },
                            { name: 'Modern', color: '#8b5cf6', file: 'modern' },
                            { name: 'Tech', color: '#10b981', file: 'tech' },
                            { name: 'Executive', color: '#f59e0b', file: 'executive' },
                            { name: 'Creative', color: '#ec4899', file: 'creative' },
                            { name: 'Minimal', color: '#6366f1', file: 'minimal' },
                        ].map((tmpl, i) => (
                            <Link to="/templates" key={i} style={{
                                backgroundColor: '#1c1c1e',
                                border: '1px solid #2c2c2e',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = tmpl.color;
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = `0 8px 24px ${tmpl.color}22`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#2c2c2e';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Thumbnail image with fallback */}
                                <div style={{
                                    width: '100%',
                                    height: '160px',
                                    backgroundColor: `${tmpl.color}11`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <img
                                        src={`/templates/${tmpl.file}.png`}
                                        alt={`${tmpl.name} template`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top center',
                                        }}
                                        onError={(e) => {
                                            // Hide broken image, show fallback
                                            e.currentTarget.style.display = 'none';
                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback placeholder */}
                                    <div style={{
                                        display: 'none',
                                        position: 'absolute',
                                        inset: 0,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        backgroundColor: `${tmpl.color}11`,
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '52px',
                                            border: `2px solid ${tmpl.color}44`,
                                            borderRadius: '4px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            padding: '6px',
                                            alignItems: 'flex-start',
                                        }}>
                                            <div style={{ width: '60%', height: '2px', backgroundColor: `${tmpl.color}66`, borderRadius: '1px' }} />
                                            <div style={{ width: '100%', height: '2px', backgroundColor: `${tmpl.color}33`, borderRadius: '1px' }} />
                                            <div style={{ width: '80%', height: '2px', backgroundColor: `${tmpl.color}33`, borderRadius: '1px' }} />
                                            <div style={{ width: '100%', height: '2px', backgroundColor: `${tmpl.color}33`, borderRadius: '1px' }} />
                                        </div>
                                    </div>
                                    {/* Gradient overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '40px',
                                        background: 'linear-gradient(transparent, #1c1c1e)',
                                    }} />
                                </div>
                                {/* Label */}
                                <div style={{ padding: '10px 14px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e4e4e7' }}>{tmpl.name}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link to="/templates" style={{
                        color: '#0071e3',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                    }}>
                        View all 15 templates →
                    </Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section style={{
                padding: '56px 24px',
                backgroundColor: 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '32px',
                        textAlign: 'center',
                        position: 'relative',
                    }}>
                        {/* Progress line connecting steps */}
                        <div style={{
                            position: 'absolute',
                            top: '24px',
                            left: '15%',
                            right: '15%',
                            height: '1px',
                            borderTop: '2px dashed #2c2c2e',
                            zIndex: 0,
                        }} />
                        {[
                            { icon: '1', title: 'Start', desc: 'Pick a template or open the sandbox for total control.' },
                            { icon: '2', title: 'Customize', desc: 'Edit content with AI tools and real-time ATS scoring.' },
                            { icon: '3', title: 'Export', desc: 'Download ATS-friendly PDF or DOCX files instantly.' }
                        ].map((step, i) => (
                            <div key={i} style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#1c1c1e',
                                    color: '#fff',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    border: '1px solid #2c2c2e',
                                }}>{step.icon}</div>
                                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{step.title}</h3>
                                <p style={{ color: '#d0d0d4', lineHeight: 1.6 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{
                padding: '120px 24px',
                backgroundColor: 'transparent',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: 600,
                        textAlign: 'center',
                        marginBottom: '64px',
                    }}>
                        Create fast. Or design freely.
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                    }}>
                        {/* Templates Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                            borderRadius: '24px',
                            padding: '48px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '24px',
                            }}>📄</div>
                            <div style={{
                                color: '#30d158',
                                fontSize: '14px',
                                fontWeight: 600,
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Quick Resumes
                            </div>
                            <h3 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                                Templates
                            </h3>
                            <p style={{ color: '#b0b0b6', lineHeight: 1.6, marginBottom: '24px' }}>
                                Choose from professionally designed templates. Just fill in your details
                                and export. Perfect for quick, polished resumes.
                            </p>
                            <Link to="/templates" style={{
                                color: '#0071e3',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}>
                                Browse Templates →
                            </Link>
                        </div>

                        {/* Sandbox Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)',
                            borderRadius: '24px',
                            padding: '48px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '24px',
                            }}>🎨</div>
                            <div style={{
                                color: '#a78bfa',
                                fontSize: '14px',
                                fontWeight: 600,
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Custom Layouts
                            </div>
                            <h3 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                                Sandbox Editor
                            </h3>
                            <p style={{ color: '#b0b0b6', lineHeight: 1.6, marginBottom: '24px' }}>
                                Full creative freedom. Drag, drop, resize, and design your resume
                                pixel by pixel. Unlimited possibilities.
                            </p>
                            <Link to="/sandbox" style={{
                                color: '#a78bfa',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}>
                                Open Sandbox →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" style={{
                padding: '120px 24px',
                backgroundColor: 'transparent',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: 600,
                        textAlign: 'center',
                        marginBottom: '16px',
                    }}>
                        Upgrade when you’re landing interviews.
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        color: '#d0d0d4',
                        fontSize: '21px',
                        marginBottom: '64px',
                    }}>
                        Start free. Upgrade when you're ready.
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
                            padding: '40px',
                            border: '1px solid #2c2c2e',
                            display: 'flex',
                            flexDirection: 'column',
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

                            <div style={{
                                color: '#a1a1aa',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Trying it out
                            </div>
                            <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>FREE</div>
                            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>₹0</div>
                            <div style={{ color: '#a1a1aa', marginBottom: '32px' }}>Forever free</div>

                            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'rgba(48, 209, 88, 0.1)',
                                    borderRadius: '12px',
                                    color: '#30d158'
                                }}>
                                    <PenTool size={24} />
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Create resumes</div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                                {[
                                    'All 15 templates',
                                    'Sandbox editor (canvas)',
                                    'Template exports — watermark-free',
                                    'Sandbox exports — watermarked',
                                ].map((feature, i) => (
                                    <li key={i} style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid #2c2c2e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#d4d4d8',
                                    }}>
                                        <span style={{ color: '#30d158' }}>✓</span>
                                        {feature}
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
                                fontWeight: 600,
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                Start Free
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0071e3 0%, #00c7be 100%)',
                            borderRadius: '24px',
                            padding: '40px',
                            position: 'relative',
                            transform: 'scale(1.05)',
                            boxShadow: '0 20px 40px -10px rgba(0,113,227,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1,
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
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                            }}>
                                MOST POPULAR
                            </div>
                            <div style={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '14px',
                                fontWeight: 600,
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Active Job Seekers
                            </div>
                            <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>PRO</div>
                            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>₹299</div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>per month</div>

                            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}>
                                    <Rocket size={24} />
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Advanced ATS optimization</div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1, position: 'relative', zIndex: 1 }}>
                                {[
                                    'No watermark',
                                    'JD matching',
                                    'Priority rendering',
                                ].map((feature, i) => (
                                    <li key={i} style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#fff',
                                    }}>
                                        <span>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/pricing" style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: '#fff',
                                color: '#0071e3',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                Upgrade to Pro
                            </Link>
                        </div>

                        {/* Pro+ Tier */}
                        <div style={{
                            backgroundColor: '#1c1c1e',
                            borderRadius: '24px',
                            padding: '40px',
                            border: '1px solid #a78bfa',
                            display: 'flex',
                            flexDirection: 'column',
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

                            <div style={{
                                color: '#a78bfa',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Power Users
                            </div>
                            <div style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '8px', fontWeight: 600 }}>PRO+</div>
                            <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>₹499</div>
                            <div style={{ color: '#a1a1aa', marginBottom: '32px' }}>per month</div>

                            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                                    borderRadius: '12px',
                                    color: '#a78bfa'
                                }}>
                                    <Bot size={24} />
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>AI writing + Analytics</div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                                {[
                                    'Custom watermark',
                                    'AI writing assist',
                                    'Analytics dashboard',
                                ].map((feature, i) => (
                                    <li key={i} style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid #2c2c2e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#d4d4d8',
                                    }}>
                                        <span style={{ color: '#a78bfa' }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/pricing" style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: '#a78bfa',
                                color: '#000',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: 600,
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                Upgrade to Pro+
                            </Link>
                        </div>
                    </div>

                    {/* Trust signals */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '48px',
                        padding: '16px 24px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <p style={{ color: '#9a9aa2', fontSize: '13px', lineHeight: 1.8 }}>
                            🔒 Payments secured by Razorpay · Cancel anytime · Your data stays private — we never share your resume.
                        </p>
                    </div>
                </div>
            </section>

        </div >
    );
}
