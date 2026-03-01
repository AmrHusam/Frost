import React from 'react';
import { Users, UserPlus, Search, Filter, MoreVertical, Shield, Activity as ActivityIcon } from 'lucide-react';

export default function UsersView() {
    const agents = [
        { id: 1, name: 'John Doe', role: 'AGENT', status: 'ON_CALL', campaign: 'Default Outbound', duration: '05:24', color: 'hsl(var(--success))' },
        { id: 2, name: 'Sarah Smith', role: 'AGENT', status: 'READY', campaign: 'Financial Services', duration: '02:15', color: 'hsl(var(--primary))' },
        { id: 3, name: 'Mike Wilson', role: 'SUPERVISOR', status: 'MONITORING', campaign: 'Insurance Follow-up', duration: '12:40', color: 'hsl(var(--primary))' },
        { id: 4, name: 'Emily Chen', role: 'AGENT', status: 'WRAP_UP', campaign: 'Cold Lead Scrub', duration: '00:45', color: 'hsl(var(--warning))' },
        { id: 5, name: 'Alex Brown', role: 'AGENT', status: 'BREAK', campaign: 'None', duration: '15:20', color: 'hsl(var(--text-muted))' },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ON_CALL': return { bg: 'hsla(var(--success) / 0.1)', text: 'hsl(var(--success))', border: 'hsla(var(--success) / 0.2)' };
            case 'READY': return { bg: 'hsla(var(--primary) / 0.1)', text: 'hsl(var(--primary))', border: 'hsla(var(--primary) / 0.2)' };
            case 'WRAP_UP': return { bg: 'hsla(var(--warning) / 0.1)', text: 'hsl(var(--warning))', border: 'hsla(var(--warning) / 0.2)' };
            case 'MONITORING': return { bg: 'hsla(var(--primary) / 0.1)', text: 'hsl(var(--primary))', border: 'hsla(var(--primary) / 0.2)' };
            default: return { bg: 'hsla(0, 0%, 100%, 0.05)', text: 'hsl(var(--text-muted))', border: 'hsla(0, 0%, 100%, 0.1)' };
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        Agent <span style={{ color: 'hsl(var(--primary))' }}>Directory</span>
                    </h1>
                    <p style={{ color: 'hsl(var(--text-dim))', fontSize: '14px', fontWeight: 500 }}>
                        Manage users, monitor real-time status, and assign roles.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            placeholder="Search users..."
                            className="frost-btn"
                            style={{ paddingLeft: '36px', height: '100%', minWidth: '240px' }}
                        />
                    </div>
                    <button className="frost-btn primary">
                        <UserPlus size={18} />
                        Add User
                    </button>
                </div>
            </div>

            <div style={{
                background: 'hsl(var(--bg-card))',
                borderRadius: '24px',
                border: '1px solid hsl(var(--border-muted))',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid hsl(var(--border-muted))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-4">
                        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Users</h3>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                            {agents.length} TOTAL
                        </span>
                    </div>
                    <button className="frost-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        <Filter size={14} />
                        Filters
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'hsla(0, 0%, 100%, 0.02)' }}>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Agent</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Role</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Current Status</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Campaign</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Time</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((agent, i) => {
                            const style = getStatusStyle(agent.status);
                            return (
                                <tr key={agent.id} style={{ borderBottom: i === agents.length - 1 ? 'none' : '1px solid hsl(var(--border-muted))', transition: 'background 0.2s' }} className="hover:bg-white/[0.02]">
                                    <td style={{ padding: '16px 24px' }}>
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: `${agent.color}15`, border: `1px solid ${agent.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 800, color: agent.color }}>{agent.name[0]}</span>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 700 }}>{agent.name}</div>
                                                <div style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>ID: 00{agent.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div className="flex items-center gap-2">
                                            {agent.role === 'SUPERVISOR' ? <Shield size={14} className="text-primary" /> : <Users size={14} className="text-dim" />}
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{agent.role}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            background: style.bg,
                                            color: style.text,
                                            border: `1px solid ${style.border}`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.text }} />
                                            {agent.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'hsl(var(--text-dim))' }}>
                                        {agent.campaign}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{agent.duration}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button style={{ border: 'none', background: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer' }}>
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
