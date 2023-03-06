import React, { useEffect, useState } from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { TemperatureService } from 'microbit-web-bluetooth/types/services/temperature';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<TemperatureService> {
    onTemperatureChanged?: WbxCustomEventCallback<number>;
    /**
     * Determines the frequency with which temperature data is updated in milliseconds(UINT16).
     */
    temperaturePeriod?: number;
}

const temperaturechanged = 'temperaturechanged';

export function MicrobitTemperature(props: Props) {
    const [service, setService] = useState<TemperatureService | undefined>(undefined);

    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.temperatureService;
        if (target) {
            if (bound.binding) {
                if (props.onTemperatureChanged) {
                    target.addEventListener(temperaturechanged, props.onTemperatureChanged);
                }
                setService(target);
            } else {
                if (props.onTemperatureChanged) {
                    target.removeEventListener(temperaturechanged, props.onTemperatureChanged);
                }
                setService(undefined);
            }
            if (props.onServiceBound) {
                props.onServiceBound({ ...bound, target });
            }
        }
    };
    
    useEffect(() => {
        if (service && props.temperaturePeriod) {
            service.setTemperaturePeriod(props.temperaturePeriod);
        }
    }, [service, props.temperaturePeriod]);

    return (
        <WbxServices onServicesBound={onServicesBound} />
    );
}
