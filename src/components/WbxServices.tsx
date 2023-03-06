import React, { useCallback, useEffect } from 'react';
import { WbBoundCallback, WbCustomServices } from '../core/WbContext';
import { WbxServicesEffector, useWbxActor } from './WbxContext';

interface Props {
    //children?: any;
    onServicesBound?: WbBoundCallback<WbCustomServices>;
}

export function WbxServices(props: Props) {
    const [state] = useWbxActor();

    const cb = useCallback<WbBoundCallback<WbCustomServices>>((bound) => {
        if (props.onServicesBound) {
            props.onServicesBound(bound);
        }
    }, []);
    useEffect(WbxServicesEffector(state, cb), []);

    return (
        <React.Fragment />
    );
}
