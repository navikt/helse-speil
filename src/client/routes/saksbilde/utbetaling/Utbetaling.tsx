import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Person, Vedtaksperiode } from 'internal-types';
import React, { useState } from 'react';

import { Feilmelding } from 'nav-frontend-typografi';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import { Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
import { usePerson } from '../../../state/person';

import { overstyrbareTabellerEnabled, overstyreUtbetaltPeriodeEnabled } from '../../../featureToggles';
import { OverstyrbarUtbetalingstabell } from './utbetalingstabell/OverstyrbarUtbetalingstabell';
import { OverstyringTimeoutModal } from './utbetalingstabell/OverstyringTimeoutModal';
import { Overstyringsknapp } from './utbetalingstabell/Overstyringsknapp';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';

const FeilmeldingContainer = styled.div`
    margin-top: 1rem;
`;

const førsteArbeidsgiversSistePeriode = (person: Person) => person.arbeidsgivere[0].tidslinjeperioder?.[0]?.[0];

const kunEnArbeidsgiver = (person: Person) => person.arbeidsgivere.length === 1;

const revurderingEnabled = (person: Person, periode: Tidslinjeperiode): boolean =>
    overstyreUtbetaltPeriodeEnabled &&
    kunEnArbeidsgiver(person) &&
    periode === førsteArbeidsgiversSistePeriode(person) &&
    [Tidslinjetilstand.Utbetalt, Tidslinjetilstand.UtbetaltAutomatisk, Tidslinjetilstand.Revurdert].includes(
        periode.tilstand
    );

const overstyringEnabled = (person: Person, periode: Tidslinjeperiode): boolean =>
    overstyrbareTabellerEnabled &&
    kunEnArbeidsgiver(person) &&
    [
        Tidslinjetilstand.Oppgaver,
        Tidslinjetilstand.Avslag,
        Tidslinjetilstand.IngenUtbetaling,
        Tidslinjetilstand.Feilet,
    ].includes(periode.tilstand);

export interface UtbetalingProps {
    periode: Tidslinjeperiode;
    vedtaksperiode: Vedtaksperiode;
    maksdato?: Dayjs;
    gjenståendeDager?: number;
}

export const Utbetaling = ({ gjenståendeDager, maksdato, periode, vedtaksperiode }: UtbetalingProps) => {
    const person = usePerson() as Person;

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const toggleOverstyring = () => {
        setOverstyrer((value) => !value);
    };

    const revurderingIsEnabled = revurderingEnabled(person, periode);
    const overstyringIsEnabled = overstyringEnabled(person, periode);

    return (
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <FlexColumn style={{ paddingBottom: '4rem' }}>
                {(overstyringIsEnabled || revurderingIsEnabled) && (
                    <Flex justifyContent="flex-end" style={{ paddingTop: '1rem' }}>
                        <Overstyringsknapp overstyrer={overstyrer} toggleOverstyring={toggleOverstyring}>
                            {revurderingIsEnabled ? 'Revurder' : 'Endre'}
                        </Overstyringsknapp>
                    </Flex>
                )}
                <Flex style={{ height: '100%', paddingTop: '1rem' }}>
                    {overstyrer ? (
                        <OverstyrbarUtbetalingstabell
                            periode={periode}
                            onPostOverstyring={postOverstyring}
                            onCloseOverstyring={() => setOverstyrer(false)}
                            gjenståendeDager={gjenståendeDager}
                            maksdato={maksdato}
                            erRevurdering={revurderingIsEnabled}
                        />
                    ) : (
                        <Utbetalingstabell
                            maksdato={maksdato}
                            gjenståendeDager={gjenståendeDager}
                            periode={periode}
                            overstyringer={vedtaksperiode.overstyringer}
                        />
                    )}
                </Flex>
                {state === 'timedOut' && <OverstyringTimeoutModal onRequestClose={() => null} />}
                {state === 'hasError' && (
                    <FeilmeldingContainer>
                        {error && <Feilmelding role="alert">{error}</Feilmelding>}
                    </FeilmeldingContainer>
                )}
            </FlexColumn>
        </AgurkErrorBoundary>
    );
};
