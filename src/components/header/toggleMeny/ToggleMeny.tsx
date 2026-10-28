import React, { ReactElement } from 'react';

import { Checkbox, CheckboxGroup, Dialog } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { useHarUtviklerRolle } from '@hooks/brukerrolleHooks';
import { ToggleState, useToggle } from '@state/toggles';

export function ToggleMeny(): ReactElement {
    const { value, toggle } = useToggle();
    const harUtviklerRolle = useHarUtviklerRolle();

    return (
        <Dialog.Popup width="small">
            <Dialog.Header>
                <Dialog.Title>Toggles</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <form>
                    <CheckboxGroup
                        legend="Toggles"
                        hideLegend
                        value={toggleStateToCheckboxValue(value, harUtviklerRolle)}
                    >
                        <Checkbox value="kanBeslutteEgne" onChange={toggle('kanBeslutteEgne')}>
                            Kan beslutte egen beslutteroppgave
                        </Checkbox>
                        {erUtvikling && (
                            <Checkbox value="nyMedlemskapsvisning" onChange={toggle('nyMedlemskapsvisning')}>
                                Ny medlemskapsvisning (sp-medlemskap)
                            </Checkbox>
                        )}
                        {harUtviklerRolle && (
                            <Checkbox value="utviklersnacks" onChange={toggle('utviklersnacks')}>
                                Utviklersnacks
                            </Checkbox>
                        )}
                    </CheckboxGroup>
                </form>
            </Dialog.Body>
        </Dialog.Popup>
    );
}

const toggleStateToCheckboxValue = (state: ToggleState, harUtviklerRolle: boolean): string[] => {
    const array: string[] = [];
    if (state.kanBeslutteEgne) array.push('kanBeslutteEgne');
    if (erUtvikling && state.nyMedlemskapsvisning) array.push('nyMedlemskapsvisning');
    if (harUtviklerRolle && state.utviklersnacks) array.push('utviklersnacks');
    return array;
};
