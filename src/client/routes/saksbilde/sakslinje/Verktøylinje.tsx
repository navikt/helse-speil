import React from 'react';
import styled from '@emotion/styled';
import { Utbetalinger, Vedtaksperiodetilstand } from 'internal-types';
import { annulleringerEnabled, oppdaterPersondataEnabled } from '../../../featureToggles';
import { Annullering } from './annullering/Annullering';
import { OppdaterPersondata } from './OppdaterPersondata';
import { Tildelingsknapp, useErTildeltInnloggetBruker } from './Tildelingsknapp';
import { usePerson } from '../../../state/person';
import { PåVentKnapp } from './PåVentKnapp';
import { AnonymiserData } from './AnonymiserData';
import { useAktivVedtaksperiode } from '../../../state/tidslinje';
import { Dropdown, Strek } from '../../../components/dropdown/Dropdown';
import { PopoverOrientering } from 'nav-frontend-popover';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

export const Verktøylinje = () => {
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const tildeling = personTilBehandling?.tildeling;
    const tildeltTilMeg = useErTildeltInnloggetBruker();
    const erPåVent = usePerson()?.tildeling?.påVent;
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
                        {tildeltTilMeg && <PåVentKnapp erPåVent={erPåVent} oppgavereferanse={oppgavereferanse} />}
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
