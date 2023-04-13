import styled from '@emotion/styled';
import React from 'react';

import { Checkbox } from '@navikt/ds-react';

import { erCoachEllerSuper, erUtvikling } from '@utils/featureToggles';

import { erEksplisittHelg } from './Utbetalingstabell';

export const dagKanOverstyres = (
    erAGP: boolean | undefined,
    erForeldet: boolean | undefined,
    dagtype: Utbetalingstabelldagtype
) => {
    let dagKanOverstyres: Boolean = !erForeldet && !['Helg'].includes(dagtype);

    if (!erUtvikling() && !erCoachEllerSuper()) {
        dagKanOverstyres =
            dagKanOverstyres &&
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
    erAGP?: boolean;
    erForeldet?: boolean;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({
    index,
    dagtype,
    erAGP,
    erForeldet,
    ...rest
}) => {
    const _dagKanOverstyres: Boolean = dagKanOverstyres(erAGP, erForeldet, dagtype);

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
