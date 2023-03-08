import React, { useCallback, useState } from 'react';
import { useWbxActor, WbBoundCallback, WbxDevice, WbxServices } from '../../../src';
import { Services } from './HeartRateContextProvider';

/**
 * Web Bluetooth
 * Draft Community Group Report, 9 June 2022
 * Example
 * 
 * https://webbluetoothcg.github.io/web-bluetooth/#introduction-examples
 * 
 */

type Result = {
    heartRate?: any;
    contactDetected?: any;
    energyExpended?: any;
    rrIntervals?: any
};

function parseHeartRate(data: any) {
    let flags = data.getUint8(0);
    let rate16Bits = flags & 0x1;
    let result: Result = {};
    let index = 1;
    if (rate16Bits) {
        result.heartRate = data.getUint16(index, /*littleEndian=*/true);
        index += 2;
    } else {
        result.heartRate = data.getUint8(index);
        index += 1;
    }
    let contactDetected = flags & 0x2;
    let contactSensorPresent = flags & 0x4;
    if (contactSensorPresent) {
        result.contactDetected = !!contactDetected;
    }
    let energyPresent = flags & 0x8;
    if (energyPresent) {
        result.energyExpended = data.getUint16(index, /*littleEndian=*/true);
        index += 2;
    }
    let rrIntervalPresent = flags & 0x10;
    if (rrIntervalPresent) {
        let rrIntervals = [];
        for (; index + 1 < data.byteLength; index += 2) {
            rrIntervals.push(data.getUint16(index, /*littleEndian=*/true) as never);
        }
        result.rrIntervals = rrIntervals;
    }
    return result;
}

function convLocation(sensorLocation) {
    switch (sensorLocation) {
        case 0: return 'Other';
        case 1: return 'Chest';
        case 2: return 'Wrist';
        case 3: return 'Finger';
        case 4: return 'Hand';
        case 5: return 'Ear Lobe';
        case 6: return 'Foot';
        default: return 'Unknown';
    }
}

const defaultName = "(none)";
const defaultLocation = "(unknown)";

export default function HeartRate() {
    const [state, send] = useWbxActor();

    const connectionName = state.context.conn.name;

    // xstate actions
    const reset = () => send("RESET");
    const request = () => send("REQUEST");
    const connect = () => send("CONNECT");
    const disconnect = () => send("DISCONNECT");

    // rejectedReason
    if (state.context.rejectedReason.type !== "NONE") {
        console.log("rejectedReason:", state.context.rejectedReason.message);
    }

    // disconnectedReason
    if (state.context.disconnectedReason.type !== "NONE") {
        console.log("disconnectedReason:", state.context.disconnectedReason.message);
    }

    const [name, setName] = useState<string>(defaultName);

    const onDeviceBound: WbBoundCallback<BluetoothDevice> = bound => {
        if (bound.binding) {
            setName(bound.target.name!);
        } else {
            setName(defaultName);
        }
    }

    const [heartRateMeasurement, setHeartRateMeasurement] = useState<BluetoothRemoteGATTCharacteristic | undefined>(undefined);
    const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
    const [location, setLocation] = useState(defaultLocation);

    const onHeartRateMeasurementChanged = useCallback((event: any) => {
        setHeartRate(parseHeartRate(event.target.value).heartRate);
    }, []);

    const onServicesBound: WbBoundCallback<Services> = async bound => {
        const heart_rate = bound.target.heart_rate;
        if (heart_rate) {
            if (bound.binding) {
                // heart_rate_measurement
                const heart_rate_measurement = await heart_rate.getCharacteristic('heart_rate_measurement');
                setHeartRateMeasurement(heart_rate_measurement);
                heart_rate_measurement.addEventListener("characteristicvaluechanged", onHeartRateMeasurementChanged)
                await heart_rate_measurement.startNotifications();
                // body_sensor_location
                const body_sensor_location = await heart_rate.getCharacteristic("body_sensor_location");
                const value = await body_sensor_location.readValue();
                setLocation(convLocation(value.getUint8(0)));
            } else {
                if (heartRateMeasurement) {
                    await heartRateMeasurement.stopNotifications();
                    heartRateMeasurement.removeEventListener("characteristicvaluechanged", onHeartRateMeasurementChanged)
                }
                setHeartRate(undefined);
                setLocation(defaultLocation);

            }
        }
    };

    return (
        <>
            <WbxDevice onDeviceBound={onDeviceBound} />
            <WbxServices onServicesBound={onServicesBound} />
            {connectionName + ": [" + state.toStrings() + "]"}
            <br />
            <button onClick={reset}>RESET</button>
            <button onClick={request}>REQUEST</button>
            <button onClick={connect}>CONNECT</button>
            <button onClick={disconnect}>DISCONNECT</button>
            <br />
            Name: {name}
            <br />
            Loaction: {location}
            <br />
            Heart Rate: {heartRate ?? "---"}
        </>
    );
}
