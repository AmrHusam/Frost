import React from 'react';
import { useSocketStore, ConnectionStatus } from '../store/useSocketStore';
import { Activity, Circle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export const ConnectionIndicator: React.FC = () => {
    const { status, agentStatus, lastError, latency } = useSocketStore();

    const config: Record<ConnectionStatus, { icon: any, color: string, label: string, animate?: boolean }> = {
        CONNECTED: { icon: Wifi, color: 'text-success', label: 'Online' },
        DISCONNECTED: { icon: WifiOff, color: 'text-muted', label: 'Offline' },
        CONNECTING: { icon: Activity, color: 'text-primary', label: 'Connecting', animate: true },
        ERROR: { icon: AlertCircle, color: 'text-error', label: 'Error' },
    };

    const current = config[status];
    const Icon = current.icon;

    return (
        <div className="flex items-center gap-3" style={{ padding: '6px 16px', borderRadius: '99px', background: 'hsla(0, 0%, 0%, 0.4)', border: '1px solid hsl(var(--border-muted))' }}>
            <div className="relative flex items-center">
                <Icon size={16} className={`${current.color} ${current.animate ? 'animate-pulse' : ''}`} />
            </div>

            <div className="flex" style={{ flexDirection: 'column', minWidth: '80px' }}>
                <span className={`text-muted`} style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
                    System Status
                </span>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: status === 'CONNECTED' ? 'hsl(var(--success))' : (status === 'ERROR' ? 'hsl(var(--error))' : 'hsl(var(--text-muted))'),
                    textTransform: 'uppercase',
                    lineHeight: 1.2
                }}>
                    {status === 'CONNECTED' ? agentStatus : current.label}
                </span>
                {status === 'ERROR' && lastError && (
                    <span style={{ fontSize: '9px', color: 'hsl(var(--error))', opacity: 0.8, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                        {lastError}
                    </span>
                )}
            </div>
        </div>
    );
};
