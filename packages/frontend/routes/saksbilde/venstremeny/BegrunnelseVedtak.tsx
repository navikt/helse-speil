import styles from './BegrunnelseVedtak.module.scss';
import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { DocPencilIcon, ExpandIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Textarea } from '@navikt/ds-react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { AvslagInput, Avslagstype, Maybe, Utbetalingsdagtype } from '@io/graphql';
import { kanSkriveAvslag } from '@utils/featureToggles';

import { SlettLokaleEndringerModal } from '../varsler/KalkulerEndringerVarsel';
import { BegrunnelseVedtakReadonly } from './BegrunnelseVedtakReadonly';

interface BegrunnelseVedtakProps {
    visBegrunnelseVedtak: boolean;
    setVisBegrunnelseVedtak: Dispatch<SetStateAction<boolean>>;
    åpenIModal: boolean;
    setÅpenIModal: Dispatch<SetStateAction<boolean>>;
    avslag: Maybe<AvslagInput>;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periode: FetchedBeregnetPeriode;
}

export const BegrunnelseVedtak = ({
    visBegrunnelseVedtak,
    setVisBegrunnelseVedtak,
    åpenIModal,
    setÅpenIModal,
    avslag,
    setAvslag,
    periode,
}: BegrunnelseVedtakProps) => {
    const [showForkastEndringerModal, setShowForkastEndringerModal] = useState(false);
    const erReadOnly = useIsReadOnlyOppgave();
    const erBeslutteroppgave = periode.totrinnsvurdering?.erBeslutteroppgave ?? false;
    const tidslinjeUtenAGPogHelg = periode.tidslinje.filter(
        (dag) =>
            ![Utbetalingsdagtype.Navhelgdag, Utbetalingsdagtype.Arbeidsgiverperiodedag].includes(
                dag.utbetalingsdagtype,
            ),
    );
    const avvisteDager = tidslinjeUtenAGPogHelg.filter(
        (dag) => dag.utbetalingsdagtype === Utbetalingsdagtype.AvvistDag,
    );

    const avslagstype =
        tidslinjeUtenAGPogHelg.length === avvisteDager.length ? Avslagstype.Avslag : Avslagstype.DelvisAvslag;

    if (!kanSkriveAvslag || avvisteDager.length === 0) return null;

    const onClose = () => {
        if (avslag?.begrunnelse) {
            setShowForkastEndringerModal(true);
        } else {
            setVisBegrunnelseVedtak(false);
        }
    };

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
                            <div className={classNames(styles['ikon-container'], visBegrunnelseVedtak && styles.open)}>
                                <DocPencilIcon title="Skriv begrunnelse" />
                            </div>
                            <BodyShort
                                className={classNames(styles.tekst, visBegrunnelseVedtak && styles.open)}
                                onClick={() => !visBegrunnelseVedtak && setVisBegrunnelseVedtak(true)}
                            >
                                {knappetekst(avslagstype)}
                            </BodyShort>
                        </div>

                        {visBegrunnelseVedtak && (
                            <Textarea
                                label=""
                                id="begrunnelse"
                                value={avslag?.begrunnelse ?? periode.avslag?.[0]?.begrunnelse ?? ''}
                                onChange={(event) => {
                                    setAvslag({
                                        type: avslagstype,
                                        begrunnelse: event.target.value,
                                    });
                                }}
                                description="(Teksten vises til brukeren i melding om vedtak)"
                                aria-labelledby="begrunnelse-label begrunnelse-feil"
                                style={{ whiteSpace: 'pre-line' }}
                                className={styles.begrunnelse}
                            />
                        )}
                    </>
                )}

                {periode.avslag.length > 0 && (erBeslutteroppgave || erReadOnly) && (
                    <BegrunnelseVedtakReadonly avslag={periode.avslag?.[0]} />
                )}
            </div>
            {showForkastEndringerModal && (
                <SlettLokaleEndringerModal
                    onApprove={() => {
                        setAvslag(null);
                        setShowForkastEndringerModal(false);
                        setVisBegrunnelseVedtak(false);
                    }}
                    onClose={() => setShowForkastEndringerModal(false)}
                    tekst={
                        <BodyShort>
                            Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil den individuelle
                            begrunnelsen ikke bli lagret.
                        </BodyShort>
                    }
                />
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
