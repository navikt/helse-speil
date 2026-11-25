import { ReactElement } from 'react';

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
                            <Checkbox value="kanVurdereOppholdskrav" onChange={toggle('kanVurdereOppholdskrav')}>
                                Vurder oppholdskrav (sp-avslagsdager)
                            </Checkbox>
                        )}
                        {erUtvikling && (
                            <Checkbox
                                value="kanOverstyreAlleMedlemskapsstatuser"
                                onChange={toggle('kanOverstyreAlleMedlemskapsstatuser')}
                            >
                                Overstyr alle medlemskapsstatuser
                            </Checkbox>
                        )}
                        {erUtvikling && (
                            <Checkbox value="nyttVarseldesign" onChange={toggle('nyttVarseldesign')}>
                                Nytt varseldesign
                            </Checkbox>
                        )}
                        {erUtvikling && (
                            <Checkbox value="nyttSaksbildeoppsett" onChange={toggle('nyttSaksbildeoppsett')}>
                                Nytt saksbildeoppsett
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
    if (erUtvikling && state.kanVurdereOppholdskrav) array.push('kanVurdereOppholdskrav');
    if (erUtvikling && state.kanOverstyreAlleMedlemskapsstatuser) array.push('kanOverstyreAlleMedlemskapsstatuser');
    if (erUtvikling && state.nyttVarseldesign) array.push('nyttVarseldesign');
    if (erUtvikling && state.nyttSaksbildeoppsett) array.push('nyttSaksbildeoppsett');
    if (harUtviklerRolle && state.utviklersnacks) array.push('utviklersnacks');
    return array;
};
