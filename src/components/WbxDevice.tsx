import React, { useCallback, useEffect } from 'react';
import { WbBoundCallback } from '../core/WbContext';
import { WbxDeviceEffector, useWbxActor } from './WbxContext';

interface Props {
    //children?: any;
    onDeviceBound?: WbBoundCallback<BluetoothDevice>;
}

export function WbxDevice(props: Props) {
    const [state] = useWbxActor();

    const cb = useCallback<WbBoundCallback<BluetoothDevice>>((bound) => {
        if (props.onDeviceBound) {
            props.onDeviceBound(bound);
        }
    }, []);
    useEffect(WbxDeviceEffector(state, cb), []);

    return (
        <React.Fragment />
    );
}
