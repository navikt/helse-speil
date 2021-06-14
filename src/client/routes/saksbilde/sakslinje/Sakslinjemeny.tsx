import styled from '@emotion/styled';
import React from 'react';

import { PopoverOrientering } from 'nav-frontend-popover';

import { Dropdown, Strek } from '../../../components/dropdown/Dropdown';
import { Tidslinjeperiode, useErAnnullert } from '../../../modell/UtbetalingshistorikkElement';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { usePerson } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { annulleringerEnabled, oppdaterPersondataEnabled } from '../../../featureToggles';
import { AnonymiserData } from './AnonymiserData';
import { OppdaterPersondata } from './OppdaterPersondata';
import { PåVentKnapp } from './PåVentKnapp';
import { Tildelingsknapp } from './Tildelingsknapp';
import { Annullering } from './annullering/Annullering';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

export interface VerktøylinjeProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Sakslinjemeny = ({ aktivPeriode }: VerktøylinjeProps) => {
    const { oid } = useInnloggetSaksbehandler();
    const person = usePerson();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const vedtaksperiodeErAnnullert: boolean = useErAnnullert(aktivPeriode.beregningId);

    const showAnnullering =
        !vedtaksperiodeErAnnullert && annulleringerEnabled && vedtaksperiode?.utbetalinger?.arbeidsgiverUtbetaling;

    const tildeltInnloggetBruker = person?.tildeling?.saksbehandler.oid === oid;

    return (
        <Container>
            <Dropdown orientering={PopoverOrientering.UnderHoyre}>
                {aktivPeriode && (
                    <>
                        {oppgavereferanse && (
                            <Tildelingsknapp
                                oppgavereferanse={oppgavereferanse}
                                tildeling={person?.tildeling}
                                erTildeltInnloggetBruker={tildeltInnloggetBruker}
                            />
                        )}
                        {tildeltInnloggetBruker && (
                            <PåVentKnapp erPåVent={person?.tildeling?.påVent} oppgavereferanse={oppgavereferanse} />
                        )}
                        <Strek />
                    </>
                )}
                {oppdaterPersondataEnabled && <OppdaterPersondata />}
                <AnonymiserData />
                {showAnnullering && <Annullering aktivPeriode={aktivPeriode} />}
            </Dropdown>
        </Container>
    );
};

export const VerktøylinjeForTomtSaksbilde = () => (
    <Container>{oppdaterPersondataEnabled && <OppdaterPersondata />}</Container>
);
