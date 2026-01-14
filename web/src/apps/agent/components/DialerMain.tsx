import React from 'react';
import { useDialerStore } from '../../../shared/store/useDialerStore';
import { DialerPad } from './DialerPad';
import { ActiveCallDisplay } from './ActiveCallDisplay';
import { useDialerListener } from '../../../shared/hooks/useDialerListener';

export const DialerMain: React.FC = () => {
    // 1. Initialise the global listener to sync Socket -> State Machine
    useDialerListener();

    const { state } = useDialerStore();

    // The DialerMain acts as a router for telephony views
    return (
        <div className="h-full w-full flex items-center justify-center p-4">
            {state === 'IDLE' ? (
                <DialerPad />
            ) : (
                <ActiveCallDisplay />
            )}
        </div>
    );
};
