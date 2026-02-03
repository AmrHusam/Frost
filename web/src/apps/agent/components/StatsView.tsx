import React from 'react';
import { BarChart3, TrendingUp, Phone, Clock, Target, Calendar } from 'lucide-react';
import { useSocketStore } from '../../../shared/store/useSocketStore';

export const StatsView: React.FC = () => {
    const { stats, showToast } = useSocketStore();

    // In a real app, 'change' would be calculated from previous period
    const statItems = [
        { label: 'Total Calls', value: stats.callsToday.toString(), change: stats.callsTrend, icon: Phone, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        { label: 'Talk Time', value: '5h 12m', change: '+8%', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Conversion', value: `${(stats.answered / (stats.callsToday || 1) * 100).toFixed(1)}%`, change: stats.answeredTrend, icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Avg Wrap', value: `${stats.avgDuration}s`, change: stats.avgDurationTrend, icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

    const hourlyData = [
        { hour: '9 AM', calls: 12 },
        { hour: '10 AM', calls: 25 },
        { hour: '11 AM', calls: 20 },
        { hour: '12 PM', calls: 5 },
        { hour: '1 PM', calls: 15 },
        { hour: '2 PM', calls: 30 },
        { hour: '3 PM', calls: 25 },
        { hour: '4 PM', calls: 10 },
    ];

    const maxCalls = Math.max(...hourlyData.map(d => d.calls));

    return (
        <div className="flex flex-col h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Performance Stats</h1>
                    <p className="text-sm text-zinc-400 mt-1">Real-time overview of your dialing activity</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-3">
                        <button
                            onClick={() => showToast('Date filtering coming soon!', 'info')}
                            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => showToast('Report download started...', 'success')}
                            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
                        >
                            Download Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statItems.map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
                            <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Hourly Chart */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl lg:col-span-2 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-base font-semibold text-white">Hourly Activity</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                            Calls Completed
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-4">
                        {hourlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div
                                    className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110 bg-gradient-to-t from-violet-600/50 to-violet-500"
                                    style={{
                                        height: `${(d.calls / maxCalls) * 100}%`,
                                        minHeight: '4px'
                                    }}
                                />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{d.hour}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8 flex flex-col">
                    <h3 className="text-base font-semibold text-white mb-6">Disposition Summary</h3>
                    <div className="flex-1 flex flex-col gap-6">
                        {[
                            { label: 'Interested', value: 45, color: 'bg-emerald-500' },
                            { label: 'Follow Up', value: 32, color: 'bg-violet-500' },
                            { label: 'No Answer', value: 58, color: 'bg-amber-500' },
                            { label: 'DNC / Reject', value: 12, color: 'bg-rose-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-500">Target Met</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">You are currently <span className="text-white font-medium">8% ahead</span> of your daily conversion goal.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
