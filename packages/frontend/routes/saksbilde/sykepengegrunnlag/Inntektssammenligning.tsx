import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '../../../components/Kilde';
import { useArbeidsgivernavn, useEndringerForPeriode } from '../../../state/person';
import { getKildeType, kilde } from '../../../utils/inntektskilde';
import { somPenger } from '../../../utils/locale';

import { EndringsloggInntektEllerArbeidsforholdButton } from '../utbetaling/utbetalingstabell/EndringsloggInntektEllerArbeidsforholdButton';
import { Bag } from '@navikt/ds-icons';
import { AnonymizableText } from '../../../components/anonymizable/AnonymizableText';
import { useArbeidsforholdErDeaktivert } from '../../../modell/arbeidsgiver';
import { Errorikon } from '../../../components/ikoner/Errorikon';

const ArbeidsgiverRad = styled.tr<{ erGjeldende: boolean }>`
    padding: 0.25rem;

    > * {
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `};
    }

    &:hover > * {
        background-color: var(--navds-color-gray-10);
        cursor: pointer;
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `}
    }
`;

const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;
    justify-content: right;

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

const Arbeidsgivernavn = styled.div`
    display: flex;
`;
const BagIcon = styled(Bag)`
    width: 20px;
    min-width: 20px;
    height: 20px;
    margin-right: 15px;
`;

const ErrorIcon = styled(Errorikon)`
    min-width: 20px;
    margin-right: 15px;
`;

interface InntektssammenligningProps {
    organisasjonsnummer: string;
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
    sammenligningsgrunnlag: number | null;
    erGjeldende: boolean;
    onSetAktivInntektskilde: () => void;
}

export const Inntektssammenligning = ({
    organisasjonsnummer,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    erGjeldende,
    onSetAktivInntektskilde,
}: InntektssammenligningProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(organisasjonsnummer);
    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);

    const arbeidsforholdErDeaktivert = useArbeidsforholdErDeaktivert(organisasjonsnummer);

    return (
        <ArbeidsgiverRad erGjeldende={erGjeldende} onClick={onSetAktivInntektskilde}>
            <td>
                <Arbeidsgivernavn>
                    {arbeidsforholdErDeaktivert ? (
                        <ErrorIcon data-tip="Arbeidsgiver" />
                    ) : (
                        <BagIcon data-tip="Arbeidsgiver" title="Arbeidsgiver" />
                    )}
                    <AnonymizableText>{arbeidsgivernavn}</AnonymizableText>
                </Arbeidsgivernavn>
            </td>
            <td>
                <InntektMedKilde>
                    {!arbeidsforholdErDeaktivert && (
                        <BodyShort>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.beløp) : 'Ukjent'}</BodyShort>
                    )}
                    {omregnetÅrsinntekt?.kilde === 'Saksbehandler' || arbeidsforholdErDeaktivert ? (
                        <EndringsloggInntektEllerArbeidsforholdButton
                            arbeidsforholdendringer={arbeidsforholdendringer}
                            inntektsendringer={inntektsendringer}
                        />
                    ) : (
                        omregnetÅrsinntekt && (
                            <Kilde type={getKildeType(omregnetÅrsinntekt.kilde)}>
                                {kilde(omregnetÅrsinntekt.kilde)}
                            </Kilde>
                        )
                    )}
                </InntektMedKilde>
            </td>
            <td>
                <InntektMedKilde>
                    <BodyShort>{somPenger(sammenligningsgrunnlag)}</BodyShort>
                    <Kilde type="Aordningen">AO</Kilde>
                </InntektMedKilde>
            </td>
        </ArbeidsgiverRad>
    );
};
