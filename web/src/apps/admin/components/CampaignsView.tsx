import React from 'react';
import { Layers, Play, Pause, MoreVertical, Plus, Target, Users, Activity } from 'lucide-react';

export default function CampaignsView() {
    const campaigns = [
        { id: 1, name: 'Default Outbound', status: 'ACTIVE', leads: 4205, dialRate: '2.5x', conversion: '12.4%', color: 'hsl(var(--primary))' },
        { id: 2, name: 'Financial Services Q1', status: 'ACTIVE', leads: 12840, dialRate: '4.0x', conversion: '8.2%', color: 'hsl(var(--success))' },
        { id: 3, name: 'Insurance Follow-up', status: 'PAUSED', leads: 842, dialRate: '0.0x', conversion: '15.1%', color: 'hsl(var(--warning))' },
        { id: 4, name: 'Cold Lead Scrub', status: 'ACTIVE', leads: 24192, dialRate: '1.5x', conversion: '4.7%', color: 'hsl(var(--primary))' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        Campaign <span style={{ color: 'hsl(var(--primary))' }}>Management</span>
                    </h1>
                    <p style={{ color: 'hsl(var(--text-dim))', fontSize: '14px', fontWeight: 500 }}>
                        Manage and monitor your outbound dialing strategies.
                    </p>
                </div>
                <button className="frost-btn primary">
                    <Plus size={18} />
                    Create Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp) => (
                    <div key={camp.id} style={{
                        background: 'hsl(var(--bg-card))',
                        borderRadius: '24px',
                        border: '1px solid hsl(var(--border-muted))',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${camp.color}10, transparent 70%)` }} />

                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div style={{ padding: '10px', borderRadius: '12px', background: 'hsla(0, 0%, 100%, 0.03)', border: '1px solid hsla(0, 0%, 100%, 0.05)', color: camp.color }}>
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{camp.name}</h3>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: camp.status === 'ACTIVE' ? 'hsl(var(--success))' : 'hsl(var(--warning))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {camp.status}
                                    </span>
                                </div>
                            </div>
                            <button style={{ border: 'none', background: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer' }}>
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div style={{ padding: '12px', borderRadius: '16px', background: 'hsla(0, 0%, 100%, 0.02)', border: '1px solid hsl(var(--border-muted))' }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Target size={12} className="text-muted" />
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Leads</span>
                                </div>
                                <span style={{ fontSize: '18px', fontWeight: 800 }}>{camp.leads.toLocaleString()}</span>
                            </div>
                            <div style={{ padding: '12px', borderRadius: '16px', background: 'hsla(0, 0%, 100%, 0.02)', border: '1px solid hsl(var(--border-muted))' }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Activity size={12} className="text-muted" />
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Dial Rate</span>
                                </div>
                                <span style={{ fontSize: '18px', fontWeight: 800 }}>{camp.dialRate}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-dim" />
                                <span style={{ fontSize: '12px', fontWeight: 600 }}>{Math.floor(Math.random() * 5) + 1} Agents Active</span>
                            </div>
                            <button className={`frost-btn ${camp.status === 'ACTIVE' ? 'danger' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
                                {camp.status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
                                {camp.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
