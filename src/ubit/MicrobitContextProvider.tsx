import React from 'react';
import { WbxContextProvider } from '../wbx/WbxContext'
import { getServices, requestMicrobit } from 'microbit-web-bluetooth';

type Props = {
    children: any;
    bluetooth?: Bluetooth;
    connectionName?: string;
}

export function MicrobitContextProvider(props: Props) {
    const connectionName = props.connectionName ?? "micro:bit";
    return (
        <WbxContextProvider getServices={getServices} requestDevice={requestMicrobit} bluetooth={props.bluetooth} connectionName={connectionName}>
            {props.children}
        </WbxContextProvider>
    );
}
