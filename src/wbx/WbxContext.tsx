import React, { EffectCallback } from 'react';
import { State } from 'xstate'; // yarn add --dev xstate
import { createActorContext } from '@xstate/react'; // yarn add --dev @xstate/react
import { createWbContext, machineWithoutContext } from '../wb/WbMachine';
import { WbConnection, WbContext, WbBoundCallback, GetServices, RequestDevice, WbCustomServices } from '../wb/WbContext';

const WbxActorContext = createActorContext(machineWithoutContext);

export const useWbxActor = () => WbxActorContext.useActor();
export const useWbxActorRef = () => WbxActorContext.useActorRef();

type Props = {
    children: any;
    getServices: GetServices;
    requestDevice: RequestDevice;
    bluetooth?: Bluetooth;
    connectionName?: string;
}

export function WbxContextProvider(props: Props) {
    const bluetooth = props.bluetooth ?? window.navigator.bluetooth;
    const context = createWbContext(new WbConnection(props.getServices, props.requestDevice, bluetooth, props.connectionName));
    return (
        <WbxActorContext.Provider machine={() => machineWithoutContext.withContext(context)}>
            {props.children}
        </WbxActorContext.Provider>
    );
}

// helper

type StateWithContext = State<WbContext, any, any, any, any>;
type ConnectionContainer = StateWithContext | WbContext | WbConnection

export function WbxRefConnection(cc: ConnectionContainer): WbConnection {
    if ((cc as StateWithContext).context.conn) {
        return (cc as StateWithContext).context.conn;
    }
    if ((cc as WbContext).conn) {
        return (cc as WbContext).conn;
    }
    if (cc as WbConnection) {
        return (cc as WbConnection);
    }
    return undefined!;
}

export function WbxDeviceEffector(cc: ConnectionContainer, cb: WbBoundCallback<BluetoothDevice>): EffectCallback {
    return () => {
        /**
         * NOTE:
         * When StrictMode is enabled, React intentionally double-invokes
         * effects (mount -> unmount -> mount) for newly mounted components. 
         * https://github.com/reactwg/react-18/discussions/19
         */

        //console.log("DeviceEffector init:", cb)
        const conn = WbxRefConnection(cc);
        conn.addDeviceBoundCallback(cb);
        return () => {
            //console.log("DeviceEffector deinit:", cb)
            conn.removeDeviceBoundCallback(cb);
        };
    }
}

export function WbxServicesEffector(cc: ConnectionContainer, cb: WbBoundCallback<WbCustomServices>): EffectCallback {
    return () => {
        /**
         * NOTE:
         * When StrictMode is enabled, React intentionally double-invokes
         * effects (mount -> unmount -> mount) for newly mounted components. 
         * https://github.com/reactwg/react-18/discussions/19
         */

        //console.log("ServicesEffector init:", cb)
        const conn = WbxRefConnection(cc);
        conn.addServicesBoundCallback(cb);
        return () => {
            //console.log("ServicesEffector deinit:", cb)
            conn.removeServicesBoundCallback(cb);
        };
    }
}

// type, interface

export type WbxCustomEventCallback<T> = (event: CustomEvent<T>) => void;

export interface WbxServiceProps<T> {
    //children?: any;
    onServiceBound?: WbBoundCallback<T>;
}
