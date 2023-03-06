import React, { useState } from 'react';
import { MicrobitTemperature, WbBoundCallback, WbxCustomEventCallback } from 'weblueth-react';
import { TemperatureService } from 'microbit-web-bluetooth/types/services/temperature';

type Props = {
}

export default function MicrobitTemperatureView(props: Props) {
    const [state, setState] = useState<number | '-'>('-');

    const onTemperatureChanged: WbxCustomEventCallback<number> = event => {
        //console.log("onTemperatureChanged:", event.detail);
        setState(event.detail);
    };

    const onServiceBound: WbBoundCallback<TemperatureService> = async bound => {
        if (bound.binding) {
            const t = await bound.target.readTemperature();
            //console.log("readTemperature:", t);
            setState(t);
        } else {
            setState("-")
        }
    };

    return (
        <React.Fragment>
            <MicrobitTemperature onTemperatureChanged={onTemperatureChanged} onServiceBound={onServiceBound} temperaturePeriod={5000} />
            {state}
        </React.Fragment>
    );
}
