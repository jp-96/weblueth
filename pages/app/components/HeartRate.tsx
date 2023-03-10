import React, { useEffect, useState } from 'react';
import { WbBoundCallback, WbxCustomEventCallback, WbxServiceProps, WbxServices } from '../../../src';
import { Services } from './HeartRateContextProvider';
import { HeartRateMeasurement, HeartRateService } from '../services/heartrate';

interface Props extends WbxServiceProps<HeartRateService> {
    onHeartRateMeasurementChanged?: WbxCustomEventCallback<HeartRateMeasurement>;
}

const HeartRateMeasurementChanged = 'HeartRateMeasurementChanged';

export function HeartRate(props: Props) {
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.heartRateService;
        if (target) {
            if (bound.binding) {
                if (props.onHeartRateMeasurementChanged) {
                    target.addEventListener(HeartRateMeasurementChanged, props.onHeartRateMeasurementChanged);
                }
            } else {
                if (props.onHeartRateMeasurementChanged) {
                    target.removeEventListener(HeartRateMeasurementChanged, props.onHeartRateMeasurementChanged);
                }
            }
            if (props.onServiceBound) {
                props.onServiceBound({ ...bound, target });
            }
        }
    };

    return (
        <WbxServices onServicesBound={onServicesBound} />
    );
}
