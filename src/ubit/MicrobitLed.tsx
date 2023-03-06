import React, { useEffect, useState } from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { LedService } from 'microbit-web-bluetooth/types/services/led';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<LedService> {
}

export function MicrobitLed(props: Props) {
    
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.ledService;
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
