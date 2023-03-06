import React, { useEffect, useState } from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { AccelerometerData, AccelerometerPeriod, AccelerometerService } from 'microbit-web-bluetooth/types/services/accelerometer';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<AccelerometerService> {
    onAccelerometerDataChanged?: WbxCustomEventCallback<AccelerometerData>;
    accelerometerPeriod?: AccelerometerPeriod;
}

const accelerometerdatachanged = 'accelerometerdatachanged';

export function MicrobitAccelerometer(props: Props) {
    const [service, setService] = useState<AccelerometerService | undefined>(undefined);

    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.accelerometerService;
        if (target) {
            if (bound.binding) {
                if (props.onAccelerometerDataChanged) {
                    target.addEventListener(accelerometerdatachanged, props.onAccelerometerDataChanged)
                }
                setService(target);
            } else {
                if (props.onAccelerometerDataChanged) {
                    target.removeEventListener(accelerometerdatachanged, props.onAccelerometerDataChanged)
                }
                setService(undefined);
            }
            if (props.onServiceBound) {
                props.onServiceBound({ ...bound, target });
            }
        }
    };

    useEffect(() => {
        if (service && props.accelerometerPeriod) {
            service.setAccelerometerPeriod(props.accelerometerPeriod);
        }
    }, [service, props.accelerometerPeriod]);

    return (
        <WbxServices onServicesBound={onServicesBound} />
    );
}
