import React, { useState } from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { CloseButton } from '@components/CloseButton';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { EndringsloggDager } from '@components/EndringsloggDager';
import { EndringsloggInntekt } from '@components/EndringsloggInntekt';
import { EndringsloggArbeidsforhold } from '@components/EndringsloggArbeidsforhold';
import { Dagoverstyring, Dagtype, GhostPeriode, Maybe, Overstyring, Personinfo, Tildeling } from '@io/graphql';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isInntektoverstyring,
} from '@utils/typeguards';
import { toNotat } from '@state/notater';
import { useCurrentPerson } from '@state/person';
import { useActivePeriod } from '@state/periode';

import { Hendelsetype } from './Historikk.types';
import { HistorikkHendelse } from './HistorikkHendelse';
import { NotatListeModal } from '../../oversikt/table/rader/notat/NotatListeModal';
import { useFilterState, useHistorikk, useOppdaterHistorikk, useShowHistorikkState } from './state';

import styles from './Historikk.module.css';
import { motion } from 'framer-motion';

const convertDagoverstyring = (overstyring: Dagoverstyring): Array<OverstyringerPrDag> => {
    return overstyring.dager.map((it) => ({
        hendelseId: overstyring.hendelseId,
        begrunnelse: overstyring.begrunnelse,
        saksbehandler: overstyring.saksbehandler,
        timestamp: overstyring.timestamp,
        type: (() => {
            switch (it.type) {
                case Dagtype.Egenmeldingsdag:
                    return 'Egenmelding';
                case Dagtype.Feriedag:
                    return 'Ferie';
                case Dagtype.Permisjonsdag:
                    return 'Permisjon';
                case Dagtype.Sykedag:
                    return 'Syk';
            }
        })(),
        dato: it.dato,
        grad: it.grad,
    }));
};

interface HistorikkWithContentProps {
    activePeriod: BeregnetPeriode | GhostPeriode;
    personinfo: Personinfo;
    tildeling?: Maybe<Tildeling>;
    vedtaksperiodeId?: string;
}

const HistorikkWithContent: React.VFC<HistorikkWithContentProps> = React.memo(
    ({ activePeriod, vedtaksperiodeId, tildeling, personinfo }) => {
        const historikk = useHistorikk();
        const notaterForPeriode = isBeregnetPeriode(activePeriod) ? activePeriod.notater.map(toNotat) : [];

        const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
        const [notattype, setNotattype] = useState<NotatType | null>(null);
        const [filter] = useFilterState();

        const [endring, setEndring] = useState<Overstyring | null>(null);

        useOppdaterHistorikk({
            periode: activePeriod,
            onClickNotat: (notattype: NotatType) => setNotattype(notattype),
            onClickOverstyringshendelse: setEndring,
        });

        const tittel = Hendelsetype[filter] === 'Dokument' ? 'DOKUMENTER' : 'HISTORIKK';

        return (
            <>
                <motion.div
                    key="behandlingsstatistikk"
                    initial={{ width: showHistorikk ? 'max-content' : 0 }}
                    animate={{ width: showHistorikk ? 'max-content' : 0 }}
                    transition={{
                        type: 'tween',
                        duration: 0.2,
                        ease: 'easeInOut',
                    }}
                    style={{ overflow: 'hidden' }}
                >
                    <div className={styles.Historikk}>
                        <ul>
                            <li>
                                {tittel}
                                <CloseButton onClick={() => setShowHistorikk(false)} />
                            </li>
                            {historikk.map((it) => (
                                <HistorikkHendelse key={it.id} {...it} />
                            ))}
                        </ul>
                    </div>
                </motion.div>
                {vedtaksperiodeId && notattype && (
                    <NotatListeModal
                        notater={notaterForPeriode}
                        personinfo={personinfo}
                        vedtaksperiodeId={vedtaksperiodeId}
                        onClose={() => setNotattype(null)}
                        erPåVent={tildeling?.reservert}
                        notattype={notattype}
                    />
                )}
                {isDagoverstyring(endring) && (
                    <EndringsloggDager
                        endringer={convertDagoverstyring(endring)}
                        isOpen
                        onRequestClose={() => setEndring(null)}
                    />
                )}
                {isInntektoverstyring(endring) && (
                    <EndringsloggInntekt endringer={[endring]} isOpen onRequestClose={() => setEndring(null)} />
                )}
                {isArbeidsforholdoverstyring(endring) && (
                    <EndringsloggArbeidsforhold endringer={[endring]} isOpen onRequestClose={() => setEndring(null)} />
                )}
            </>
        );
    },
);

const HistorikkContainer = () => {
    const period = useActivePeriod();
    const person = useCurrentPerson();

    if (!person) {
        return null;
    } else if (isBeregnetPeriode(period)) {
        return (
            <HistorikkWithContent
                vedtaksperiodeId={period.vedtaksperiodeId}
                activePeriod={period}
                personinfo={person.personinfo}
                tildeling={person.tildeling}
            />
        );
    } else if (isGhostPeriode(period)) {
        return (
            <HistorikkWithContent activePeriod={period} personinfo={person.personinfo} tildeling={person.tildeling} />
        );
    }

    return null;
};

const HistorikkSkeleton = () => {
    return (
        <div className={styles.Historikk}>
            <ul>
                <li>
                    HISTORIKK
                    <CloseButton disabled />
                </li>
            </ul>
        </div>
    );
};

const HistorikkError = () => {
    return (
        <div className={classNames(styles.Historikk, styles.Error)}>
            <ul>
                <li>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </li>
            </ul>
        </div>
    );
};

export const Historikk = () => {
    return (
        <React.Suspense fallback={<HistorikkSkeleton />}>
            <ErrorBoundary fallback={<HistorikkError />}>
                <HistorikkContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
