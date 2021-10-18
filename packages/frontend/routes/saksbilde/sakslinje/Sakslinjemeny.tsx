import styled from '@emotion/styled';
import React from 'react';

import { Dropdown } from '../../../components/dropdown/Dropdown';
import { useErAnnullert } from '../../../modell/utbetalingshistorikkelement';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { usePerson } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { annulleringerEnabled, oppdaterPersondataEnabled } from '../../../featureToggles';
import { AnonymiserData } from './AnonymiserData';
import { OppdaterPersondata } from './OppdaterPersondata';
import { PåVentKnapp } from './PåVentKnapp';
import { Tildelingsknapp } from './Tildelingsknapp';
import { Annullering } from './annullering/Annullering';

const Strek = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid var(--navds-color-border);
`;

const Container = styled(Dropdown)`
    display: flex;
    align-items: center;
    height: 100%;
`;

export interface SakslinjemenyProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Sakslinjemeny = ({ aktivPeriode }: SakslinjemenyProps) => {
    const { oid } = useInnloggetSaksbehandler();
    const person = usePerson();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const vedtaksperiodeErAnnullert: boolean = useErAnnullert(aktivPeriode.beregningId);
    const arbeidsgiverUtbetaling = vedtaksperiode?.utbetalinger?.arbeidsgiverUtbetaling;
    const showAnnullering = !vedtaksperiodeErAnnullert && annulleringerEnabled;
    const tildeltInnloggetBruker = person?.tildeling?.saksbehandler.oid === oid;

    return (
        <Container>
            {aktivPeriode && (
                <>
                    {oppgavereferanse && (
                        <Tildelingsknapp
                            oppgavereferanse={oppgavereferanse}
                            tildeling={person?.tildeling}
                            erTildeltInnloggetBruker={tildeltInnloggetBruker}
                        />
                    )}
                    {person && tildeltInnloggetBruker && (
                        <PåVentKnapp
                            erPåVent={person?.tildeling?.påVent}
                            oppgavereferanse={oppgavereferanse}
                            vedtaksperiodeId={aktivPeriode.id}
                            personinfo={person.personinfo}
                        />
                    )}
                    {oppgavereferanse && <Strek />}
                </>
            )}
            {oppdaterPersondataEnabled && <OppdaterPersondata />}
            <AnonymiserData />
            {arbeidsgiverUtbetaling && showAnnullering && (
                <Annullering utbetaling={arbeidsgiverUtbetaling} aktivPeriode={aktivPeriode} />
            )}
        </Container>
    );
};

export const VerktøylinjeForTomtSaksbilde = () => (
    <Container>{oppdaterPersondataEnabled && <OppdaterPersondata />}</Container>
);
