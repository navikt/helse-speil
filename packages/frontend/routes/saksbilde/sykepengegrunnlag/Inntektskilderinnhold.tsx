import React from 'react';

import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Tooltip } from '@components/Tooltip';
import { Clipboard } from '@components/clipboard';

import { ArbeidsforholdView } from '../ArbeidsforholdView';
import { Inntekt } from './inntekt/Inntekt';
import { defaultOverstyrToggles } from '@utils/featureToggles';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import type { Arbeidsforhold, Arbeidsgiverinntekt, BeregnetPeriode, Maybe, Person, Refusjon } from '@io/graphql';
import { Periodetilstand } from '@io/graphql';

import styles from './Inntektskilderinnhold.module.css';
import { Refusjonsoversikt } from './refusjon/Refusjonsoversikt';
import { useActivePeriod } from '@state/periodState';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';
import { useCurrentPerson } from '@state/personState';

const maybePeriodeTilGodkjenning = (person: Person, skjæringstidspunkt: DateString): Maybe<BeregnetPeriode> => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0].perioder)
            .filter(isBeregnetPeriode)
            .find((it) => it.tilstand === Periodetilstand.Oppgaver && it.skjaeringstidspunkt === skjæringstidspunkt) ??
        null
    );
};

const harIngenUtbetaltePerioderFor = (person: Person, skjæringstidspunkt: DateString): boolean => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0].perioder)
            .filter(isBeregnetPeriode)
            .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            .every((it) => it.tilstand === Periodetilstand.Oppgaver || it.tilstand === Periodetilstand.Venter) ?? false
    );
};

const useArbeidsforholdKanOverstyres = (inntekt: Arbeidsgiverinntekt): boolean => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();

    if (!isGhostPeriode(activePeriod) || !person) {
        return false;
    }

    const periodeTilGodkjenning = maybePeriodeTilGodkjenning(person, activePeriod.skjaeringstidspunkt);

    const harIngenUtbetaltePerioder = harIngenUtbetaltePerioderFor(person, activePeriod.skjaeringstidspunkt);

    return (
        defaultOverstyrToggles.overstyrArbeidsforholdUtenSykefraværEnabled &&
        activePeriod.organisasjonsnummer === inntekt.arbeidsgiver &&
        harIngenUtbetaltePerioder &&
        periodeTilGodkjenning !== undefined
    );
};

interface InntektskilderinnholdProps {
    inntekt: Arbeidsgiverinntekt;
    refusjon?: Refusjon | null;
    arbeidsgivernavn: string;
    bransjer: string[];
    arbeidsforhold: Arbeidsforhold[];
    skjæringstidspunkt: DateString;
}

export const Inntektskilderinnhold = ({
    inntekt,
    refusjon,
    arbeidsgivernavn,
    bransjer,
    arbeidsforhold,
    skjæringstidspunkt,
}: InntektskilderinnholdProps) => {
    return (
        <div className={styles.Inntektskilderinnhold}>
            <div className={styles.Header}>
                <div className={styles.Arbeidsgivernavn} data-tip="Arbeidsgivernavn">
                    <AnonymizableTextWithEllipsis>{arbeidsgivernavn}</AnonymizableTextWithEllipsis>
                </div>
                <div className={styles.Organisasjonsnummer}>
                    (
                    <Clipboard copyMessage="Organisasjonsnummer er kopiert" dataTip="Kopier organisasjonsnummer">
                        <AnonymizableContainer>{inntekt.arbeidsgiver}</AnonymizableContainer>
                    </Clipboard>
                    )
                </div>
                <Kilde type="AINNTEKT">AA</Kilde>
            </div>
            <AnonymizableText className={styles.Bransjer}>
                {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                {bransjer.join(', ')}
            </AnonymizableText>
            <div className={styles.Arbeidsforholdtabell}>
                {arbeidsforhold.map((it, i) => (
                    <ArbeidsforholdView
                        key={i}
                        startdato={it.startdato}
                        sluttdato={it.sluttdato}
                        stillingsprosent={it.stillingsprosent}
                        stillingstittel={it.stillingstittel}
                    />
                ))}
            </div>
            <Inntekt omregnetÅrsinntekt={inntekt.omregnetArsinntekt} organisasjonsnummer={inntekt.arbeidsgiver} />
            {refusjon && <Refusjonsoversikt refusjon={refusjon} />}
            <Tooltip effect="solid" />
        </div>
    );
};
