import styled from '@emotion/styled';
import React from 'react';

import { useErAnnullert } from '../../../modell/utbetalingshistorikkelement';

import { Dropdown } from '@components/dropdown/Dropdown';
import { usePerson } from '@state/person';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOppgavereferanse, useVedtaksperiode } from '@state/tidslinje';

import { annulleringerEnabled } from '../../../featureToggles';
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
    aktivPeriode: TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær;
}

export const Sakslinjemeny = ({ aktivPeriode }: SakslinjemenyProps) => {
    const { oid } = useInnloggetSaksbehandler();
    const person = usePerson();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const erPeriodeMedSykefravær = aktivPeriode.tilstand !== 'utenSykefravær';
    const beregningId = erPeriodeMedSykefravær
        ? (aktivPeriode as TidslinjeperiodeMedSykefravær).beregningId
        : undefined;

    const oppgavereferanse = useOppgavereferanse(beregningId);
    const vedtaksperiodeErAnnullert: boolean = useErAnnullert(beregningId);
    const arbeidsgiverUtbetaling = vedtaksperiode?.utbetalinger?.arbeidsgiverUtbetaling;

    const showAnnullering = !vedtaksperiodeErAnnullert && annulleringerEnabled;
    const tildeltInnloggetBruker = person?.tildeling?.saksbehandler.oid === oid;

    return (
        <Container>
            {aktivPeriode && (
                <>
                    {erPeriodeMedSykefravær && oppgavereferanse && (
                        <Tildelingsknapp
                            oppgavereferanse={oppgavereferanse}
                            tildeling={person?.tildeling}
                            erTildeltInnloggetBruker={tildeltInnloggetBruker}
                        />
                    )}
                    {person && tildeltInnloggetBruker && erPeriodeMedSykefravær && (
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
            <OppdaterPersondata />
            <AnonymiserData />
            {arbeidsgiverUtbetaling && showAnnullering && erPeriodeMedSykefravær && (
                <Annullering
                    utbetaling={arbeidsgiverUtbetaling}
                    aktivPeriode={aktivPeriode as TidslinjeperiodeMedSykefravær}
                />
            )}
        </Container>
    );
};

export const VerktøylinjeForTomtSaksbilde = () => (
    <Container>
        <OppdaterPersondata />
    </Container>
);
