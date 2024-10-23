import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { ExpandIcon } from '@navikt/aksel-icons';
import { Box, Button, ReadMore } from '@navikt/ds-react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    AvslagInput,
    Avslagshandling,
    Avslagstype,
    BeregnetPeriodeFragment,
    Maybe,
    MinimumSykdomsgradOverstyring,
    PersonFragment,
    Utbetalingsdagtype,
} from '@io/graphql';
import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';
import { BegrunnelseModal } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseModal';
import { ForkastModal } from '@saksbilde/venstremeny/individuellBegrunnelse/ForkastModal';

import { BegrunnelseVedtakReadonly } from '../BegrunnelseVedtakReadonly';

import styles from './IndividuellBegrunnelse.module.scss';

interface BegrunnelseVedtakProps {
    visIndividuellBegrunnelse: boolean;
    setVisIndividuellBegrunnelse: Dispatch<SetStateAction<boolean>>;
    avslag: Maybe<AvslagInput>;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periode: BeregnetPeriodeFragment;
    person: PersonFragment;
    overstyrtMinimumSykdomsgradBegrunnelse?: MinimumSykdomsgradOverstyring;
}

export const IndividuellBegrunnelse = ({
    visIndividuellBegrunnelse,
    setVisIndividuellBegrunnelse,
    avslag,
    setAvslag,
    periode,
    person,
    overstyrtMinimumSykdomsgradBegrunnelse,
}: BegrunnelseVedtakProps): Maybe<ReactElement> => {
    const [showForkastEndringerModal, setShowForkastEndringerModal] = useState(false);
    const [modalÅpen, setModalÅpen] = useState(false);
    const erReadOnly = useIsReadOnlyOppgave(person);
    const erBeslutteroppgave = periode.totrinnsvurdering?.erBeslutteroppgave ?? false;
    const tidslinjeUtenAGPogHelg = periode.tidslinje.filter(
        (dag) =>
            ![Utbetalingsdagtype.Navhelgdag, Utbetalingsdagtype.Arbeidsgiverperiodedag].includes(
                dag.utbetalingsdagtype,
            ),
    );
    const avvisteDager = tidslinjeUtenAGPogHelg.filter((dag) =>
        [Utbetalingsdagtype.AvvistDag, Utbetalingsdagtype.ForeldetDag, Utbetalingsdagtype.Feriedag].includes(
            dag.utbetalingsdagtype,
        ),
    );

    const avslagstype =
        tidslinjeUtenAGPogHelg.length === avvisteDager.length ? Avslagstype.Avslag : Avslagstype.DelvisAvslag;

    if (avvisteDager.length === 0) return null;

    const åpneModal = () => setModalÅpen(true);
    const lukkModal = () => setModalÅpen(false);

    const lokalAvslagstekst = avslag?.data?.begrunnelse;
    const innsendtAvslagstekst = periode.avslag?.[0]?.begrunnelse as string | undefined;

    const onClose = () => {
        if (lokalAvslagstekst || innsendtAvslagstekst) {
            setShowForkastEndringerModal(true);
        } else {
            setVisIndividuellBegrunnelse(false);
            lukkModal();
        }
    };

    const preutfyltVerdi =
        lokalAvslagstekst ??
        innsendtAvslagstekst ??
        overstyrtMinimumSykdomsgradBegrunnelse?.minimumSykdomsgrad.begrunnelse ??
        '';

    const skalÅpnesMedUtfylteVerdier =
        !erReadOnly && !erBeslutteroppgave && preutfyltVerdi !== '' && avslag?.handling !== Avslagshandling.Invalider;

    return (
        <>
            <Box marginBlock="0 4" paddingBlock="4 0" className={styles['begrunnelse-vedtak']}>
                {!erReadOnly && !erBeslutteroppgave && (
                    <Box position="relative">
                        <ReadMore
                            size="small"
                            className={styles.readmore}
                            open={visIndividuellBegrunnelse}
                            defaultOpen={skalÅpnesMedUtfylteVerdier}
                            header={knappetekst(avslagstype)}
                            onClick={() => {
                                if (visIndividuellBegrunnelse) {
                                    onClose();
                                } else {
                                    setVisIndividuellBegrunnelse(true);
                                }
                            }}
                        >
                            <Box background="bg-subtle">
                                <Button
                                    onClick={åpneModal}
                                    icon={<ExpandIcon title="åpne i modal" />}
                                    size="xsmall"
                                    variant="tertiary-neutral"
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                />
                                <BegrunnelseInput
                                    begrunnelsestype={avslagstype}
                                    preutfyltVerdi={preutfyltVerdi}
                                    minRows={4}
                                    setAvslag={(verdi) => setAvslag(verdi)}
                                    focus={visIndividuellBegrunnelse || skalÅpnesMedUtfylteVerdier}
                                />
                            </Box>
                        </ReadMore>
                    </Box>
                )}

                {periode.avslag.filter((it) => !it.invalidert).length > 0 && (erBeslutteroppgave || erReadOnly) && (
                    <BegrunnelseVedtakReadonly avslag={periode.avslag?.[0]} />
                )}
            </Box>
            {showForkastEndringerModal && (
                <ForkastModal
                    harLagretAvslag={innsendtAvslagstekst != undefined}
                    setAvslag={setAvslag}
                    lukkBegrunnelseModal={lukkModal}
                    lukkForkastModal={() => setShowForkastEndringerModal(false)}
                    lukkIndividuellBegrunnelse={() => setVisIndividuellBegrunnelse(false)}
                />
            )}

            {modalÅpen && (
                <BegrunnelseModal
                    modalÅpen={modalÅpen}
                    lukkModal={lukkModal}
                    avslagstype={avslagstype}
                    preutfyltVerdi={preutfyltVerdi}
                    setAvslag={setAvslag}
                    onClose={onClose}
                />
            )}
        </>
    );
};

export const knappetekst = (avslagstype: Avslagstype) => {
    switch (avslagstype) {
        case Avslagstype.DelvisAvslag:
            return 'Skriv begrunnelse for delvis innvilgelse';
        case Avslagstype.Avslag:
            return 'Skriv begrunnelse for avslag';
    }
};
