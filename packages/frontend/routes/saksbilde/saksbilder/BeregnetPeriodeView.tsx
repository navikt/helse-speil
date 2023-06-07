import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Overstyring } from '@io/graphql';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useSyncNotater } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { getLatestUtbetalingTimestamp, getOverstyringerForEksisterendePerioder } from '@state/selectors/person';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';
import { isSpleisVilkarsgrunnlag } from '@utils/typeguards';

import { Historikk } from '../historikk';
import { useVilkårsgrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

// @ts-ignore
const Utbetaling = React.lazy(() => import('../utbetaling/Utbetaling').catch(onLazyLoadFail));
// @ts-ignore
const Inngangsvilkår = React.lazy(() => import('../vilkår/Inngangsvilkår').catch(onLazyLoadFail));
// @ts-ignore
const Faresignaler = React.lazy(() => import('../faresignaler/Faresignaler').catch(onLazyLoadFail));
// @ts-ignore
const Sykepengegrunnlag = React.lazy(() => import('../sykepengegrunnlag/Sykepengegrunnlag').catch(onLazyLoadFail));

const BeregnetPeriodeViewLoader: React.FC = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
    );
};

const useOverstyringerEtterSisteGodkjenteUtbetaling = (person: FetchedPerson): Array<Overstyring> => {
    const timestamp = getLatestUtbetalingTimestamp(person);
    return getOverstyringerForEksisterendePerioder(person, timestamp);
};

interface BeregnetPeriodeViewProps {
    period: FetchedBeregnetPeriode;
    person: FetchedPerson;
}

export const BeregnetPeriodeView: React.FC<BeregnetPeriodeViewProps> = ({ period, person }) => {
    if (!period.skjaeringstidspunkt || !period.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    useSyncNotater([period.vedtaksperiodeId]);

    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);
    const harDagOverstyringer = useHarDagOverstyringer(period);

    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, activePeriod);

    const navnPåDeaktiverteGhostArbeidsgivere = isSpleisVilkarsgrunnlag(vilkårsgrunnlag)
        ? vilkårsgrunnlag.inntekter
              .filter((inntekt) => inntekt.deaktivert)
              .map(
                  (inntekt) => person.arbeidsgivere.find((it) => it.organisasjonsnummer === inntekt.arbeidsgiver)?.navn,
              )
              .join(', ')
        : undefined;

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Saksbildevarsler
                    periodState={getPeriodState(period)}
                    oppgavereferanse={period.oppgave?.id}
                    varsler={period.varsler}
                    erTidligereSaksbehandler={erTidligereSaksbehandler}
                    erBeslutteroppgave={period.totrinnsvurdering?.erBeslutteroppgave}
                    endringerEtterNyesteUtbetalingPåPerson={overstyringerEtterNyesteUtbetalingPåPerson}
                    harDagOverstyringer={harDagOverstyringer}
                    activePeriodTom={period.tom}
                    skjæringstidspunkt={period.skjaeringstidspunkt}
                    navnPåDeaktiverteGhostArbeidsgivere={navnPåDeaktiverteGhostArbeidsgivere}
                />
                <div className={styles.RouteContainer}>
                    <React.Suspense fallback={<BeregnetPeriodeViewLoader />}>
                        <Routes>
                            <Route path="utbetaling" element={<Utbetaling />} />
                            <Route path="inngangsvilkår" element={<Inngangsvilkår />} />
                            <Route path="sykepengegrunnlag" element={<Sykepengegrunnlag />} />
                            <Route path="faresignaler" element={<Faresignaler />} />
                        </Routes>
                    </React.Suspense>
                </div>
            </div>
            <Historikk />
        </>
    );
};

export default BeregnetPeriodeView;
