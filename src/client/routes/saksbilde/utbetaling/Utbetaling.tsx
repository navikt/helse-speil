import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { InntektskildeType, Person, Tidslinjetilstand, Vedtaksperiode } from 'internal-types';
import React, { useState } from 'react';

import { Feilmelding } from 'nav-frontend-typografi';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { OverstyringTimeoutModal } from '../../../components/OverstyringTimeoutModal';
import { PopoverHjelpetekst } from '../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../components/ikoner/SortInfoikon';
import { Tidslinjeperiode } from '../../../modell/utbetalingshistorikkelement';
import { usePerson } from '../../../state/person';

import { defaultUtbetalingToggles, erDev, erLocal, UtbetalingToggles } from '../../../featureToggles';
import { OverstyrbarUtbetalingstabell } from './utbetalingstabell/OverstyrbarUtbetalingstabell';
import { Overstyringsknapp } from './utbetalingstabell/Overstyringsknapp';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';

const FeilmeldingContainer = styled.div`
    margin-top: 1rem;
`;

const arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden = (
    person: Person,
    periode: Tidslinjeperiode
) => {
    const alleTidslinjeperioder = person.arbeidsgivere.map((it) => it.tidslinjeperioder).filter((it) => it.length > 0);
    const alleTidslinjeperioderISisteGenerasjon = alleTidslinjeperioder.flatMap((it) => it[0]);
    const periodeFinnesISisteGenerasjon = alleTidslinjeperioderISisteGenerasjon.find(
        (it) => it.id === periode.id && it.beregningId === periode.beregningId && it.unique === periode.unique
    );

    if (!periodeFinnesISisteGenerasjon) return false;

    const vedtaksperiode = person.arbeidsgivere
        .flatMap((it) => it.vedtaksperioder)
        .filter((it) => it.fullstendig)
        .map((it) => it as Vedtaksperiode)
        .find((it) => it.id === periode.id);

    const arbeidsgiver = person.arbeidsgivere.find((arb) => arb.organisasjonsnummer === periode.organisasjonsnummer);
    const periodensSkjæringstidspunkt = vedtaksperiode?.vilkår?.dagerIgjen.skjæringstidspunkt;
    const arbeidsgiversSisteTidslinjeperiode = arbeidsgiver?.tidslinjeperioder[0].filter((it) => it.fullstendig)[0];

    const sisteVedtaksperiodeForArbeidsgiver = person.arbeidsgivere
        .flatMap((it) => it.vedtaksperioder)
        .filter((it) => it.fullstendig)
        .map((it) => it as Vedtaksperiode)
        .find((it) => it.id === arbeidsgiversSisteTidslinjeperiode?.id);

    const arbeidsgiversSisteSkjæringstidspunkt =
        sisteVedtaksperiodeForArbeidsgiver?.vilkår?.dagerIgjen.skjæringstidspunkt;
    if (!periodensSkjæringstidspunkt) return false;
    return arbeidsgiversSisteSkjæringstidspunkt?.isSame(periodensSkjæringstidspunkt, 'day') ?? false;
};

const kunEnArbeidsgiver = (periode: Tidslinjeperiode) => periode.inntektskilde === InntektskildeType.EnArbeidsgiver;

const godkjentTilstander = [
    Tidslinjetilstand.Utbetalt,
    Tidslinjetilstand.UtbetaltAutomatisk,
    Tidslinjetilstand.Revurdert,
    Tidslinjetilstand.RevurdertIngenUtbetaling,
];

const overlappendePerioder = (person: Person, periode: Tidslinjeperiode) =>
    alleTidslinjeperioder(person).filter((it) => overlapper(it, periode));

const alleOverlappendePerioderErAvsluttet = (person: Person, aktivPeriode: Tidslinjeperiode): boolean => {
    const overlappende = overlappendePerioder(person, aktivPeriode);

    if (any(overlappende, godkjentTilstander)) {
        return none(overlappende, Tidslinjetilstand.Revurderes);
    }
    return true;
};

const alleOverlappendePerioderErTilRevurdering = (person: Person, aktivPeriode: Tidslinjeperiode): boolean => {
    const overlappende = overlappendePerioder(person, aktivPeriode);

    if (any(overlappende, Tidslinjetilstand.Revurderes)) {
        return all(overlappende, Tidslinjetilstand.Revurderes);
    }
    return true;
};

const any = (perioder: Tidslinjeperiode[], tilstand: Tidslinjetilstand | Tidslinjetilstand[]) =>
    perioder.filter((periode) => tilstand.includes(periode.tilstand)).length > 0;

const none = (perioder: Tidslinjeperiode[], tilstand: Tidslinjetilstand | Tidslinjetilstand[]) =>
    perioder.filter((periode) => tilstand.includes(periode.tilstand)).length === 0;

