import React from 'react';
import { Flex } from '../../../components/Flex';
import { Tidslinje } from '../../../components/tidslinje';
import { Personlinje } from '../../../components/Personlinje';
import { LoggProvider } from '../logg/LoggProvider';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { Person } from 'internal-types';
import '@navikt/helse-frontend-logg/lib/main.css';
import { Tidslinjeperiode, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { LoggHeader, SaksbildeContainer } from '../Saksbilde';

interface SaksbildeRevurderingProps {
    personTilBehandling: Person;
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeRevurdering = ({ personTilBehandling, aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer);
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    return (
        <SaksbildeContainer className="saksbilde" data-testid="saksbilde-revurdering">
            <LoggProvider>
                <Personlinje person={personTilBehandling} />
                <Tidslinje person={personTilBehandling} />
                <Flex justifyContent="space-between">
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
            </LoggProvider>
        </SaksbildeContainer>
    );
};
