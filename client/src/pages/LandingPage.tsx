import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResumeStore } from '../stores/useResumeStore';
import { LogOut, User as UserIcon, ChevronDown, PenTool, Rocket, Bot, Layout, Wand2, Download, FileText, Palette, Zap, Infinity as InfinityIcon, Sparkles, Check } from 'lucide-react';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { SubscriptionTimer } from '../components/SubscriptionTimer';
import { ScrollBackground } from '../components/ScrollBackground';
import { Footer } from '../components/common/Footer';

export function LandingPage() {
    const { user, logout, deleteAccount } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
    const [isAnnual, setIsAnnual] = useState(true);
    const setTemplateId = useResumeStore(state => state.setTemplateId);

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

                                                <div style={{ height: '1px', backgroundColor: '#3f3f46', margin: '4px 0' }} />

                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                                            try {
                                                                await deleteAccount();
                                                            } catch (err) {
                                                                alert("Failed to delete account. Please try again.");
                                                            }
                                                        }
                                                    }}
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
                                                    <UserIcon size={14} />
                                                    Delete Account
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
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '120px 24px 60px',
                backgroundColor: 'transparent',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '64px',
                    width: '100%',
                }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: 'clamp(40px, 6vw, 72px)',
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
                    marginBottom: '40px',
                }}>
                    {[
                        { text: 'ATS-friendly templates', color: '#30d158' },
                        { text: 'Export: PDF + DOCX', color: '#0071e3' },
                        { text: 'No signup to preview', color: '#f59e0b' },
                        { text: 'Privacy-first', color: '#a78bfa' },
                    ].map((signal, i) => (
                        <span key={i} style={{
                            padding: '6px 14px',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            borderRadius: '20px',
                            fontSize: '13px',
                            color: '#fff',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: signal.color, flexShrink: 0 }} />
                            {signal.text}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
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
                            Use Sandbox
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
                            Use Templates
                        </Link>
                    </div>
                    <div style={{ fontSize: '13px', color: '#9a9aa2', textAlign: 'center' }}>
                        No credit card required · Export: PDF + DOCX · Cancel anytime
                    </div>
                </div>
                </div>
                {/* Resume Mockup */}
                <div className="hero-mockup" style={{
                    flex: '0 0 420px',
                    position: 'relative',
                }}>
                    <div style={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                        transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                    }}>
                        {/* Window chrome */}
                        <div style={{
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            backgroundColor: '#161618',
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28c840' }} />
                            <div style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#555', fontWeight: 500 }}>ResumeSandbox — Editor</div>
                        </div>
                        {/* Resume preview */}
                        <div style={{ padding: '20px', backgroundColor: '#fff', margin: '12px', borderRadius: '6px' }}>
                            {/* Resume header */}
                            <div style={{ borderBottom: '2px solid #667eea', paddingBottom: '14px', marginBottom: '14px' }}>
                                <div style={{ width: '120px', height: '10px', backgroundColor: '#1a1a2e', borderRadius: '3px', marginBottom: '6px' }} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ width: '70px', height: '5px', backgroundColor: '#ccc', borderRadius: '3px' }} />
                                    <div style={{ width: '50px', height: '5px', backgroundColor: '#ccc', borderRadius: '3px' }} />
                                </div>
                            </div>
                            {/* Experience section */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ width: '60px', height: '7px', backgroundColor: '#667eea', borderRadius: '3px', marginBottom: '8px' }} />
                                <div style={{ width: '100px', height: '6px', backgroundColor: '#333', borderRadius: '3px', marginBottom: '5px' }} />
                                <div style={{ width: '75px', height: '4px', backgroundColor: '#999', borderRadius: '3px', marginBottom: '8px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '6px' }}>
                                    {[100, 85, 65].map((w, j) => (
                                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#667eea', flexShrink: 0 }} />
                                            <div style={{ width: `${w}%`, height: '4px', backgroundColor: '#eee', borderRadius: '2px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Skills section */}
                            <div>
                                <div style={{ width: '40px', height: '7px', backgroundColor: '#667eea', borderRadius: '3px', marginBottom: '8px' }} />
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {['50px', '65px', '45px', '55px'].map((w, j) => (
                                        <div key={j} style={{ width: w, height: '16px', backgroundColor: '#f0f0ff', border: '1px solid #667eea33', borderRadius: '8px' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* ATS Score bar */}
                        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '10px', color: '#30d158', fontWeight: 600 }}>ATS Score</span>
                                <div style={{ width: '60px', height: '3px', backgroundColor: '#2c2c2e', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg, #30d158, #28c840)', borderRadius: '2px' }} />
                                </div>
                                <span style={{ fontSize: '10px', color: '#30d158', fontWeight: 700 }}>87%</span>
                            </div>
                            <div style={{ fontSize: '9px', color: '#666', padding: '2px 6px', backgroundColor: '#2c2c2e', borderRadius: '4px' }}>PDF Ready</div>
                        </div>
                    </div>
                    {/* Floating badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-16px',
                        left: '-16px',
                        backgroundColor: '#1c1c1e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}>
                        <div className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#30d158' }} />
                        <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>Live Preview</span>
                    </div>
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
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        maxWidth: '720px',
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
                            <Link to="/templates" key={i} onClick={() => setTemplateId(tmpl.file)} style={{
                                backgroundColor: '#1c1c1e',
                                border: `1px solid ${hoveredTemplate === i ? tmpl.color : '#2c2c2e'}`,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'relative',
                                transform: hoveredTemplate === i ? 'translateY(-6px)' : 'translateY(0)',
                                boxShadow: hoveredTemplate === i ? `0 12px 28px ${tmpl.color}33` : 'none',
                            }}
                                onMouseEnter={() => setHoveredTemplate(i)}
                                onMouseLeave={() => setHoveredTemplate(null)}
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
                                    {/* Hover overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: `${tmpl.color}dd`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: hoveredTemplate === i ? 1 : 0,
                                        transition: 'opacity 0.3s ease',
                                        pointerEvents: 'none',
                                    }}>
                                        <span style={{
                                            padding: '8px 20px',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            transform: hoveredTemplate === i ? 'translateY(0)' : 'translateY(8px)',
                                            transition: 'transform 0.3s ease',
                                        }}>
                                            Use This Template
                                        </span>
                                    </div>
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
                padding: '80px 24px',
                backgroundColor: '#1a1a2e',
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: 600,
                        textAlign: 'center',
                        marginBottom: '56px',
                        color: '#fff',
                    }}>
                        3 steps to your next interview
                    </h2>
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
                            top: '32px',
                            left: '15%',
                            right: '15%',
                            height: '1px',
                            borderTop: '2px dashed rgba(255,255,255,0.12)',
                            zIndex: 0,
                        }} />
                        {[
                            { Icon: Layout, title: 'Pick a template', desc: 'Choose from 15 ATS-tested layouts or open the sandbox for full control.', color: '#3b82f6' },
                            { Icon: Wand2, title: 'Customize with AI', desc: 'Edit content with AI tools and watch your ATS score update in real time.', color: '#a78bfa' },
                            { Icon: Download, title: 'Export & apply', desc: 'Download pixel-perfect PDF or DOCX files and start applying instantly.', color: '#30d158' }
                        ].map(({ Icon, title, desc, color }, i) => (
                            <div key={i} style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                                    border: `1px solid ${color}33`,
                                    color: color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}>
                                    <Icon size={28} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#fff' }}>{title}</h3>
                                <p style={{ color: '#b0b0b6', lineHeight: 1.6, fontSize: '14px', marginBottom: '20px' }}>{desc}</p>
                                {/* Mini UI mockup */}
                                <div style={{
                                    backgroundColor: '#141428',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '10px',
                                    padding: '14px',
                                    textAlign: 'left',
                                }}>
                                    {i === 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                            {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'].map((c, j) => (
                                                <div key={j} style={{
                                                    height: '32px',
                                                    backgroundColor: `${c}18`,
                                                    border: j === 0 ? `1.5px solid ${c}` : '1px solid rgba(255,255,255,0.05)',
                                                    borderRadius: '4px',
                                                }} />
                                            ))}
                                        </div>
                                    )}
                                    {i === 1 && (
                                        <div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                                                <div style={{ width: '80%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px' }} />
                                                <div style={{ width: '60%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px' }} />
                                                <div style={{ width: '70%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px' }} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', backgroundColor: 'rgba(48, 209, 88, 0.08)', borderRadius: '6px', border: '1px solid rgba(48, 209, 88, 0.15)' }}>
                                                <span style={{ fontSize: '9px', color: '#30d158', fontWeight: 600 }}>ATS</span>
                                                <div style={{ flex: 1, height: '3px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                                                    <div style={{ width: '82%', height: '100%', backgroundColor: '#30d158', borderRadius: '2px' }} />
                                                </div>
                                                <span style={{ fontSize: '9px', color: '#30d158', fontWeight: 700 }}>82%</span>
                                            </div>
                                        </div>
                                    )}
                                    {i === 2 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'rgba(48, 209, 88, 0.08)', borderRadius: '6px', border: '1px solid rgba(48, 209, 88, 0.15)' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#30d158', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: '#fff' }}>✓</div>
                                                <span style={{ fontSize: '10px', color: '#d0d0d4' }}>resume_final.pdf</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: '#fff' }}>↓</div>
                                                <span style={{ fontSize: '10px', color: '#d0d0d4' }}>resume_final.docx</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                        {/* Templates Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.05) 0%, #111113 100%)',
                            borderRadius: '24px',
                            padding: '48px',
                            border: '1px solid rgba(48, 209, 88, 0.15)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: 'rgba(48, 209, 88, 0.1)',
                                border: '1px solid rgba(48, 209, 88, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                color: '#30d158',
                            }}><FileText size={28} /></div>
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
                                color: '#30d158',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}>
                                Browse Templates →
                            </Link>
                        </div>

                        {/* Sandbox Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, #111113 100%)',
                            borderRadius: '24px',
                            padding: '48px',
                            border: '1px solid rgba(167, 139, 250, 0.15)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: 'rgba(167, 139, 250, 0.1)',
                                border: '1px solid rgba(167, 139, 250, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                color: '#a78bfa',
                            }}><Palette size={28} /></div>
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
                        marginBottom: '40px',
                    }}>
                        Start free. Upgrade when you're ready.
                    </p>

                    {/* Billing Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
                        <span style={{ color: isAnnual ? '#a1a1aa' : '#fff', fontWeight: 500, fontSize: '15px' }}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            style={{
                                width: '56px', height: '32px', borderRadius: '16px', backgroundColor: isAnnual ? '#00c7be' : '#2c2c2e', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '4px', left: isAnnual ? '28px' : '4px', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </button>
                        <span style={{ color: isAnnual ? '#fff' : '#a1a1aa', fontWeight: 500, fontSize: '15px' }}>Annually <span style={{ color: '#00c7be', fontSize: '12px', padding: '4px 10px', backgroundColor: 'rgba(0,199,190,0.1)', borderRadius: '12px', marginLeft: '8px', fontWeight: 600 }}>Save 40%</span></span>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                        maxWidth: '1000px',
                        margin: '0 auto',
                    }}>
                        {/* Free Tier */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.05) 0%, #111113 100%)',
                            borderRadius: '24px',
                            padding: '40px',
                            border: '1px solid rgba(48, 209, 88, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                opacity: 0.03,
                                transform: 'rotate(15deg)',
                                color: '#30d158'
                            }}>
                                <Sparkles size={200} />
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
                            <div style={{ fontSize: '56px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>₹0</div>
                            <div style={{ color: '#a1a1aa', marginBottom: '32px' }}>Forever free</div>

                            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'rgba(48, 209, 88, 0.1)',
                                    borderRadius: '12px',
                                    color: '#30d158'
                                }}>
                                    <Sparkles size={24} />
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
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#d4d4d8',
                                    }}>
                                        <Check size={18} style={{ color: '#30d158' }} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/sandbox" style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: 'rgba(48, 209, 88, 0.1)',
                                color: '#30d158',
                                border: '1px solid rgba(48, 209, 88, 0.2)',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: 600,
                                position: 'relative',
                                zIndex: 1,
                                transition: 'all 0.2s',
                            }}>
                                Start Free
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(0, 199, 190, 0.1) 100%)',
                            borderRadius: '24px',
                            padding: '40px',
                            border: '1px solid rgba(0, 199, 190, 0.4)',
                            position: 'relative',
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 40px -10px rgba(0, 199, 190, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1,
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                opacity: 0.05,
                                transform: 'rotate(15deg)',
                                color: '#00c7be'
                            }}>
                                <Zap size={200} />
                            </div>

                            <div style={{
                                position: 'absolute',
                                top: '-14px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#00c7be',
                                color: '#000',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                                boxShadow: '0 0 15px rgba(0, 199, 190, 0.5)',
                            }}>
                                MOST POPULAR
                            </div>
                            <div style={{
                                color: '#00c7be',
                                fontSize: '14px',
                                fontWeight: 600,
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Active Job Seekers
                            </div>
                            <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>PRO</div>
                            <div style={{ fontSize: '56px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em', color: '#fff' }}>{isAnnual ? '₹1,999' : '₹299'}</div>
                            <div style={{ color: '#a1a1aa', marginBottom: '32px' }}>{isAnnual ? 'per year (billed annually)' : 'per month'}</div>

                            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'rgba(0, 199, 190, 0.1)',
                                    borderRadius: '12px',
                                    color: '#00c7be'
                                }}>
                                    <Zap size={24} />
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
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#d4d4d8',
                                    }}>
                                        <Check size={18} style={{ color: '#00c7be' }} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/pricing" style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: '#00c7be',
                                color: '#000',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: 700,
                                boxShadow: '0 4px 15px rgba(0, 199, 190, 0.3)',
                                position: 'relative',
                                zIndex: 1,
                                transition: 'all 0.2s',
                            }}>
                                Upgrade to Pro
                            </Link>
                        </div>

                        {/* Pro+ Tier */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(88, 28, 135, 0.1) 100%)',
                            borderRadius: '24px',
                            padding: '40px',
                            border: '1px solid rgba(139, 92, 246, 0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.2)',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                opacity: 0.05,
                                transform: 'rotate(15deg)',
                                color: '#c084fc'
                            }}>
                                <InfinityIcon size={200} />
                            </div>

                            <div style={{
                                color: '#c084fc',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                Best for: Power Users
                            </div>
                            <div style={{ fontSize: '14px', color: '#c084fc', marginBottom: '8px', fontWeight: 600 }}>PRO+</div>
                            <div style={{ fontSize: '56px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em', color: '#fff' }}>{isAnnual ? '₹3,999' : '₹499'}</div>
                            <div style={{ color: '#a1a1aa', marginBottom: '32px' }}>{isAnnual ? 'per year (billed annually)' : 'per month'}</div>

                            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'rgba(192, 132, 252, 0.15)',
                                    borderRadius: '12px',
                                    color: '#c084fc'
                                }}>
                                    <InfinityIcon size={24} />
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
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#d4d4d8',
                                    }}>
                                        <Check size={18} style={{ color: '#c084fc' }} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/pricing" style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: '#c084fc',
                                color: '#000',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: 700,
                                position: 'relative',
                                zIndex: 1,
                                transition: 'all 0.2s',
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
            
            <Footer />
        </div >
    );
}
