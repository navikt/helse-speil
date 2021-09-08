import styled from '@emotion/styled';
import { Dagtype, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Button, Label, Select, TextField } from '@navikt/ds-react';

import { Flex } from '../../../../components/Flex';
import { PopoverHjelpetekst } from '../../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../../components/ikoner/SortInfoikon';
import { useOverstyringIsEnabled } from '../../../../hooks/useOverstyringIsEnabled';
import { useRevurderingIsEnabled } from '../../../../hooks/useRevurderingIsEnabled';
import { useAktivPeriode, useVedtaksperiode } from '../../../../state/tidslinje';

import { defaultUtbetalingToggles, overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { IconLocked } from './IconLocked';
import { IconOpen } from './IconOpen';
import { Overstyringsknapp } from './Overstyringsknapp';

const Container = styled.div`
    position: sticky;
    background-color: var(--navds-color-gray-10);
    padding: 1rem 2rem 2rem;
    top: 0;
    z-index: 10;

    label {
        font-weight: normal;
        font-size: 1rem;
    }
`;

const ToggleKnappContainer = styled(Flex)`
    min-height: 24px;
    margin-bottom: 1rem;
`;

const Dagtypevelger = styled(Select)`
    .navds-select__container {
        margin-right: 10px;
        width: 137px;
    }
`;

const Gradvelger = styled(TextField)`
    margin-right: 20px;
    width: 57px;

    input {
        height: 32px;
    }
`;

const Knapp = styled(Button)`
    margin-right: 10px;
    font-size: 1rem;
`;

const ToggleOverstyringKnapp = styled.button`
    position: absolute;
    top: 1rem;
    right: 2rem;
    border: none;
    background: none;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    color: var(--navds-color-action-default);
    font-size: 1rem;
    font-family: inherit;

    > svg {
        margin-right: 0.25rem;
    }

    &:focus,
    &:hover {
        text-decoration: underline;
    }
`;

const InputContainer = styled.div`
    display: flex;
    align-items: flex-end;
    margin-top: 1.25rem;
`;

const lovligeRevurderinger: ReadonlyMap<Dagtype, Array<Dagtype>> = new Map([
    [Dagtype.Syk, [Dagtype.Syk, Dagtype.Ferie]],
    [Dagtype.Ferie, [Dagtype.Syk, Dagtype.Ferie]],
]);

interface DagEndrerProps {
    onChangeDagtype: (dagtype: Dagtype) => void;
    onChangeGrad: (grad: number) => void;
    onEndre: () => void;
    overstyrer: boolean;
    toggleOverstyring: () => void;
}

export const DagEndrer: React.FC<DagEndrerProps> = ({
    onChangeDagtype,
    onChangeGrad,
    onEndre,
    overstyrer,
    toggleOverstyring,
}) => {
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyringIsEnabled = useOverstyringIsEnabled(defaultUtbetalingToggles);
    const periode = useVedtaksperiode(useAktivPeriode()?.id) as Vedtaksperiode;

    const dagKanOverstyres = (type: Dagtype): boolean =>
        (type !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(type)) ||
        (overstyrPermisjonsdagerEnabled && type === Dagtype.Permisjon);

    const dagtyperManKanEndreTil = (type: Dagtype) =>
        revurderingIsEnabled ? lovligeRevurderinger.get(type) : dagKanOverstyres(type);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeDagtype(event.target.value as Dagtype);
    };

    const onBlurGradInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeGrad(Number(event.target.value));
    };

    if (!overstyrer && (revurderingIsEnabled || overstyringIsEnabled)) {
        return (
            <ToggleKnappContainer>
                {periode.erForkastet ? (
                    <PopoverHjelpetekst ikon={<SortInfoikon />} offset={24}>
                        <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                    </PopoverHjelpetekst>
                ) : (
                    <ToggleOverstyringKnapp onClick={toggleOverstyring}>
                        <IconLocked />
                        {revurderingIsEnabled ? 'Revurder' : 'Endre'}
                    </ToggleOverstyringKnapp>
                )}
            </ToggleKnappContainer>
        );
    }

    return (
        <Container>
            <Label>Endre markerte dager</Label>
            <InputContainer>
                <Dagtypevelger size="s" label="Utbet. dager" onChange={onChange}>
                    {Object.values(Dagtype)
                        .filter(dagtyperManKanEndreTil)
                        .map((dagtype: Dagtype) => (
                            <option key={dagtype} data-testid="overstyrbar-dagtype-option">
                                {dagtype}
                            </option>
                        ))}
                </Dagtypevelger>
                <Gradvelger size="s" type="number" label="Grad" onBlur={onBlurGradInput} />
                <Knapp size="s" onClick={onEndre}>
                    Endre
                </Knapp>
                <ToggleOverstyringKnapp onClick={toggleOverstyring}>
                    <IconOpen />
                    Avbryt
                </ToggleOverstyringKnapp>
            </InputContainer>
        </Container>
    );
};
