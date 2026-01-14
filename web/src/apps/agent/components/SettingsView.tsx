import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Monitor, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../../shared/store/useAuthStore';

export const SettingsView: React.FC = () => {
    const { user, logout } = useAuthStore();
    const [activeSection, setActiveSection] = useState('Profile');

    const sections = [
        { icon: User, label: 'Profile' },
        { icon: Bell, label: 'Notifications' },
        { icon: Shield, label: 'Security' },
        { icon: Globe, label: 'Language & Region' },
        { icon: Monitor, label: 'Audio & Hardware' },
    ];

    return (
        <div className="flex flex-col h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-sm text-zinc-400 mt-1">Manage your profile and application preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                {/* Navigation */}
                <div className="flex flex-col gap-2">
                    {sections.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSection(item.label)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-left ${activeSection === item.label
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    {activeSection === 'Profile' && (
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-semibold text-white mb-6">Agent Profile</h3>
                            <div className="flex flex-col gap-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Full Name</label>
                                        <input type="text" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-zinc-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none" defaultValue={user?.name} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Agent ID</label>
                                        <div className="w-full bg-zinc-950/50 border border-white/5 rounded-lg px-4 py-2.5 text-zinc-500 text-sm font-mono cursor-not-allowed">
                                            {user?.id}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Email Address</label>
                                    <input type="email" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-zinc-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none" defaultValue={user?.email || 'agent@globaldialer.com'} />
                                </div>
                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                                    <button className="px-4 py-2 rounded-lg text-zinc-400 text-sm font-medium hover:text-white transition-colors">Cancel</button>
                                    <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                                        <Check size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
                        <h3 className="text-lg font-semibold text-white mb-6">Account Actions</h3>
                        <div className="flex items-center justify-between p-5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                            <div>
                                <p className="text-sm font-semibold text-rose-200">Termination Session</p>
                                <p className="text-xs text-rose-300/60 mt-0.5">Disconnect from the dialer and clear your session data.</p>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="px-4 py-2.5 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-900/20 flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                <span>Logout Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
