import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface PaymentSuccessPageProps {
    planType?: 'pro' | 'pro_plus';
}

export function PaymentSuccessPage({ planType }: PaymentSuccessPageProps) {
    const [searchParams] = useSearchParams();
    const { token, refreshUser, isLoading } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (isLoading) return;

        if (!token) {
            setStatus('error');
            setMessage('You must be logged in to verify payment. Please log in and try again.');
            return;
        }

        const verifyPayment = async () => {
            const paymentId = searchParams.get('razorpay_payment_id');
            const plan = planType || searchParams.get('plan');

            if (!paymentId || !plan) {
                setStatus('error');
                setMessage('Invalid payment details. Please contact support.');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/payment/verify-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        payment_id: paymentId,
                        plan_type: plan,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Payment successful! Your plan has been upgraded.');
                    await refreshUser();
                    setTimeout(() => {
                        navigate('/sandbox');
                    }, 3000);
                } else {
                    throw new Error(data.error || 'Payment verification failed');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'Payment verification failed');
            }
        };

        verifyPayment();
    }, [searchParams, token, navigate, refreshUser, isLoading, planType]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: '-apple-system, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '40px',
                borderRadius: '24px',
                backgroundColor: '#1c1c1e',
                maxWidth: '400px',
                width: '90%'
            }}>
                {status === 'verifying' && (
                    <>
                        <Loader className="animate-spin" size={48} color="#0071e3" style={{ margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Verifying Payment</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={48} color="#30d158" style={{ margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Success!</h2>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle size={48} color="#ff453a" style={{ margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Verification Failed</h2>
                    </>
                )}

                <p style={{ color: '#86868b', lineHeight: 1.5 }}>
                    {message}
                </p>

                {status === 'success' && (
                    <p style={{ marginTop: '16px', fontSize: '14px', color: '#86868b' }}>
                        Redirecting to dashboard...
                    </p>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => navigate('/pricing')}
                        style={{
                            marginTop: '24px',
                            padding: '12px 24px',
                            backgroundColor: '#2c2c2e',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Back to Pricing
                    </button>
                )}
            </div>
        </div>
    );
}
