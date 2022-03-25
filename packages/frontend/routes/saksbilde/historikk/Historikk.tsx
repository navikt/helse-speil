import React, { useLayoutEffect, useState } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { CloseButton } from '@components/CloseButton';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { EndringsloggDager } from '@components/EndringsloggDager';
import { EndringsloggInntekt } from '@components/EndringsloggInntekt';
import { EndringsloggArbeidsforhold } from '@components/EndringsloggArbeidsforhold';
import { Dagoverstyring, Dagtype, GhostPeriode, Maybe, Overstyring, Periode, Personinfo, Tildeling } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';
import { useNotaterForVedtaksperiode } from '@state/notater';
import { useCurrentPerson } from '@state/personState';
import { useActivePeriod } from '@state/periodState';

import { Hendelsetype } from './Historikk.types';
import { HistorikkHendelse } from './HistorikkHendelse';
import { NotatListeModal } from '../../oversikt/table/rader/notat/NotatListeModal';
import { useFilterState, useHistorikk, useOppdaterHistorikk, useShowHistorikkState } from './state';
import { isArbeidsforholdoverstyring, isDagoverstyring, isInntektoverstyring } from './mapping';

import styles from './Historikk.module.css';

const convertDagoverstyring = (overstyring: Dagoverstyring): Array<OverstyringerPrDag> => {
    return overstyring.dager.map((it) => ({
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
    activePeriod: Periode | GhostPeriode;
    personinfo: Personinfo;
    tildeling?: Maybe<Tildeling>;
    vedtaksperiodeId?: string;
}

export const HistorikkWithContent: React.VFC<HistorikkWithContentProps> = React.memo(
    ({ activePeriod, vedtaksperiodeId, tildeling, personinfo }) => {
        const historikk = useHistorikk();
        const notaterForPeriode = useNotaterForVedtaksperiode(vedtaksperiodeId);

        const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
        const [showNotatListeModal, setShowNotatListeModal] = useState(false);
        const [filter] = useFilterState();

        const [endring, setEndring] = useState<Overstyring | null>(null);

        useLayoutEffect(() => {
            if (showHistorikk) {
                document.documentElement.style.setProperty('--speil-hoyremeny-width', '272px');
            } else {
                document.documentElement.style.setProperty('--speil-hoyremeny-width', '0px');
            }
        }, [showHistorikk]);

        useOppdaterHistorikk({
            vedtaksperiodeId: vedtaksperiodeId,
            periode: activePeriod,
            onClickNotat: () => setShowNotatListeModal(true),
            onClickOverstyringshendelse: setEndring,
        });

        const tittel = Hendelsetype[filter] === 'Dokument' ? 'DOKUMENTER' : 'HISTORIKK';

        return (
            <>
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
                {vedtaksperiodeId && showNotatListeModal && (
                    <NotatListeModal
                        notater={notaterForPeriode}
                        personinfo={{
                            ...personinfo,
                            mellomnavn: personinfo.mellomnavn ?? null,
                            fødselsdato: dayjs(personinfo.fodselsdato),
                            kjønn: (() => {
                                switch (personinfo.kjonn) {
                                    case 'Mann':
                                        return 'mann';
                                    case 'Kvinne':
                                        return 'kvinne';
                                    case 'Ukjent':
                                    default:
                                        return 'ukjent';
                                }
                            })(),
                        }}
                        vedtaksperiodeId={vedtaksperiodeId}
                        onClose={() => setShowNotatListeModal(false)}
                        erPåVent={tildeling?.reservert}
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
                    <EndringsloggInntekt endring={endring} isOpen onRequestClose={() => setEndring(null)} />
                )}
                {isArbeidsforholdoverstyring(endring) && (
                    <EndringsloggArbeidsforhold endring={endring} isOpen onRequestClose={() => setEndring(null)} />
                )}
            </>
        );
    }
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
