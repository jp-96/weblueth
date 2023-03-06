import React, { useEffect, useState } from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { DeviceInformationService } from 'microbit-web-bluetooth/types/services/device-information';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<DeviceInformationService> {
}

export function MicrobitDeviceInformation(props: Props) {
    
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.deviceInformationService;
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
