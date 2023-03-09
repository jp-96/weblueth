import React from 'react';
import { WbxContextProvider } from '../../../src';

const requestHeartRateSensor = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    return await bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
    });
};

export type Services = {
    heart_rate?: BluetoothRemoteGATTService;
    battery_service?: BluetoothRemoteGATTService;
}

const getServices = async (device: BluetoothDevice): Promise<Services> => {
    if (!device || !device.gatt) {
        return {};
    }

    if (!device.gatt.connected) {
        await device.gatt.connect();
    }
    const services = await device.gatt.getPrimaryServices();
    console.log("services:", services);
    const heart_rate = await device.gatt.getPrimaryService('heart_rate');
    const battery_service = await device.gatt.getPrimaryService('battery_service');
    return { heart_rate, battery_service };
};

type Props = {
    children: any;
    bluetooth?: Bluetooth;
    connectionName?: string;
}

export function HeartRateContextProvider(props: Props) {
    const connectionName = props.connectionName ?? "Heart Rate";
    return (
        <WbxContextProvider
            getServices={getServices} requestDevice={requestHeartRateSensor}
            bluetooth={props.bluetooth} connectionName={connectionName}>
            {props.children}
        </WbxContextProvider>
    );
}
