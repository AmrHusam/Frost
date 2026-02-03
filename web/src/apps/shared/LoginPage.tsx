import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../../shared/store/useAuthStore';
import { ShieldCheck, LogIn, User, Lock, Mail, AlertCircle, Activity } from 'lucide-react';
import frostLogo from '../../assets/frost-logo.jpg';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            login(data.user, data.token);

            // Role-based redirection
            if (data.user.role === 'ADMIN' || data.user.role === 'SUPERVISOR') {
                navigate('/admin');
            } else {
                navigate('/agent');
            }
        } catch (err: any) {
            console.error('[Login] Error:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <img src={frostLogo} alt="Frost" className="inline-block h-24 w-24 rounded-2xl mb-6 shadow-2xl shadow-violet-600/20" />
                    <h1 className="text-4xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 mt-2 font-medium">Log in to your dialer account</p>
                </div>

                <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in fade-in shake-1">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="agent@globaldialer.com"
                                    className="w-full bg-black/40 border border-white/5 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-700 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    disabled={loading}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/5 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-700 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Activity size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Enter Dashboard</span>
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Protected by Frost Security v1.0
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
