import classNames from 'classnames';
import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { ExpandIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Textarea } from '@navikt/ds-react';

import { SlettLokaleEndringerModal } from '@components/SlettLokaleEndringerModal';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    AvslagInput,
    Avslagshandling,
    Avslagstype,
    BeregnetPeriodeFragment,
    Maybe,
    Utbetalingsdagtype,
} from '@io/graphql';

import { BegrunnelseVedtakReadonly } from './BegrunnelseVedtakReadonly';

import styles from './BegrunnelseVedtak.module.scss';

interface BegrunnelseVedtakProps {
    visBegrunnelseVedtak: boolean;
    setVisBegrunnelseVedtak: Dispatch<SetStateAction<boolean>>;
    åpenIModal: boolean;
    setÅpenIModal: Dispatch<SetStateAction<boolean>>;
    avslag: Maybe<AvslagInput>;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periode: BeregnetPeriodeFragment;
}

export const BegrunnelseVedtak = ({
    visBegrunnelseVedtak,
    setVisBegrunnelseVedtak,
    åpenIModal,
    setÅpenIModal,
    avslag,
    setAvslag,
    periode,
}: BegrunnelseVedtakProps): Maybe<ReactElement> => {
    const [showForkastEndringerModal, setShowForkastEndringerModal] = useState(false);
    const erReadOnly = useIsReadOnlyOppgave();
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

    const onClose = () => {
        if (avslag?.data?.begrunnelse || periode.avslag.length > 0) {
            setShowForkastEndringerModal(true);
        } else {
            setVisBegrunnelseVedtak(false);
        }
    };

    const skalÅpnesMedUtfylteVerdier =
        !erReadOnly &&
        !erBeslutteroppgave &&
        periode.avslag?.[0]?.begrunnelse &&
        avslag?.handling !== Avslagshandling.Invalider;

    return (
        <>
            <div className={classNames(styles.container, visBegrunnelseVedtak && styles.open)}>
                {!erReadOnly && !erBeslutteroppgave && (
                    <>
                        {(visBegrunnelseVedtak || periode.avslag?.[0]) && !åpenIModal && (
                            <div className={styles.top}>
                                <button className={styles.button} onClick={() => setÅpenIModal(true)}>
                                    <ExpandIcon title="åpne i modal" fontSize="1.5rem" />
                                </button>
                                <button className={styles.button} onClick={onClose}>
                                    <XMarkIcon title="lukk individuell begrunnelse" />
                                </button>
                            </div>
                        )}
                        <div
                            className={styles.header}
                            onClick={() => !visBegrunnelseVedtak && setVisBegrunnelseVedtak(true)}
                        >
                            <BodyShort
                                className={classNames(styles.tekst, visBegrunnelseVedtak && styles.open)}
                                onClick={() => !visBegrunnelseVedtak && setVisBegrunnelseVedtak(true)}
                            >
                                {knappetekst(avslagstype)}
                            </BodyShort>
                        </div>

                        {(visBegrunnelseVedtak || skalÅpnesMedUtfylteVerdier) && (
                            <Textarea
                                label=""
                                id="begrunnelse"
                                value={avslag?.data?.begrunnelse ?? ''}
                                onChange={(event) => {
                                    if (event.target.value === '') return setAvslag(null);

                                    setAvslag({
                                        handling: Avslagshandling.Opprett,
                                        data: {
                                            type: avslagstype,
                                            begrunnelse: event.target.value,
                                        },
                                    });
                                }}
                                description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
                                aria-labelledby="begrunnelse-label begrunnelse-feil"
                                style={{ whiteSpace: 'pre-line' }}
                                className={styles.begrunnelse}
                            />
                        )}
                    </>
                )}

                {periode.avslag.filter((it) => !it.invalidert).length > 0 && (erBeslutteroppgave || erReadOnly) && (
                    <BegrunnelseVedtakReadonly avslag={periode.avslag?.[0]} />
                )}
            </div>
            {showForkastEndringerModal && (
                <SlettLokaleEndringerModal
                    heading="Er du sikker på at du vil forkaste endringene?"
                    showModal={showForkastEndringerModal}
                    onApprove={() => {
                        if (periode.avslag.length > 0) {
                            setAvslag({ handling: Avslagshandling.Invalider });
                        } else {
                            setAvslag(null);
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
        </>
    );
};

const knappetekst = (avslagstype: Avslagstype) => {
    switch (avslagstype) {
        case Avslagstype.DelvisAvslag:
            return 'Skriv begrunnelse for delvis innvilgelse';
        case Avslagstype.Avslag:
            return 'Skriv begrunnelse for avslag';
    }
};
