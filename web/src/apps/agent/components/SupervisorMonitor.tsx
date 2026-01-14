import React from 'react';
import { useSocketStore } from '../../../shared/store/useSocketStore';
import { Activity, Users, Clock, Phone, TrendingUp } from 'lucide-react';

export const SupervisorMonitor: React.FC = () => {
    // In a real implementation, this would subscribe to a global 'calls' event
    // For now, we'll show a high-fidelity placeholder that matches the Frost design
    const mockCalls = [
        { id: '1', agent: 'Sarah Connor', customer: '+1 (555) 0123', status: 'CONNECTED', duration: '04:12' },
        { id: '2', agent: 'John Doe', customer: '+1 (555) 4567', status: 'RINGING', duration: '00:15' },
        { id: '3', agent: 'Ellen Ripley', customer: '+1 (555) 8888', status: 'CONNECTED', duration: '12:45' },
    ];

    return (
        <div className="flex flex-col h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Live Monitor</h1>
                    <p className="text-sm text-zinc-400 mt-1">Real-time overview of all active floor operations</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-5 py-3 flex items-center gap-3">
                        <Users size={18} className="text-indigo-400" />
                        <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-300/60">Active Agents</div>
                            <div className="font-bold text-indigo-100">12 / 15</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Agent</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockCalls.map((call) => (
                            <tr key={call.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                                            {call.agent[0]}
                                        </div>
                                        <span className="font-semibold text-zinc-200">{call.agent}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-400 font-mono text-sm">{call.customer}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${call.status === 'CONNECTED'
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${call.status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        {call.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400 text-sm font-mono flex items-center gap-2">
                                    <Clock size={14} className="text-zinc-600" />
                                    {call.duration}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2 text-emerald-500">
                        <Activity size={20} />
                        <span className="font-semibold text-sm">Floor Health</span>
                    </div>
                    <div className="text-3xl font-bold text-white">98.2%</div>
                    <div className="text-xs text-zinc-500 mt-1">Compliance Score</div>
                </div>
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2 text-indigo-500">
                        <Phone size={20} />
                        <span className="font-semibold text-sm">Total Calls</span>
                    </div>
                    <div className="text-3xl font-bold text-white">1,284</div>
                    <div className="text-xs text-zinc-500 mt-1">Since 8:00 AM</div>
                </div>
            </div>
        </div>
    );
};
