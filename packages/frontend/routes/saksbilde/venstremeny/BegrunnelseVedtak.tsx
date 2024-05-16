import styles from './BegrunnelseVedtak.module.scss';
import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';

import { DocPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Textarea } from '@navikt/ds-react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { AvslagInput, Avslagstype, Maybe, Utbetalingsdagtype } from '@io/graphql';
import { kanSkriveAvslag } from '@utils/featureToggles';

import { BegrunnelseVedtakReadonly } from './BegrunnelseVedtakReadonly';

interface BegrunnelseVedtakProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    avslag: Maybe<AvslagInput>;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    periode: FetchedBeregnetPeriode;
}

export const BegrunnelseVedtak = ({ open, setOpen, avslag, setAvslag, periode }: BegrunnelseVedtakProps) => {
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

    return (
        <div className={classNames(styles.container, open && styles.open)}>
            {!erReadOnly && !erBeslutteroppgave && (
                <>
                    {(open || periode.avslag?.[0]) && (
                        <div className={styles.top}>
                            <button className={styles.lukk} onClick={() => setOpen(false)}>
                                <XMarkIcon />
                            </button>
                        </div>
                    )}
                    <div className={styles.header} onClick={() => !open && setOpen(true)}>
                        <div className={classNames(styles['ikon-container'], open && styles.open)}>
                            <DocPencilIcon title="Skriv begrunnelse" />
                        </div>
                        <BodyShort
                            className={classNames(styles.tekst, open && styles.open)}
                            onClick={() => !open && setOpen(true)}
                        >
                            {knappetekst(avslagstype)}
                        </BodyShort>
                    </div>

                    {open && (
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
