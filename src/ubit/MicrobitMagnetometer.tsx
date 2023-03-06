import React, { useEffect, useState } from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { MagnetometerService } from 'microbit-web-bluetooth/types/services/magnetometer';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<MagnetometerService> {
}

export function MicrobitMagnetometer(props: Props) {
    
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.magnetometerService;
        if (target) {
            if (props.onServiceBound) {
                props.onServiceBound({ ...bound, target});
            }
        }
    };

    return (
        <WbxServices onServicesBound={onServicesBound} />
    );
}
