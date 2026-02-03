import React, { useEffect, useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectionIndicator } from '../../shared/components/ConnectionStatus';
import { frostSocket } from '../../shared/services/frostSocket';
import { useAuthStore } from '../../shared/store/useAuthStore';
import { useSocketStore } from '../../shared/store/useSocketStore';
import { Phone, Users, BarChart3, Settings, LogOut, ShieldCheck, ChevronDown, AlertCircle, Activity, WifiOff } from 'lucide-react';
import { DialerMain } from './components/DialerMain';
import { ContactsView } from './components/ContactsView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { SupervisorMonitor } from './components/SupervisorMonitor';
import { useFrostEvent } from '../../shared/hooks/useFrost';
import { useAgentListener } from '../../shared/hooks/useAgentListener';
import frostLogo from '../../assets/frost-logo.jpg';

import { useUIStore } from '../../shared/store/useUIStore';

type TabType = 'DIALER' | 'CONTACTS' | 'STATS' | 'SETTINGS' | 'MONITOR';

const AgentLayout: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { agentStatus, setAgentStatus, setLatency, status: connectionStatus, toast } = useSocketStore();
    const { activeTab, setActiveTab } = useUIStore();
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // Set initial tab based on role if needed (handled in store init or effect, but effect is safer)
    useEffect(() => {
        if (user?.role === 'SUPERVISOR') setActiveTab('MONITOR');
    }, [user?.role]);

    const isDisconnected = connectionStatus === 'DISCONNECTED' || connectionStatus === 'ERROR';

    // Monitor Latency
    useFrostEvent('presence.ping', (timestamp) => {
        frostSocket.emit('presence.pong', timestamp);
        setLatency(Date.now() - timestamp);
    });

    // Initialize Global Listeners
    useAgentListener();

    useEffect(() => {
        const { token, user } = useAuthStore.getState();
        if (token && user) {
            const namespace = user.role === 'SUPERVISOR' ? '/supervisors' : '/agents';
            frostSocket.connect(namespace as any, token);
        }

        return () => {
            frostSocket.disconnect();
        };
    }, []);

    const handleStatusChange = (status: string) => {
        if (isDisconnected) return;
        setAgentStatus(status);
        setIsStatusOpen(false);
        frostSocket.emit('agent.setStatus', { v: 1, status: status as any }, (res) => {
            if (!res.success) useSocketStore.getState().showToast('Failed to sync status: ' + res.error, 'error');
        });
    };

    const sidebarItems = useMemo(() => {
        const items = [];
        if (user?.role === 'SUPERVISOR') {
            items.push({ id: 'MONITOR' as TabType, icon: Activity, label: 'Live Monitor' });
        } else {
            items.push({ id: 'DIALER' as TabType, icon: Phone, label: 'Dialer' });
        }
        items.push(
            { id: 'CONTACTS' as TabType, icon: Users, label: 'Contacts' },
            { id: 'STATS' as TabType, icon: BarChart3, label: 'Stats' },
            { id: 'SETTINGS' as TabType, icon: Settings, label: 'Settings' }
        );
        return items;
    }, [user?.role]);

    const statuses = [
        { id: 'READY', label: 'Available', color: 'text-emerald-500', bg: 'bg-emerald-500' },
        { id: 'NOT_READY', label: 'Away', color: 'text-amber-500', bg: 'bg-amber-500' },
        { id: 'BREAK', label: 'Break', color: 'text-violet-500', bg: 'bg-violet-500' },
        { id: 'WRAP_UP', label: 'Wrap Up', color: 'text-rose-500', bg: 'bg-rose-500' },
    ];

    const currentStatus = statuses.find(s => s.id === agentStatus);

    const renderContent = () => {
        switch (activeTab) {
            case 'DIALER': return <DialerMain />;
            case 'MONITOR': return <SupervisorMonitor />;
            case 'CONTACTS': return <ContactsView />;
            case 'STATS': return <StatsView />;
            case 'SETTINGS': return <SettingsView />;
            default: return user?.role === 'SUPERVISOR' ? <SupervisorMonitor /> : <DialerMain />;
        }
    };

    return (
        <div
            className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-50 font-sans"
            style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', flexDirection: 'row' }}
        >
            {/* Connection Banner */}
            {isDisconnected && (
                <div className="fixed top-0 left-0 right-0 h-10 bg-rose-600 text-white flex items-center justify-center gap-3 z-50 font-semibold text-sm shadow-md animate-in slide-in-from-top-full">
                    <WifiOff size={18} />
                    <span>Connection Lost. Attempting to reconnect...</span>
                </div>
            )}

            {/* Toast System */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-zinc-900 border shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-12 duration-300 ${toast.type === 'error' ? 'border-rose-500/50 text-rose-400' :
                    toast.type === 'success' ? 'border-emerald-500/50 text-emerald-400' :
                        'border-violet-500/50 text-violet-400'
                    }`}>
                    {toast.type === 'error' ? <AlertCircle size={18} /> : <Activity size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={`w-[260px] bg-zinc-900 border-r border-white/5 flex flex-col transition-all duration-300 ${isDisconnected ? 'pt-10' : ''}`}
                style={{ width: '260px', display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', background: '#18181b' }}
            >
                <div className="p-6 flex items-center gap-3">
                    <img src={frostLogo} alt="Frost" className="h-8 w-8 rounded-lg shadow-lg shadow-violet-600/20" />
                    <span className="font-bold text-xl tracking-tight">Frost</span>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${activeTab === item.id
                                ? 'bg-violet-600/10 text-violet-400'
                                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={`transition-colors ${activeTab === item.id ? 'text-violet-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 flex flex-col relative transition-all duration-300 ${isDisconnected ? 'pt-10' : ''}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}
            >
                <header className="h-[72px] px-8 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30 text-violet-400 font-bold">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{user?.name}</span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider font-bold">{user?.role}</span>
                            </div>

                            {/* Status Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => !isDisconnected && setIsStatusOpen(!isStatusOpen)}
                                    disabled={isDisconnected}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-opacity ${currentStatus?.color} ${isDisconnected ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                                >
                                    {currentStatus?.label}
                                    <ChevronDown size={12} />
                                </button>

                                {isStatusOpen && (
                                    <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg p-1 min-w-[140px] shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200">
                                        {statuses.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => handleStatusChange(s.id)}
                                                className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/5 text-xs font-medium transition-colors"
                                            >
                                                <div className={`w-2 h-2 rounded-full ${s.bg}`} />
                                                <span className="text-zinc-300">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <ConnectionIndicator />
                </header>

                <div className="flex-1 relative overflow-auto bg-zinc-950">
                    {/* Background Radial Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08),transparent_40%)] pointer-events-none" />

                    {renderContent()}

                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AgentLayout;
