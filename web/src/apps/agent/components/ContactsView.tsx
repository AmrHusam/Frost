import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../shared/store/useAuthStore';
import { Search, UserPlus, Filter, MoreVertical, Phone } from 'lucide-react';
import { MockAgentService } from '../../../shared/services/mockAgentService';
import { useDialerStore } from '../../../shared/store/useDialerStore';
import { useUIStore } from '../../../shared/store/useUIStore';

interface Lead {
    id: string;
    name: string;
    phone: string;
    status: string;
}

export const ContactsView: React.FC = () => {
    const { token } = useAuthStore();
    const { setNumber } = useDialerStore();
    const { setActiveTab } = useUIStore();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${BACKEND_URL}/api/leads`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.leads && data.leads.length > 0) {
                    setLeads(data.leads);
                } else {
                    throw new Error('No leads found');
                }
            } catch (error) {
                console.warn('Failed to fetch leads, using fallback data:', error);
                setLeads(MockAgentService.getInitialContacts());
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchLeads();
        }
    }, [token]);

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search)
    );

    const handleDial = (phone: string) => {
        setNumber(phone);
        setActiveTab('DIALER');
    };

    return (
        <div className="flex flex-col h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Contacts</h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage and dial your assigned leads</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                    <UserPlus size={18} />
                    <span>Add Lead</span>
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-xl p-3 mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-zinc-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-xl">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                            <span>Loading leads...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                        No leads found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                                                    {lead.name[0].toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-zinc-200">{lead.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 font-mono text-sm">{lead.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${lead.status === 'NEW'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opactiy-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDial(lead.phone)}
                                                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105"
                                                    title="Dial"
                                                >
                                                    <Phone size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