const all = (perioder: Tidslinjeperiode[], tilstand: Tidslinjetilstand | Tidslinjetilstand[]) =>
    perioder.filter((periode) => tilstand.includes(periode.tilstand)).length === perioder.length;

const overlapper = (periode: Tidslinjeperiode, other: Tidslinjeperiode) =>
    (periode.fom.isSameOrAfter(other.fom) && periode.fom.isSameOrBefore(other.tom)) ||
    (periode.tom.isSameOrAfter(other.fom) && periode.tom.isSameOrBefore(other.tom));

const alleTidslinjeperioder = (person: Person) =>
    person.arbeidsgivere
        .filter((arbeidsgiver) => arbeidsgiver.tidslinjeperioder.length > 0)
        .flatMap((arbeidsgiver) => arbeidsgiver.tidslinjeperioder[0].map((periode) => periode));

const revurderingEnabled = (person: Person, periode: Tidslinjeperiode, toggles: UtbetalingToggles): boolean => {
    return (
        toggles.overstyreUtbetaltPeriodeEnabled &&
        alleOverlappendePerioderErAvsluttet(person, periode) &&
        arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode) &&
        godkjentTilstander.includes(periode.tilstand)
    );
};

const overstyrRevurderingEnabled = (person: Person, periode: Tidslinjeperiode, toggles: UtbetalingToggles): boolean => {
    return (
        toggles.overstyreUtbetaltPeriodeEnabled &&
        alleOverlappendePerioderErTilRevurdering(person, periode) &&
        arbeidsgiversSisteSkjæringstidspunktErLikSkjæringstidspunktetTilPerioden(person, periode) &&
        periode.tilstand === Tidslinjetilstand.Revurderes
    );
};

const overstyringEnabled = (person: Person, periode: Tidslinjeperiode, toggles: UtbetalingToggles): boolean =>
    kunEnArbeidsgiver(periode) &&
    [
        Tidslinjetilstand.Oppgaver,
        Tidslinjetilstand.Avslag,
        Tidslinjetilstand.IngenUtbetaling,
        Tidslinjetilstand.Feilet,
    ].includes(periode.tilstand);

export interface UtbetalingProps {
    periode: Tidslinjeperiode;
    vedtaksperiode: Vedtaksperiode;
    maksdato?: Dayjs;
    gjenståendeDager?: number;
}

export const Utbetaling = ({ gjenståendeDager, maksdato, periode, vedtaksperiode }: UtbetalingProps) => {
    const person = usePerson() as Person;

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const toggleOverstyring = () => {
        setOverstyrer((value) => !value);
    };

    const revurderingIsEnabled = revurderingEnabled(person, periode, defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = overstyrRevurderingEnabled(person, periode, defaultUtbetalingToggles);
    const overstyringIsEnabled = overstyringEnabled(person, periode, defaultUtbetalingToggles);

    return (
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <FlexColumn style={{ paddingBottom: '4rem' }} data-testid="utbetaling-side">
                {(overstyringIsEnabled || revurderingIsEnabled || overstyrRevurderingIsEnabled) && (
                    <Flex justifyContent="flex-end" style={{ paddingTop: '1rem' }}>
                        {vedtaksperiode.erForkastet ? (
                            <PopoverHjelpetekst ikon={<SortInfoikon />} offset={24}>
                                <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                            </PopoverHjelpetekst>
                        ) : (
                            <Overstyringsknapp
                                overstyrer={overstyrer}
                                toggleOverstyring={toggleOverstyring}
                                data-testid="overstyringsknapp"
                            >
                                {revurderingIsEnabled ? 'Revurder' : 'Endre'}
                            </Overstyringsknapp>
                        )}
                    </Flex>
                )}
                <Flex style={{ height: '100%', paddingTop: '1rem' }}>
                    {overstyrer ? (
                        <OverstyrbarUtbetalingstabell
                            periode={periode}
                            onPostOverstyring={postOverstyring}
                            onCloseOverstyring={() => setOverstyrer(false)}
                            gjenståendeDager={gjenståendeDager}
                            maksdato={maksdato}
                            erRevurdering={revurderingIsEnabled}
                        />
                    ) : (
                        <Utbetalingstabell
                            maksdato={maksdato}
                            gjenståendeDager={gjenståendeDager}
                            periode={periode}
                            overstyringer={vedtaksperiode.overstyringer}
                        />
                    )}
                </Flex>
                {state === 'timedOut' && <OverstyringTimeoutModal onRequestClose={() => null} />}
                {state === 'hasError' && (
                    <FeilmeldingContainer>
                        {error && <Feilmelding role="alert">{error}</Feilmelding>}
                    </FeilmeldingContainer>
                )}
            </FlexColumn>
        </AgurkErrorBoundary>
    );
};
