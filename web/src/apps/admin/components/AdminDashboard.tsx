import React from 'react';
import { Activity, Users, PhoneCall, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Active Agents', value: '12', change: '+2', icon: Users, color: 'hsl(var(--primary))' },
        { label: 'Live Calls', value: '4', change: '-1', icon: PhoneCall, color: 'hsl(var(--success))' },
        { label: 'Waiting Leads', value: '1,204', change: '+124', icon: Activity, color: 'hsl(var(--warning))' },
        { label: 'Compliance Rate', value: '100%', change: '0%', icon: CheckCircle, color: 'hsl(var(--primary))' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with specific styling */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        Live <span style={{ color: 'hsl(var(--primary))' }}>Monitor</span>
                    </h1>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px', fontWeight: 500 }}>
                        Real-time overview of system performance and compliance.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="frost-btn" style={{ border: '1px solid hsl(var(--border-muted))' }}>
                        Download Report
                    </button>
                    <button className="frost-btn primary">
                        System Configuration
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{
                        background: 'hsl(var(--bg-card))',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid hsl(var(--border-muted))',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle at top right, ${stat.color}15, transparent 70%)` }} />

                        <div className="flex justify-between items-start mb-4">
                            <div style={{ padding: '10px', borderRadius: '12px', background: 'hsla(0, 0%, 100%, 0.03)', border: '1px solid hsla(0, 0%, 100%, 0.05)', color: stat.color }}>
                                <stat.icon size={20} />
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 700, padding: '4px 8px', borderRadius: '8px', background: stat.change.includes('+') ? 'hsla(var(--success) / 0.1)' : 'hsla(var(--text-muted) / 0.1)', color: stat.change.includes('+') ? 'hsl(var(--success))' : 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {stat.change.includes('+') ? <ArrowUpRight size={12} /> : (stat.change === '0%' ? null : <ArrowDownRight size={12} />)}
                                {stat.change}
                            </div>
                        </div>

                        <div>
                            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '28px', fontWeight: 800 }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* System Health Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                <div style={{
                    background: 'hsl(var(--bg-card))',
                    borderRadius: '24px',
                    border: '1px solid hsl(var(--border-muted))',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Infrastructure Health</h3>
                        <div style={{ fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: 'hsla(var(--success) / 0.1)', color: 'hsl(var(--success))', textTransform: 'uppercase' }}>All Systems Nominal</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { label: 'CPU Usage', value: 24, color: 'hsl(var(--primary))' },
                            { label: 'Memory Load', value: 42, color: 'hsl(var(--success))' },
                            { label: 'Network Latency', value: 18, color: 'hsl(var(--primary))' },
                            { label: 'Database I/O', value: 12, color: 'hsl(var(--warning))' },
                        ].map((metric, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--text-dim))' }}>{metric.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{metric.value}%</span>
                                </div>
                                <div style={{ height: '8px', background: 'hsla(0, 0%, 100%, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${metric.value}%`, background: metric.color, borderRadius: '4px', transition: 'width 1s ease-in-out' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: 'hsl(var(--bg-card))',
                    borderRadius: '24px',
                    border: '1px solid hsl(var(--border-muted))',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    minHeight: '280px'
                }}>
                    <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Compliance Score</h3>
                    </div>
                    <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        border: '10px solid hsla(var(--primary) / 0.1)',
                        borderTop: '10px solid hsl(var(--primary))',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(45deg)',
                        marginTop: '20px'
                    }}>
                        <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
                            <span style={{ fontSize: '32px', fontWeight: 800 }}>98.4</span>
                            <span style={{ fontSize: '14px', color: 'hsl(var(--text-muted))' }}>%</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '24px', fontSize: '12px', color: 'hsl(var(--text-muted))', textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>
                        Your system is currently meeting <strong>98.4%</strong> of regulatory compliance standards.
                    </p>
                </div>
            </div>

            {/* Activity Table */}
            <div style={{
                background: 'hsl(var(--bg-card))',
                borderRadius: '24px',
                border: '1px solid hsl(var(--border-muted))',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid hsl(var(--border-muted))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Activity</h3>
                    <span style={{ fontSize: '12px', color: 'hsl(var(--primary))', fontWeight: 700, cursor: 'pointer' }}>View All Logs</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'hsla(0, 0%, 100%, 0.02)' }}>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Event</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Agent</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { event: 'Outbound Call Start', agent: 'John Doe', status: 'COMPLIANT', time: '2 mins ago' },
                            { event: 'Agent Login', agent: 'Sarah Smith', status: 'VERIFIED', time: '5 mins ago' },
                            { event: 'Lead Disposition', agent: 'Mike Wilson', status: 'RECORDED', time: '12 mins ago' },
                            { event: 'Compliance Alert', agent: 'Emily Chen', status: 'RESOLVED', time: '15 mins ago' },
                            { event: 'Call Recorded', agent: 'John Doe', status: 'STORED', time: '18 mins ago' },
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === 4 ? 'none' : '1px solid hsl(var(--border-muted))' }}>
                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600 }}>{row.event}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: 'hsl(var(--text-dim))' }}>{row.agent}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        background: 'hsla(var(--primary) / 0.1)',
                                        color: 'hsl(var(--primary))',
                                        border: '1px solid hsla(var(--primary) / 0.2)'
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '12px', color: 'hsl(var(--text-muted))', textAlign: 'right', fontWeight: 500 }}>{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
