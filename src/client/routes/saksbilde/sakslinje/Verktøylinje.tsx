import styled from '@emotion/styled';
import { Utbetalinger } from 'internal-types';
import React from 'react';

import { PopoverOrientering } from 'nav-frontend-popover';

import { Dropdown, Strek } from '../../../components/dropdown/Dropdown';
import { useErAnnullert, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
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

export const Verktøylinje = ({ aktivPeriode }: VerktøylinjeProps) => {
    const personTilBehandling = usePerson();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const tildeling = personTilBehandling?.tildeling;
    const { oid } = useInnloggetSaksbehandler();
    const tildeltTilMeg = tildeling?.saksbehandler.oid === oid;
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const utbetalinger: Utbetalinger | undefined = vedtaksperiode?.utbetalinger;
    const vedtaksperiodeErAnnullert: boolean = useErAnnullert(aktivPeriode.beregningId);

    const visAnnulleringsmuligheter =
        !vedtaksperiodeErAnnullert && annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling;

    return (
        <Container>
            <Dropdown orientering={PopoverOrientering.UnderHoyre}>
                {aktivPeriode && (
                    <>
                        {oppgavereferanse && (
                            <Tildelingsknapp
                                oppgavereferanse={oppgavereferanse}
                                tildeling={tildeling}
                                erTildeltInnloggetBruker={tildeltTilMeg}
                            />
                        )}
                        {tildeltTilMeg && (
                            <PåVentKnapp erPåVent={tildeling?.påVent} oppgavereferanse={oppgavereferanse} />
                        )}
                        <Strek />
                    </>
                )}
                {oppdaterPersondataEnabled && <OppdaterPersondata />}
                <AnonymiserData />
                {visAnnulleringsmuligheter && <Annullering aktivPeriode={aktivPeriode} />}
            </Dropdown>
        </Container>
    );
};

export const VerktøylinjeForTomtSaksbilde = () => {
    return <Container>{oppdaterPersondataEnabled && <OppdaterPersondata />}</Container>;
};
