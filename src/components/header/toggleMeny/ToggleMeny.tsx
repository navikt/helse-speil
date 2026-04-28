import React, { ReactElement } from 'react';

import { Checkbox, CheckboxGroup, Dialog } from '@navikt/ds-react';

import { ToggleState, useToggle } from '@state/toggles';

export function ToggleMeny(): ReactElement {
    const { value, toggle } = useToggle();

    return (
        <Dialog.Popup width="small">
            <Dialog.Header>
                <Dialog.Title>Toggles</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <form>
                    <CheckboxGroup legend="Toggles" hideLegend value={toggleStateToCheckboxValue(value)}>
                        <Checkbox value="kanBeslutteEgne" onChange={toggle('kanBeslutteEgne')}>
                            Kan beslutte egen beslutteroppgave
                        </Checkbox>
                        <Checkbox value="nyInngangsvilkår" onChange={toggle('nyInngangsvilkår')}>
                            Bruk ny versjon av inngangsvilkår
                        </Checkbox>
                        <Checkbox value="dialogmelding" onChange={toggle('dialogmelding')}>
                            Bruk dialogmelding
                        </Checkbox>
                    </CheckboxGroup>
                </form>
            </Dialog.Body>
        </Dialog.Popup>
    );
}

const toggleStateToCheckboxValue = (state: ToggleState): string[] => {
    const array: string[] = [];
    if (state.kanBeslutteEgne) array.push('kanBeslutteEgne');
    if (state.nyInngangsvilkår) array.push('nyInngangsvilkår');
    if (state.dialogmelding) array.push('dialogmelding');
    return array;
};
