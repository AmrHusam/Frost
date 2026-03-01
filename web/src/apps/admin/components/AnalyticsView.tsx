import React from 'react';
import { BarChart3, TrendingUp, Users, PhoneCall, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnalyticsView() {
    const metrics = [
        { label: 'Total Calls', value: '48,291', change: '+14% ', trend: 'up', icon: PhoneCall, color: 'hsl(var(--primary))' },
        { label: 'Avg. Call Duration', value: '2m 14s', change: '-5% ', trend: 'down', icon: Clock, color: 'hsl(var(--success))' },
        { label: 'Conversion Rate', value: '8.4%', change: '+0.2% ', trend: 'up', icon: TrendingUp, color: 'hsl(var(--primary))' },
        { label: 'Active Sessions', value: '124', change: '+8% ', trend: 'up', icon: Users, color: 'hsl(var(--primary))' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        System <span style={{ color: 'hsl(var(--primary))' }}>Analytics</span>
                    </h1>
                    <p style={{ color: 'hsl(var(--text-dim))', fontSize: '14px', fontWeight: 500 }}>
                        Comprehensive performance metrics and historical trends across all campaigns.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} style={{
                        background: 'hsl(var(--bg-card))',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid hsl(var(--border-muted))',
                    }}>
                        <div className="flex justify-between items-start mb-4">
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'hsla(0, 0%, 100%, 0.03)', border: '1px solid hsla(0, 0%, 100%, 0.05)', color: m.color }}>
                                <m.icon size={20} />
                            </div>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: 800,
                                color: m.trend === 'up' ? 'hsl(var(--success))' : 'hsl(var(--error))',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {m.change}
                                {m.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</p>
                        <h3 style={{ fontSize: '28px', fontWeight: 800 }}>{m.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2" style={{
                    background: 'hsl(var(--bg-card))',
                    borderRadius: '24px',
                    border: '1px solid hsl(var(--border-muted))',
                    padding: '24px',
                    minHeight: '360px'
                }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Call Volume Trends</h3>
                        <select className="frost-btn" style={{ fontSize: '12px', padding: '4px 12px' }}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* Placeholder for Chart */}
                    <div className="flex items-end justify-between h-48 gap-2 mt-12 px-4">
                        {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${h}%`,
                                background: `linear-gradient(to top, hsla(var(--primary) / 0.1), hsla(var(--primary) / 0.6))`,
                                borderRadius: '8px 8px 4px 4px',
                                position: 'relative'
                            }} className="group">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] py-1 px-2 rounded hidden group-hover:block border border-white/10">
                                    {Math.floor(h * 150)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <span key={d} style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--text-muted))' }}>{d}</span>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: 'hsl(var(--bg-card))',
                    borderRadius: '24px',
                    border: '1px solid hsl(var(--border-muted))',
                    padding: '24px',
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Campaign Distribution</h3>
                    <div className="flex flex-col gap-6">
                        {[
                            { label: 'Outbound Focus', value: 65, color: 'hsl(var(--primary))' },
                            { label: 'Financial Services', value: 25, color: 'hsl(var(--success))' },
                            { label: 'Insurance Ref', value: 10, color: 'hsl(var(--warning))' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2">
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 800 }}>{item.value}%</span>
                                </div>
                                <div style={{ height: '8px', background: 'hsla(0, 0%, 100%, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
