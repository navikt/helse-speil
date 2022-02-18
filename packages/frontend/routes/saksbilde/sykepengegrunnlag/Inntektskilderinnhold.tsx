import React from 'react';

import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Tooltip } from '@components/Tooltip';
import { Clipboard } from '@components/clipboard';
import { useArbeidsgiverbransjer, useArbeidsgivernavn } from '@state/person';

import { Arbeidsforhold } from '../Arbeidsforhold';
import { Inntekt } from './inntekt/Inntekt';
import { defaultOverstyrToggles } from '@utils/featureToggles';
import { useAktivPeriode, useMaybePeriodeTilGodkjenning } from '../../../state/tidslinje';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import type { Refusjon } from '@io/graphql';
import { useArbeidsforhold } from '../../../modell/arbeidsgiver';
import { useHarIngenUtbetaltePerioderFor } from '../../../hooks/revurdering';

import styles from './Inntektskilderinnhold.module.css';
import { Refusjonsoversikt } from './refusjon/Refusjonsoversikt';

interface InntektskilderinnholdProps {
    inntekt: ExternalArbeidsgiverinntekt;
    refusjon?: Refusjon | null;
}

export const Inntektskilderinnhold = ({ inntekt, refusjon }: InntektskilderinnholdProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(inntekt.organisasjonsnummer);
    const bransjer = useArbeidsgiverbransjer(inntekt.organisasjonsnummer);
    const arbeidsforhold = useArbeidsforhold(inntekt.organisasjonsnummer);

    const aktivPeriode = useAktivPeriode();
    const harDeaktivertArbeidsforhold = inntekt.deaktivert ?? false;

    const skjæringstidspunkt = aktivPeriode.skjæringstidspunkt!;
    const periodeTilGodkjenning = useMaybePeriodeTilGodkjenning(skjæringstidspunkt);
    const organisasjonsnummerPeriodeTilGodkjenning = periodeTilGodkjenning
        ? periodeTilGodkjenning.organisasjonsnummer
        : undefined;
    const harIngenUtbetaltePerioder = useHarIngenUtbetaltePerioderFor(skjæringstidspunkt);

    const arbeidsforholdKanOverstyres =
        defaultOverstyrToggles.overstyrArbeidsforholdUtenSykefraværEnabled &&
        aktivPeriode.organisasjonsnummer === inntekt.organisasjonsnummer &&
        aktivPeriode.tilstand === 'utenSykefravær' &&
        harIngenUtbetaltePerioder &&
        periodeTilGodkjenning !== undefined;

    return (
        <div className={styles.Inntektskilderinnhold}>
            <div className={styles.Header}>
                <div className={styles.Arbeidsgivernavn} data-tip="Arbeidsgivernavn">
                    <AnonymizableTextWithEllipsis>{arbeidsgivernavn}</AnonymizableTextWithEllipsis>
                </div>
                <div className={styles.Organisasjonsnummer}>
                    (
                    <Clipboard copyMessage="Organisasjonsnummer er kopiert" dataTip="Kopier organisasjonsnummer">
                        <AnonymizableContainer>{inntekt.organisasjonsnummer}</AnonymizableContainer>
                    </Clipboard>
                    )
                </div>
                <Kilde type="Ainntekt">AA</Kilde>
            </div>
            <AnonymizableText className={styles.Bransjer}>
                {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                {bransjer.join(', ')}
            </AnonymizableText>
            <div className={styles.Arbeidsforholdtabell}>
                {arbeidsforhold.map((it, i) => (
                    <Arbeidsforhold
                        key={i}
                        startdato={it.startdato}
                        sluttdato={it.sluttdato}
                        stillingsprosent={it.stillingsprosent}
                        stillingstittel={it.stillingstittel}
                    />
                ))}
            </div>
            <Inntekt
                omregnetÅrsinntekt={inntekt.omregnetÅrsinntekt}
                organisasjonsnummer={inntekt.organisasjonsnummer}
                organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning}
                skjæringstidspunkt={skjæringstidspunkt}
                arbeidsforholdErDeaktivert={harDeaktivertArbeidsforhold}
                arbeidsforholdKanOverstyres={arbeidsforholdKanOverstyres}
            />
            {refusjon && <Refusjonsoversikt refusjon={refusjon} />}
            <Tooltip effect="solid" />
        </div>
    );
};
