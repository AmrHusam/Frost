import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../shared/store/useAuthStore';
import { ConnectionIndicator } from '../../shared/components/ConnectionStatus';
import frostLogo from '../../assets/frost-logo.jpg';
import {
    Activity,
    Layers,
    Users,
    ShieldAlert,
    BarChart3,
    LogOut,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    const navItems = [
        { name: 'Live Monitor', path: '/admin', icon: Activity },
        { name: 'Campaigns', path: '/admin/campaigns', icon: Layers },
        { name: 'Agents', path: '/admin/users', icon: Users },
        { name: 'Compliance Logs', path: '/admin/compliance', icon: ShieldAlert },
        { name: 'Analytics', path: '/admin/stats', icon: BarChart3 },
    ];

    return (
        <div className="frost-layout">
            {/* Sidebar */}
            <aside className="frost-sidebar">
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={frostLogo} alt="Frost" style={{ height: '32px', width: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.03em' }}>Frost</span>
                </div>


                <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={{ textDecoration: 'none' }}
                            >
                                <button
                                    className={`frost-btn w-full ${isActive ? 'active' : ''}`}
                                    style={{ border: 'none', justifyContent: 'flex-start' }}
                                >
                                    <item.icon size={22} />
                                    <span style={{ marginLeft: '12px', flex: 1 }}>{item.name}</span>
                                    {isActive && <ChevronRight size={14} opacity={0.5} />}
                                </button>
                            </NavLink>
                        );
                    })}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid hsl(var(--border-muted))' }}>
                    <div className="flex items-center gap-3 mb-4 px-3 py-2">
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'hsla(var(--primary) / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid hsla(var(--primary) / 0.3)' }}>
                            <span style={{ color: 'hsl(var(--primary))', fontWeight: 700, fontSize: '12px' }}>{user?.name?.[0].toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</span>
                            <span style={{ fontSize: '10px', color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase' }}>{user?.role}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="frost-btn w-full danger"
                        style={{ border: 'none' }}
                    >
                        <LogOut size={22} />
                        <span style={{ marginLeft: '12px' }}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="frost-main">
                <header className="frost-header">
                    <div className="flex items-center gap-4">
                        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
                            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <ConnectionIndicator />
                </header>

                <div className="h-full relative overflow-auto">
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, hsla(var(--primary) / 0.05), transparent 40%)', pointerEvents: 'none' }} />
                    <div className="p-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
