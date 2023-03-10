import React from 'react';
import { WbxContextProvider } from '../../../src';
import { createServiceBuilder } from '../../../src/gattbuilder';
import { HeartRateService } from '../services/heartrate'

const requestHeartRateSensor = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    return await bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
    });
};

export type Services = {
    heartRateService?: HeartRateService;
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
    const builder = createServiceBuilder(services);
    const heartRateService = await builder.createService(HeartRateService);
    const battery_service = await device.gatt.getPrimaryService('battery_service');
    return { heartRateService, battery_service };
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
