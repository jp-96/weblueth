import React, { useEffect, useState } from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { IoPinService } from 'microbit-web-bluetooth/types/services/io-pin';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<IoPinService> {
}

export function MicrobitIoPin(props: Props) {
    
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.ioPinService;
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
