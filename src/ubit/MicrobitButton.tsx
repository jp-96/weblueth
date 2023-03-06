import React from 'react';
import { WbxCustomEventCallback, WbxServiceProps } from '../wbx/WbxContext';
import { WbBoundCallback } from '../wb/WbContext';
import { WbxServices } from '../wbx/WbxServices';
import { ButtonService, ButtonState } from 'microbit-web-bluetooth/types/services/button';
import { Services } from 'microbit-web-bluetooth';

interface Props extends WbxServiceProps<ButtonService> {
    onButtonAStateChanged?: WbxCustomEventCallback<ButtonState>;
    onButtonBStateChanged?: WbxCustomEventCallback<ButtonState>;
}

const buttonastatechanged = 'buttonastatechanged';
const buttonbstatechanged = 'buttonbstatechanged';

export function MicrobitButton(props: Props) {

    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.buttonService;
        if (target) {
            if (bound.binding) {
                // button A
                if (props.onButtonAStateChanged) {
                    target.addEventListener(buttonastatechanged, props.onButtonAStateChanged)
                }
                // button B
                if (props.onButtonBStateChanged) {
                    target.addEventListener(buttonbstatechanged, props.onButtonBStateChanged)
                }
            } else {
                // button A
                if (props.onButtonAStateChanged) {
                    target.removeEventListener(buttonastatechanged, props.onButtonAStateChanged)
                }
                // button B
                if (props.onButtonBStateChanged) {
                    target.removeEventListener(buttonbstatechanged, props.onButtonBStateChanged)
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
