import classNames from 'classnames';
import React from 'react';

import { BodyShort, HStack, Tooltip } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@components/Arbeidsgivernavn';
import { Kilde } from '@components/Kilde';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Errorikon } from '@components/ikoner/Errorikon';
import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import {
    Inntektskilde,
    Maybe,
    OmregnetArsinntekt,
    OverstyringFragment,
    PersonFragment,
    Sammenligningsgrunnlag,
} from '@io/graphql';
import { finnArbeidsgiver } from '@state/arbeidsgiverHelpers';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

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
    const endringer = finnArbeidsgiver(person, organisasjonsnummer)?.overstyringer;
    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(endringer, person);

    return (
        <tr
            className={classNames(styles.arbeidsgiverRow, erGjeldende && styles.erGjeldende)}
            onClick={onSetAktivInntektskilde}
        >
            <td>
                <HStack
                    gap="3"
                    align="center"
                    maxWidth="228px"
                    className={classNames(!!arbeidsforholdErDeaktivert && styles.arbeidsgivernavnDeaktivert)}
                >
                    {!!arbeidsforholdErDeaktivert ? (
                        <Tooltip content="Arbeidsforhold er deaktivert">
                            <HStack align="center">
                                <Errorikon />
                            </HStack>
                        </Tooltip>
                    ) : (
                        <Arbeidsgiverikon />
                    )}
                    <Arbeidsgivernavn
                        identifikator={organisasjonsnummer}
                        navn={arbeidsgivernavn}
                        visIdentifikatorITooltip={true}
                        maxWidth="130px"
                    />
                </HStack>
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
