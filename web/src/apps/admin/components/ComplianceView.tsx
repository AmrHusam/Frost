import React from 'react';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, Search, Filter, ArrowUpRight } from 'lucide-react';

export default function ComplianceView() {
    const logs = [
        { id: 'LOG-412', type: 'DNC_SCRUB', result: '2,142 SCRUBBED', status: 'SUCCESS', time: '10:24 AM', agent: 'System' },
        { id: 'LOG-411', type: 'CONSENT_CHECK', result: 'VERIFIED', status: 'SUCCESS', time: '10:22 AM', agent: 'John Doe' },
        { id: 'LOG-410', type: 'TIME_WINDOW', result: 'BLOCK: OUTSIDE TZ', status: 'BLOCKED', time: '10:15 AM', agent: 'Sarah Smith' },
        { id: 'LOG-409', type: 'STIR_SHAKEN', result: 'LEVEL A', status: 'SUCCESS', time: '10:10 AM', agent: 'System' },
        { id: 'LOG-408', type: 'DNC_SCRUB', result: '154 SCRUBBED', status: 'SUCCESS', time: '10:05 AM', agent: 'System' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        Compliance <span style={{ color: 'hsl(var(--primary))' }}>Audit</span>
                    </h1>
                    <p style={{ color: 'hsl(var(--text-dim))', fontSize: '14px', fontWeight: 500 }}>
                        Real-time DNC, TCPA, and regional regulation monitoring.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="frost-btn">
                        <FileText size={18} />
                        Export Logs
                    </button>
                    <button className="frost-btn primary">
                        <ShieldAlert size={18} />
                        Global Rules
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Today\'s Scrubs', value: '42,105', sub: '+12% from yesterday', color: 'hsl(var(--primary))' },
                    { label: 'DNC Violations', value: '0', sub: '100% compliant', color: 'hsl(var(--success))' },
                    { label: 'Consent Rate', value: '94.2%', sub: '+2.1% performance', color: 'hsl(var(--primary))' },
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: 'hsl(var(--bg-card))',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid hsl(var(--border-muted))',
                    }}>
                        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</p>
                        <div className="flex items-end gap-2 mb-2">
                            <h3 style={{ fontSize: '32px', fontWeight: 800 }}>{stat.value}</h3>
                            <ArrowUpRight size={20} style={{ color: stat.color, marginBottom: '6px' }} />
                        </div>
                        <p style={{ color: 'hsl(var(--text-dim))', fontSize: '12px', fontWeight: 500 }}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div style={{
                background: 'hsl(var(--bg-card))',
                borderRadius: '24px',
                border: '1px solid hsl(var(--border-muted))',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid hsl(var(--border-muted))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Real-time Audit Logs</h3>
                    <div className="flex gap-2">
                        <div style={{ position: 'relative' }}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                            <input placeholder="Search logs..." className="frost-btn" style={{ paddingLeft: '32px', height: '36px', fontSize: '12px' }} />
                        </div>
                        <button className="frost-btn" style={{ height: '36px', padding: '0 12px' }}>
                            <Filter size={14} />
                        </button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'hsla(0, 0%, 100%, 0.02)' }}>
                            <th style={{ textAlign: 'left', padding: '14px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '14px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Result</th>
                            <th style={{ textAlign: 'left', padding: '14px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Agent</th>
                            <th style={{ textAlign: 'right', padding: '14px 24px', fontSize: '11px', fontWeight: 800, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={log.id} style={{ borderBottom: i === logs.length - 1 ? 'none' : '1px solid hsl(var(--border-muted))' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div className="flex items-center gap-2">
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.status === 'SUCCESS' ? 'hsl(var(--success))' : 'hsl(var(--warning))' }} />
                                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{log.type.replace('_', ' ')}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'hsl(var(--text-dim))' }}>
                                    {log.result}
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'hsl(var(--text-dim))' }}>
                                    {log.agent}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: 'hsl(var(--text-muted))', fontWeight: 500 }}>
                                    {log.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
