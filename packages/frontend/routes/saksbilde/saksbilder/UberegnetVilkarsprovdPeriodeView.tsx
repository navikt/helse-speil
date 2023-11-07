import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Arbeidsforholdoverstyring, Overstyring, VilkarsgrunnlagSpleis } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { getLatestUtbetalingTimestamp, getOverstyringerForEksisterendePerioder } from '@state/selectors/person';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isSpleisVilkarsgrunnlag } from '@utils/typeguards';

import { Historikk } from '../historikk';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

const Utbetaling = React.lazy(() =>
    import('../utbetaling/Utbetaling.js').then((res) => ({ default: res.Utbetaling })).catch(onLazyLoadFail),
);
const Inngangsvilkår = React.lazy(() =>
    import('../vilkår/Inngangsvilkår.js').then((res) => ({ default: res.Inngangsvilkår })).catch(onLazyLoadFail),
);
const Sykepengegrunnlag = React.lazy(() =>
    import('../sykepengegrunnlag/Sykepengegrunnlag.js')
        .then((res) => ({ default: res.Sykepengegrunnlag }))
        .catch(onLazyLoadFail),
);

const UberegnetVilkarsprovdPeriodeViewLoader: React.FC = () => {
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

interface UberegnetVilkarsprovdPeriodeViewProps {
    period: UberegnetVilkarsprovdPeriode;
    person: FetchedPerson;
}

export const UberegnetVilkarsprovdPeriodeView: React.FC<UberegnetVilkarsprovdPeriodeViewProps> = ({
    period,
    person,
}) => {
    if (!period.skjaeringstidspunkt || !period.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const overstyringerEtterNyesteUtbetalingPåPerson = useOverstyringerEtterSisteGodkjenteUtbetaling(person);

    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, activePeriod);

    const navnPåDeaktiverteGhostArbeidsgivere = isSpleisVilkarsgrunnlag(vilkårsgrunnlag)
        ? person.arbeidsgivere
              .filter((arbeidsgiver) =>
                  arbeidsgiver.overstyringer.find(
                      (overstyring) =>
                          isArbeidsforholdoverstyring(overstyring) &&
                          !(overstyring as Arbeidsforholdoverstyring).ferdigstilt,
                  ),
              )
              .flatMap((arbeidsgiver) => arbeidsgiver.navn)
              .join(', ')
        : undefined;

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Saksbildevarsler
                    periodState={getPeriodState(period)}
                    varsler={period.varsler}
                    erTidligereSaksbehandler={erTidligereSaksbehandler}
                    endringerEtterNyesteUtbetalingPåPerson={overstyringerEtterNyesteUtbetalingPåPerson}
                    activePeriodTom={period.tom}
                    skjæringstidspunkt={period.skjaeringstidspunkt}
                    navnPåDeaktiverteGhostArbeidsgivere={navnPåDeaktiverteGhostArbeidsgivere}
                    avviksprosent={(vilkårsgrunnlag as VilkarsgrunnlagSpleis)?.avviksprosent}
                />
                <SaksbildeMenu />
                <div className={styles.RouteContainer}>
                    <React.Suspense fallback={<UberegnetVilkarsprovdPeriodeViewLoader />}>
                        <Routes>
                            <Route path="dagoversikt" element={<Utbetaling />} />
                            <Route path="inngangsvilkår" element={<Inngangsvilkår />} />
                            <Route path="sykepengegrunnlag" element={<Sykepengegrunnlag />} />
                        </Routes>
                    </React.Suspense>
                </div>
            </div>
            <Historikk />
        </>
    );
};

export default UberegnetVilkarsprovdPeriodeView;
