import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div style={{ fontSize: '48px' }}>💎</div>
                    <h1>WealthWise Admin</h1>
                    <p>Login to the administrator portal</p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="admin@wealthwise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '20px',
                    padding: '14px 16px',
                    background: 'rgba(59,130,246,0.08)',
                    borderRadius: '10px',
                    border: '1px solid rgba(59,130,246,0.2)',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.8'
                }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Demo credentials</strong><br />
                    Email: <code style={{ color: 'var(--accent)' }}>admin@spendwise.com</code><br />
                    Password: <code style={{ color: 'var(--accent)' }}>demo123</code>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
