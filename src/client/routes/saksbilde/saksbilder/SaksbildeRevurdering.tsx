import React from 'react';
import { Flex } from '../../../components/Flex';
import { Sakslinje } from '../sakslinje/Sakslinje';
import '@navikt/helse-frontend-logg/lib/main.css';
import { Tidslinjeperiode, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { LoggHeader } from '../Saksbilde';

interface SaksbildeRevurderingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeRevurdering = ({ aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer);
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-revurdering">
            <Sakslinje
                aktivVedtaksperiode={false}
                arbeidsgivernavn={arbeidsgivernavn}
                arbeidsgiverOrgnr={aktivPeriode.organisasjonsnummer}
                fom={aktivPeriode.fom}
                tom={aktivPeriode.tom}
                skjæringstidspunkt={undefined}
                maksdato={maksdato}
                over67År={undefined}
            />
            <LoggHeader />
        </Flex>
    );
};
