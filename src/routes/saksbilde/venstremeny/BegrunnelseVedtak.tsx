import React, { Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react';

import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Heading, Modal, ReadMore, Textarea, VStack } from '@navikt/ds-react';

import { SlettLokaleEndringerModal } from '@components/SlettLokaleEndringerModal';
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

import { BegrunnelseVedtakReadonly } from './BegrunnelseVedtakReadonly';

import styles from './BegrunnelseVedtak.module.scss';

interface BegrunnelseVedtakProps {
    visBegrunnelseVedtak: boolean;
    setVisBegrunnelseVedtak: Dispatch<SetStateAction<boolean>>;
    avslag: Maybe<AvslagInput>;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periode: BeregnetPeriodeFragment;
    person: PersonFragment;
    overstyrtMinimumSykdomsgradBegrunnelse?: MinimumSykdomsgradOverstyring;
}

export const BegrunnelseVedtak = ({
    visBegrunnelseVedtak,
    setVisBegrunnelseVedtak,
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
            setVisBegrunnelseVedtak(false);
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
                            open={visBegrunnelseVedtak}
                            defaultOpen={skalÅpnesMedUtfylteVerdier}
                            header={knappetekst(avslagstype)}
                            onClick={() => {
                                if (visBegrunnelseVedtak) {
                                    onClose();
                                } else {
                                    setVisBegrunnelseVedtak(true);
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
                                <InputBegrunnelseVedtak
                                    begrunnelsestype={avslagstype}
                                    preutfyltVerdi={preutfyltVerdi}
                                    minRows={4}
                                    setAvslag={(verdi) => setAvslag(verdi)}
                                    focus={visBegrunnelseVedtak || skalÅpnesMedUtfylteVerdier}
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
                <SlettLokaleEndringerModal
                    heading="Er du sikker på at du vil forkaste endringene?"
                    showModal={showForkastEndringerModal}
                    onApprove={() => {
                        if (periode.avslag.length > 0) {
                            setAvslag({ handling: Avslagshandling.Invalider });
                        } else {
                            setAvslag(null);
                            lukkModal();
                        }
                        setShowForkastEndringerModal(false);
                        setVisBegrunnelseVedtak(false);
                    }}
                    onClose={() => setShowForkastEndringerModal(false)}
                >
                    <BodyShort>
                        Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil den individuelle begrunnelsen
                        ikke bli lagret.
                    </BodyShort>
                </SlettLokaleEndringerModal>
            )}

            {modalÅpen && (
                <Modal
                    aria-label="Modal"
                    portal
                    closeOnBackdropClick
                    open={modalÅpen}
                    onClose={lukkModal}
                    width="800px"
                >
                    <Modal.Header closeButton={false}>
                        <HStack justify="space-between" align="center">
                            <Heading level="1" size="medium">
                                {knappetekst(avslagstype)}
                            </Heading>
                            <Button size="small" variant="tertiary-neutral" onClick={lukkModal} icon={<ShrinkIcon />} />
                        </HStack>
                    </Modal.Header>
                    <Modal.Body>
                        <VStack gap="4">
                            <InputBegrunnelseVedtak
                                begrunnelsestype={avslagstype}
                                preutfyltVerdi={preutfyltVerdi}
                                minRows={8}
                                setAvslag={(verdi) => setAvslag(verdi)}
                                focus={true}
                            />
                            <HStack gap="2">
                                <Button size="xsmall" variant="secondary" onClick={lukkModal}>
                                    Lagre
                                </Button>
                                <Button size="xsmall" variant="tertiary" onClick={onClose}>
                                    Forkast
                                </Button>
                            </HStack>
                        </VStack>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

interface InputBegrunnelseVedtakProps {
    begrunnelsestype: Avslagstype.Avslag | Avslagstype.DelvisAvslag;
    preutfyltVerdi: string;
    minRows: number;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    focus: boolean;
}

const InputBegrunnelseVedtak = ({
    begrunnelsestype,
    preutfyltVerdi,
    minRows,
    setAvslag,
    focus,
}: InputBegrunnelseVedtakProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, [focus]);
    return (
        <Textarea
            label=""
            id="begrunnelse"
            value={preutfyltVerdi}
            onChange={(event) => {
                if (event.target.value === '') return setAvslag(null);

                setAvslag({
                    handling: Avslagshandling.Opprett,
                    data: {
                        type: begrunnelsestype,
                        begrunnelse: event.target.value,
                    },
                });
            }}
            description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
            aria-labelledby="begrunnelse-label begrunnelse-feil"
            style={{ whiteSpace: 'pre-line' }}
            minRows={minRows}
            ref={ref}
            autoFocus
        />
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
