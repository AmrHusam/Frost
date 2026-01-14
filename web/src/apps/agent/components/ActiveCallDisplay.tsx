import React, { useEffect, useState } from 'react';
import { PhoneOff, Pause, Play, User, Clock, AlertCircle } from 'lucide-react';
import { useDialerStore, useDialerActions } from '../../../shared/store/useDialerStore';
import { useFrostCommands } from '../../../shared/hooks/useFrost';
import { useSocketStore } from '../../../shared/store/useSocketStore';

export const ActiveCallDisplay: React.FC = () => {
    const { state, context, reset } = useDialerStore();
    const { canHold, canResume, canHangup, canReset } = useDialerActions();
    const { emit } = useFrostCommands();
    const { isConnected } = useSocketStore();

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!context.startTime || state !== 'CONNECTED') return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - context.startTime!) / 1000);
            setSeconds(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [context.startTime, state]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleHangup = () => {
        if (!context.callId || !isConnected) return;
        emit('call.hangup', { v: 1, callId: context.callId }, (res: any) => {
            if (!res.success) {
                useSocketStore.getState().showToast('Hangup failed', 'error');
            }
        });
    };

    const handleHoldToggle = () => {
        if (!context.callId || !isConnected) return;
        const action = state === 'HOLD' ? 'call.resume' : 'call.hold';
        emit(action as any, { v: 1, callId: context.callId }, (res: any) => {
            if (!res.success) {
                useSocketStore.getState().showToast('Action failed', 'error');
            }
        });
    };

    const statusColors = {
        DIALING: 'text-blue-400 animate-pulse',
        RINGING: 'text-amber-400 animate-pulse',
        CONNECTED: 'text-emerald-400',
        HOLD: 'text-orange-400',
        ENDED: 'text-white/40',
        FAILED: 'text-rose-500',
    };

    return (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
            {!isConnected && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center text-center p-8">
                    <div className="text-white space-y-2">
                        <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
                        <h3 className="text-xl font-bold">LINK SEVERED</h3>
                        <p className="text-sm text-white/60">Re-establishing secure channel...</p>
                    </div>
                </div>
            )}

            <div className="text-center mb-8">
                <div className={`text-xs uppercase tracking-[0.3em] font-bold mb-2 ${statusColors[state as keyof typeof statusColors]}`}>
                    {state}
                </div>
                <div className="h-20 w-20 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User size={40} className="text-white/20" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                    {context.customerName || context.customerNumber || 'Anonymous'}
                </h2>
                <div className="font-mono text-white/40">{context.customerNumber}</div>
            </div>

            {state === 'CONNECTED' && (
                <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-center gap-2 mb-8 border border-white/5">
                    <Clock size={16} className="text-emerald-400" />
                    <span className="text-2xl font-mono text-white tracking-widest">{formatTime(seconds)}</span>
                </div>
            )}

            {state === 'FAILED' && (
                <div className="bg-rose-500/20 border border-rose-500/40 rounded-2xl p-4 text-rose-200 text-sm mb-8 text-center italic">
                    {context.error || 'System fault detected'}
                </div>
            )}

            <div className="flex gap-4">
                {(state === 'CONNECTED' || state === 'HOLD') && (
                    <button
                        onClick={handleHoldToggle}
                        className="flex-1 h-16 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95"
                    >
                        {state === 'HOLD' ? <Play className="fill-current" /> : <Pause className="fill-current" />}
                    </button>
                )}

                {canHangup && (
                    <button
                        onClick={handleHangup}
                        className="flex-1 h-16 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                    >
                        <PhoneOff />
                    </button>
                )}

                {canReset && (
                    <button
                        onClick={reset}
                        className="w-full h-16 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-95"
                    >
                        RETURN TO DIALER
                    </button>
                )}
            </div>
        </div>
    );
};
