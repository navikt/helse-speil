import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import {
    Inntektskilde,
    Maybe,
    OmregnetArsinntekt,
    OverstyringFragment,
    PersonFragment,
    Sammenligningsgrunnlag,
} from '@io/graphql';
import { useArbeidsgiver, useEndringerForPeriode } from '@state/arbeidsgiver';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { Arbeidsgivernavn } from '../Arbeidsgivernavn';
import { EndringsloggButton } from '../inntekt/EndringsloggButton';
import { TableCell } from './TableCell';

import styles from './Inntektssammenligning.module.css';

interface InntektssammenligningProps {
    person: PersonFragment;
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    skjønnsmessigFastsatt?: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag?: Maybe<Sammenligningsgrunnlag>;
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    erGjeldende: boolean;
    onSetAktivInntektskilde: () => void;
}

export const Inntektssammenligning = ({
    person,
    organisasjonsnummer,
    omregnetÅrsinntekt,
    skjønnsmessigFastsatt,
    sammenligningsgrunnlag,
    arbeidsforholdErDeaktivert,
    erGjeldende,
    onSetAktivInntektskilde,
}: InntektssammenligningProps) => {
    const arbeidsgivernavn = person.tilleggsinfoForInntektskilder.find(
        (it) => it.orgnummer === organisasjonsnummer,
    )?.navn;
    const endringer = useArbeidsgiver(person, organisasjonsnummer)?.overstyringer;
    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(endringer, person);

    return (
        <tr
            className={classNames(styles.arbeidsgiverRow, erGjeldende && styles.erGjeldende)}
            onClick={onSetAktivInntektskilde}
        >
            <td>
                <Arbeidsgivernavn
                    arbeidsgivernavn={arbeidsgivernavn}
                    organisasjonsnummer={organisasjonsnummer}
                    arbeidsforholdDeaktivert={!!arbeidsforholdErDeaktivert}
                />
            </td>
            <TableCell
                content={
                    <OmregnetÅrsinntektContent
                        arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                        beløp={omregnetÅrsinntekt?.belop}
                    />
                }
                ikon={
                    <OmregnetÅrsinntektIkon
                        endringer={[...inntektsendringer, ...arbeidsforholdendringer]}
                        arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                        kilde={omregnetÅrsinntekt?.kilde}
                    />
                }
            />
            <TableCell
                content={<BodyShort>{somPenger(sammenligningsgrunnlag?.belop)}</BodyShort>}
                ikon={<Kilde type={Inntektskilde.Aordningen}>AO</Kilde>}
            />
            <TableCell
                content={
                    <SkjønnsfastsettingContent
                        arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                        kilde={skjønnsmessigFastsatt?.kilde}
                        beløp={skjønnsmessigFastsatt?.belop}
                    />
                }
            />
        </tr>
    );
};

interface OmregnetÅrsinntektContentProps {
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    beløp?: number;
}

const OmregnetÅrsinntektContent = ({ arbeidsforholdErDeaktivert, beløp }: OmregnetÅrsinntektContentProps) => (
    <BodyShort>{!arbeidsforholdErDeaktivert ? somPenger(beløp) : '-'}</BodyShort>
);

interface OmregnetÅrsinntektIkonProps {
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    endringer: Array<OverstyringFragment>;
    kilde?: Inntektskilde;
}

const OmregnetÅrsinntektIkon = ({ arbeidsforholdErDeaktivert, endringer, kilde }: OmregnetÅrsinntektIkonProps) =>
    kilde === Inntektskilde.Saksbehandler || arbeidsforholdErDeaktivert ? (
        <EndringsloggButton endringer={endringer} />
    ) : (
        kilde && kilde !== Inntektskilde.IkkeRapportert && <Kilde type={kilde}>{kildeForkortelse(kilde)}</Kilde>
    );

interface SkjønnsfastsettingContentProps {
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    kilde?: Inntektskilde;
    beløp?: number;
}

const SkjønnsfastsettingContent = ({ arbeidsforholdErDeaktivert, kilde, beløp }: SkjønnsfastsettingContentProps) => (
    <BodyShort>
        {!arbeidsforholdErDeaktivert && kilde === Inntektskilde.SkjonnsmessigFastsatt ? somPenger(beløp) : '-'}
    </BodyShort>
);
