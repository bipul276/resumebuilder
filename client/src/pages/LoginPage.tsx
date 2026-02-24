import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const BG_IMAGE = "https://images.unsplash.com/42/U7Fc1sy5SCUDIu4tlJY3_NY_by_PhilippHenzler_philmotion.de.jpg?ixlib=rb-0.3.5&q=50&fm=jpg&crop=entropy&s=7686972873678f32efaf2cd79671673d";

export function LoginPage() {
    // idle, login, signup
    // 'idle' means we show the initial state (both options visible in center card)
    const [view, setView] = useState<'idle' | 'login' | 'signup' | 'forgot_password' | 'reset_password'>('idle');
    const [isAnimating, setIsAnimating] = useState(false);

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const { login, register, user } = useAuth();
    const navigate = useNavigate();

    // Reset error when switching views
    useEffect(() => {
        setError('');
        setMessage('');
    }, [view]);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const change_to_login = () => {
        setIsAnimating(true);
        setView('login');
        setTimeout(() => setIsAnimating(false), 250);
    };

    const change_to_sign_up = () => {
        setIsAnimating(true);
        setView('signup');
        setTimeout(() => setIsAnimating(false), 250);
    };

    const hidden_login_and_sign_up = (e?: React.MouseEvent) => {
        e?.preventDefault();
        setIsAnimating(true);
        setView('idle');
        setTimeout(() => setIsAnimating(false), 250);
    };

    const handleLogin = async () => {
        if (isLoading) return;
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/sandbox');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (isLoading) return;
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await register(email, password, name);
            navigate('/sandbox');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setView('forgot_password');
    };

    const handleSendOTP = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

            setMessage('OTP sent to your email!');
            setTimeout(() => {
                setMessage('');
                setView('reset_password');
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to reset password');

            setMessage('Password reset successful! Please login.');
            setTimeout(() => {
                setMessage('');
                setView('login');
                setPassword(''); // Clear password field for login
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate generic class based on view
    let formsClassName = "cont_forms";
    if (view === 'login' || view === 'forgot_password' || view === 'reset_password') formsClassName += " cont_forms_active_login";
    if (view === 'signup') formsClassName += " cont_forms_active_sign_up";

    return (
        <div className="cotn_principal">
            <Link to="/" style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                zIndex: 100,
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s'
            }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <span style={{ fontSize: '24px' }}>←</span> Back to Home
            </Link>
            <div className="cont_centrar">
                <div className="cont_login">
                    <div className="cont_info_log_sign_up">
                        <div className="col_md_login">
                            <div className="cont_ba_opcitiy">
                                <h2>LOGIN</h2>
                                <p>Welcome! Please login to your account.</p>
                                <button className="btn_login" onClick={change_to_login}>LOGIN</button>
                            </div>
                        </div>
                        <div className="col_md_sign_up">
                            <div className="cont_ba_opcitiy">
                                <h2>SIGN UP</h2>
                                <p>New here? Create an account today.</p>
                                <button className="btn_sign_up" onClick={change_to_sign_up}>SIGN UP</button>
                            </div>
                        </div>
                    </div>

                    {/* Background removed, using CSS gradient */}
                    <div className="cont_back_info">
                        <div className="cont_img_back_grey" style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000 70%)' }}>
                        </div>
                    </div>

                    <div className={formsClassName}>
                        <div className="cont_img_back_" style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000 70%)' }}>
                        </div>

                        {/* Login Form */}
                        <div className="cont_form_login" style={{
                            display: view === 'login' || (view === 'idle' && isAnimating) ? 'block' : 'none',
                            opacity: view === 'login' && !isAnimating ? 1 : 0,
                            transition: 'opacity 0.25s ease-in-out',
                            transitionDelay: view === 'login' ? '0.1s' : '0s'
                        }}>
                            <a href="#" onClick={hidden_login_and_sign_up}>
                                <i className="material-icons">&#xE5C4;</i>
                            </a>
                            <h2>LOGIN</h2>
                            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <a href="#" className="forgot-pass" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                            {view === 'login' && error && <div className="error-msg" style={{ marginTop: '10px' }}>{error}</div>}
                            <button className="btn_login" onClick={handleLogin}>
                                {isLoading ? '...' : 'LOGIN'}
                            </button>
                        </div>

                        {/* Sign Up Form */}
                        <div className="cont_form_sign_up" style={{
                            display: view === 'signup' || (view === 'idle' && isAnimating) ? 'block' : 'none',
                            opacity: view === 'signup' && !isAnimating ? 1 : 0,
                            transition: 'opacity 0.25s ease-in-out',
                            transitionDelay: view === 'signup' ? '0.1s' : '0s'
                        }}>
                            <a href="#" onClick={hidden_login_and_sign_up}>
                                <i className="material-icons">&#xE5C4;</i>
                            </a>
                            <h2>SIGN UP</h2>
                            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="text" placeholder="User (Name)" value={name} onChange={e => setName(e.target.value)} />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            {view === 'signup' && error && <div className="error-msg" style={{ marginTop: '10px' }}>{error}</div>}
                            <button className="btn_sign_up" onClick={handleRegister}>
                                {isLoading ? '...' : 'SIGN UP'}
                            </button>
                        </div>

                        {/* Forgot Password Form */}
                        <div className="cont_form_login" style={{
                            display: view === 'forgot_password' ? 'block' : 'none',
                            opacity: view === 'forgot_password' ? 1 : 0,
                            transition: 'opacity 0.25s ease-in-out',
                        }}>
                            <a href="#" onClick={() => setView('login')}>
                                <i className="material-icons">&#xE5C4;</i>
                            </a>
                            <h2>RESET PASS</h2>
                            <p style={{ margin: '20px auto', width: '260px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                Enter your email below to receive a password reset OTP.
                            </p>
                            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            {view === 'forgot_password' && error && <div className="error-msg" style={{ marginTop: '10px' }}>{error}</div>}
                            <button className="btn_login" onClick={handleSendOTP}>
                                {isLoading ? '...' : 'SEND OTP'}
                            </button>
                        </div>

                        {/* Reset Password Form */}
                        <div className="cont_form_login" style={{
                            display: view === 'reset_password' ? 'block' : 'none',
                            opacity: view === 'reset_password' ? 1 : 0,
                            transition: 'opacity 0.25s ease-in-out',
                        }}>
                            <a href="#" onClick={() => setView('login')}>
                                <i className="material-icons">&#xE5C4;</i>
                            </a>
                            <h2>NEW PASS</h2>
                            {message && <div style={{ color: '#4caf50', margin: '10px 0' }}>{message}</div>}
                            <input type="text" placeholder="OTP Code" value={otp} onChange={e => setOtp(e.target.value)} />
                            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            {view === 'reset_password' && error && <div className="error-msg" style={{ marginTop: '10px' }}>{error}</div>}
                            <button className="btn_login" onClick={handleResetPassword}>
                                {isLoading ? '...' : 'UPDATE'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
