import React, { useState, useEffect } from 'react';
import { Phone, PhoneOutgoing, Activity, Delete } from 'lucide-react';
import { useDialerStore, useDialerActions } from '../../../shared/store/useDialerStore';
import { useFrostCommands } from '../../../shared/hooks/useFrost';
import { useSocketStore } from '../../../shared/store/useSocketStore';

export const DialerPad: React.FC = () => {
    // We now use local state for immediate feedback but sync with store if needed, 
    // OR just use local state and populate it from store on mount if we want "prefill".
    // For simplicity, let's use the store's context.customerNumber as the source of truth if we want persistence, modification?
    // Actually, local state is smoother for typing, but we need to receive props or read store.

    const { context, setNumber: setStoreNumber } = useDialerStore();
    const [localNumber, setLocalNumber] = useState(context.customerNumber || '');
    const [initiating, setInitiating] = useState(false);

    const { emit } = useFrostCommands();
    const { canDial } = useDialerActions();
    const { isConnected } = useSocketStore();

    // Sync from store if store changes (e.g. via Contacts)
    useEffect(() => {
        if (context.customerNumber) {
            setLocalNumber(context.customerNumber);
        }
    }, [context.customerNumber]);

    const handleCall = () => {
        if (!localNumber || !canDial || !isConnected || initiating) return;

        setInitiating(true);
        console.log(`[Dialer] Initiating outbound call to ${localNumber}...`);

        // Update store so active call display has the number
        setStoreNumber(localNumber);

        emit('call.initiate', { v: 1, customerNumber: localNumber }, (res: any) => {
            setInitiating(false);
            if (!res.success) {
                useSocketStore.getState().showToast('Call failed: ' + res.error?.message, 'error');
            }
        });
    };

    const handleKeypad = (val: string) => {
        if (!canDial) return;
        setLocalNumber(prev => (prev + val).slice(0, 15));
    };

    const handleBackspace = () => {
        setLocalNumber(prev => prev.slice(0, -1));
    };

    return (
        <div className="w-full max-w-sm bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 text-center relative z-10">
                <div className="h-20 flex items-center justify-center text-3xl font-mono text-white tracking-widest bg-black/40 rounded-2xl mb-3 border border-white/5 relative group cursor-text">
                    {localNumber || <span className="text-zinc-700 select-none">ENTER NUMBER</span>}
                    {localNumber.length > 0 && (
                        <button
                            onClick={handleBackspace}
                            className="absolute right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <Delete size={20} />
                        </button>
                    )}
                </div>
                <div className={`text-[10px] uppercase tracking-wider font-bold ${isConnected ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isConnected ? '• Network Ready •' : '• Offline •'}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 relative z-10">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                    <button
                        key={key}
                        disabled={!canDial || !isConnected}
                        onClick={() => handleKeypad(key)}
                        className="h-14 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xl font-medium text-white disabled:opacity-20 disabled:cursor-not-allowed shadow-sm border border-white/5"
                    >
                        {key}
                    </button>
                ))}
            </div>

            <button
                disabled={!canDial || !localNumber || !isConnected || initiating}
                onClick={handleCall}
                className="relative z-10 w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none"
            >
                {initiating ? (
                    <Activity className="animate-spin" size={20} />
                ) : (
                    <PhoneOutgoing size={20} />
                )}
                {initiating ? 'CONNECTING...' : 'START CALL'}
            </button>
        </div>
    );
};
