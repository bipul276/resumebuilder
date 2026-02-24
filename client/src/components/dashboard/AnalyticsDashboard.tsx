import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Download, Copy, TrendingUp, Calendar, BarChart3, ArrowRight, Link2 } from 'lucide-react';
import { useTier } from '../../contexts/TierContext';
import { LockedFeaturePanel } from '../common/LockedFeaturePanel';
import { Link } from 'react-router-dom';

interface Stats {
    views: number;
    downloads: number;
    copies: number;
}

interface TimelineItem {
    date: string;
    event_type: string;
    count: number;
}

export function AnalyticsDashboard() {
    const { tier } = useTier();
    const [stats, setStats] = useState<Stats | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tier !== 'pro_plus') {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/analytics/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setStats(response.data.summary);
                setTimeline(response.data.timeline || []);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [tier]);

    if (tier !== 'pro_plus') {
        return (
            <div style={{ height: '80vh' }}>
                <LockedFeaturePanel feature="Analytics Dashboard" tier="Pro+" description="Track views, downloads, and engagement with your resume." />
            </div>
        );
    }

    if (loading) {
        return (
            <section style={{ padding: '60px 24px', backgroundColor: '#0a0a0a', borderBottom: '1px solid #1c1c1e' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', color: '#d0d0d4' }}>
                    Loading analytics...
                </div>
            </section>
        );
    }

    const displayStats = stats || { views: 0, downloads: 0, copies: 0 };
    const hasData = displayStats.views > 0 || displayStats.downloads > 0 || displayStats.copies > 0;

    const cards = [
        { title: 'Total Views', value: displayStats.views, icon: <Eye size={20} />, color: '#60a5fa' },
        { title: 'Downloads', value: displayStats.downloads, icon: <Download size={20} />, color: '#34d399' },
        { title: 'Copies', value: displayStats.copies, icon: <Copy size={20} />, color: '#a78bfa' },
    ];

    return (
        <section style={{ padding: '60px 24px', backgroundColor: '#0a0a0a', borderBottom: '1px solid #1c1c1e' }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                backgroundColor: '#1c1c1e',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #2c2c2e',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <TrendingUp size={24} color="#f472b6" />
                        Analytics Dashboard
                    </h3>
                    <div style={{
                        padding: '8px 16px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: '#d0d0d4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Calendar size={14} />
                        Last 7 Days
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '24px',
                    marginBottom: '48px',
                }}>
                    {cards.map((card, i) => (
                        <div key={i} style={{
                            backgroundColor: '#27272a',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #3f3f46',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ color: '#d0d0d4', fontSize: '14px', fontWeight: 500 }}>{card.title}</div>
                                <div style={{
                                    padding: '8px',
                                    borderRadius: '10px',
                                    backgroundColor: `${card.color}1a`,
                                    color: card.color,
                                }}>
                                    {card.icon}
                                </div>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                                {card.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity Chart or Empty State */}
                <div>
                    <h4 style={{ color: '#e4e4e7', marginBottom: '24px', fontSize: '16px', fontWeight: 600 }}>Activity Volume</h4>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        height: '200px',
                        gap: '12px',
                        borderBottom: '1px solid #3f3f46',
                        paddingBottom: '16px',
                    }}>
                        {timeline && timeline.length > 0 ? (
                            timeline.map((item, i) => {
                                const height = Math.min((item.count / 10) * 100, 100);
                                const color = item.event_type === 'view' ? '#60a5fa' : item.event_type === 'download' ? '#34d399' : '#a78bfa';

                                return (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '100%',
                                            maxWidth: '40px',
                                            height: `${Math.max(height, 5)}%`,
                                            backgroundColor: color,
                                            borderRadius: '4px 4px 0 0',
                                            transition: 'height 0.3s ease',
                                            opacity: 0.8,
                                        }} title={`${item.date}: ${item.count} ${item.event_type}s`} />
                                        <div style={{ fontSize: '10px', color: '#9a9aa2', transform: 'rotate(-45deg)', marginTop: '8px' }}>
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '16px',
                            }}>
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(244, 114, 182, 0.1)',
                                    color: '#f472b6',
                                }}>
                                    <BarChart3 size={32} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#e4e4e7', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                                        No activity yet
                                    </div>
                                    <div style={{ color: '#9a9aa2', fontSize: '13px', maxWidth: '300px', lineHeight: 1.5 }}>
                                        Share your resume link to start tracking views, downloads, and engagement.
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/sandbox`;
                                        navigator.clipboard.writeText(url);
                                        const btn = document.getElementById('copy-share-btn');
                                        if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy share link'; }, 2000); }
                                    }}
                                    id="copy-share-btn"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 18px',
                                        backgroundColor: '#f472b6',
                                        color: '#000',
                                        borderRadius: '20px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        marginTop: '4px',
                                        transition: 'opacity 0.2s',
                                    }}
                                >
                                    <Link2 size={14} /> Copy share link
                                </button>
                                <Link to="/sandbox" style={{
                                    color: '#9a9aa2',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    marginTop: '2px',
                                }}>
                                    or open resume editor →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
