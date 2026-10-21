import React from 'react';

import { BodyShort, HStack, Tooltip } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Kilde } from '@components/Kilde';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Errorikon } from '@components/ikoner/Errorikon';
import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import {
    ApiInntektskilde,
    ApiOmregnetArsinntekt,
    ApiOverstyring,
    ApiSaksbildePerson,
    ApiSammenligningsgrunnlag,
} from '@io/rest/generated/spesialist.schemas';
import { finnArbeidsgiverMedOrganisasjonsnummer } from '@state/inntektsforhold/arbeidsgiver';
import { lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

import { EndringsloggButton } from '../inntekt/EndringsloggButton';
import { TableCell } from './TableCell';

import styles from './Inntektssammenligning.module.css';

interface InntektssammenligningProps {
    person: ApiSaksbildePerson;
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: ApiOmregnetArsinntekt | null;
    skjønnsmessigFastsatt?: ApiOmregnetArsinntekt | null;
    sammenligningsgrunnlag?: ApiSammenligningsgrunnlag | null;
    arbeidsforholdErDeaktivert?: boolean | null;
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
    const endringer = finnArbeidsgiverMedOrganisasjonsnummer(person, organisasjonsnummer)?.overstyringer;
    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(endringer, person);

    return (
        <tr className={cn(styles.arbeidsgiverRow, erGjeldende && styles.erGjeldende)} onClick={onSetAktivInntektskilde}>
            <td>
                <HStack
                    gap="space-12"
                    align="center"
                    maxWidth="228px"
                    className={cn(!!arbeidsforholdErDeaktivert && styles.arbeidsgivernavnDeaktivert)}
                >
                    {arbeidsforholdErDeaktivert === true ? (
                        <Tooltip content="Arbeidsforhold er deaktivert">
                            <HStack align="center">
                                <Errorikon />
                            </HStack>
                        </Tooltip>
                    ) : (
                        <Arbeidsgiverikon />
                    )}
                    <Inntektsforholdnavn
                        inntektsforholdReferanse={lagArbeidsgiverReferanse(organisasjonsnummer, arbeidsgivernavn)}
                        visOrganisasjonsnummerITooltip={true}
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
                ikon={<Kilde type={ApiInntektskilde.AORDNINGEN}>AO</Kilde>}
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
    arbeidsforholdErDeaktivert?: boolean | null;
    beløp?: number;
}

const OmregnetÅrsinntektContent = ({ arbeidsforholdErDeaktivert, beløp }: OmregnetÅrsinntektContentProps) => (
    <BodyShort>{!arbeidsforholdErDeaktivert ? somPenger(beløp) : '-'}</BodyShort>
);

interface OmregnetÅrsinntektIkonProps {
    arbeidsforholdErDeaktivert?: boolean | null;
    endringer: ApiOverstyring[];
    kilde?: ApiInntektskilde;
}

const OmregnetÅrsinntektIkon = ({ arbeidsforholdErDeaktivert, endringer, kilde }: OmregnetÅrsinntektIkonProps) =>
    kilde === ApiInntektskilde.SAKSBEHANDLER || arbeidsforholdErDeaktivert ? (
        <EndringsloggButton endringer={endringer} />
    ) : (
        kilde && kilde !== ApiInntektskilde.IKKE_RAPPORTERT && <Kilde type={kilde}>{kildeForkortelse(kilde)}</Kilde>
    );

interface SkjønnsfastsettingContentProps {
    arbeidsforholdErDeaktivert?: boolean | null;
    kilde?: ApiInntektskilde;
    beløp?: number;
}

const SkjønnsfastsettingContent = ({ arbeidsforholdErDeaktivert, kilde, beløp }: SkjønnsfastsettingContentProps) => (
    <BodyShort>
        {!arbeidsforholdErDeaktivert && kilde === ApiInntektskilde.SKJONNSMESSIG_FASTSATT ? somPenger(beløp) : '-'}
    </BodyShort>
);
