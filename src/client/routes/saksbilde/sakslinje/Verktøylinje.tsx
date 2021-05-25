import styled from '@emotion/styled';
import { Utbetalinger, Vedtaksperiodetilstand } from 'internal-types';
import React from 'react';

import { PopoverOrientering } from 'nav-frontend-popover';

import { Dropdown, Strek } from '../../../components/dropdown/Dropdown';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { usePerson } from '../../../state/person';
import { useAktivVedtaksperiode } from '../../../state/tidslinje';

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

export const Verktøylinje = () => {
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const tildeling = personTilBehandling?.tildeling;
    const { oid } = useInnloggetSaksbehandler();
    const tildeltTilMeg = tildeling?.saksbehandler.oid === oid;
    const oppgavereferanse = useAktivVedtaksperiode()?.oppgavereferanse;
    const utbetalinger: Utbetalinger | undefined = aktivVedtaksperiode?.utbetalinger;
    const vedtaksperiodeErAnnullert: boolean = aktivVedtaksperiode?.tilstand === Vedtaksperiodetilstand.Annullert;

    const visAnnulleringsmuligheter =
        !vedtaksperiodeErAnnullert && annulleringerEnabled && utbetalinger?.arbeidsgiverUtbetaling;

    return (
        <Container>
            <Dropdown orientering={PopoverOrientering.UnderHoyre}>
                {aktivVedtaksperiode && (
                    <>
                        {aktivVedtaksperiode.oppgavereferanse && (
                            <Tildelingsknapp
                                oppgavereferanse={aktivVedtaksperiode.oppgavereferanse}
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
                {visAnnulleringsmuligheter && <Annullering />}
            </Dropdown>
        </Container>
    );
};
