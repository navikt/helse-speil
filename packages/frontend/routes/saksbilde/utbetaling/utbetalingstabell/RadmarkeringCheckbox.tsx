import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Checkbox } from '@navikt/ds-react';

import { erCoachEllerSuper, erUtvikling } from '@utils/featureToggles';

import { DisabledCheckbox } from './DisabledCheckbox';
import { erEksplisittHelg } from './Utbetalingstabell';

export const dagKanOverstyres = (
    dato: DateString,
    erAGP: boolean | undefined,
    erForeldet: boolean | undefined,
    dagtype: Utbetalingstabelldagtype,
    skjæringstidspunkt: DateString
) => {
    const erSkjæringstidspunkt: boolean = dayjs(dato).isSame(skjæringstidspunkt, 'day');
    let dagKanOverstyres: Boolean = !erForeldet && !['Helg'].includes(dagtype);

    if (!erUtvikling() && !erCoachEllerSuper()) {
        dagKanOverstyres =
            dagKanOverstyres &&
            !erSkjæringstidspunkt &&
            !erAGP &&
            !erEksplisittHelg(dagtype) &&
            ['Syk', 'Ferie', 'Egenmelding', 'Permisjon'].includes(dagtype);
    }

    return dagKanOverstyres;
};

const Container = styled.div`
    position: relative;
    padding: 1rem;

    > div {
        position: absolute;
        padding: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        > input {
            max-height: 2rem;
            max-width: 2rem;
        }
    }
`;

interface RadmarkeringCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    index: number;
    dagtype: Utbetalingstabelldagtype;
    dato: DateString;
    erAGP?: boolean;
    erForeldet?: boolean;
    skjæringstidspunkt: DateString;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({
    index,
    dagtype,
    dato,
    erAGP,
    erForeldet,
    skjæringstidspunkt,
    ...rest
}) => {
    const erSkjæringstidspunkt: boolean = dayjs(dato).isSame(skjæringstidspunkt, 'day');

    const _dagKanOverstyres: Boolean = dagKanOverstyres(dato, erAGP, erForeldet, dagtype, skjæringstidspunkt);

    if (!_dagKanOverstyres && erSkjæringstidspunkt && !erAGP) {
        return <DisabledCheckbox label="Kan foreløpig ikke endres. Mangler støtte for skjæringstidspunkt" />;
    }

    if (!_dagKanOverstyres) {
        return <Container />;
    }

    return (
        <Container>
            <Checkbox {...rest} hideLabel>
                Velg rad {index + 1} for endring
            </Checkbox>
        </Container>
    );
};
