import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { Undertekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';
import { LovdataLenke } from '../../../components/LovdataLenke';
import { Tooltip } from '../../../components/Tooltip';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';

const InfolinjeContainer = styled(Flex)`
    margin-left: auto;
`;

const Strek = styled.hr`
    margin-left: 1.25rem;
    width: 1px;
    height: 2rem;
    border: 0;
    background-color: var(--navds-color-border);
`;

const InfolinjeElement = styled(Flex)`
    align-items: center;
    margin-left: 1.25rem;
    line-height: 32px;

    svg {
        margin-right: 0.5rem;
    }
`;

interface InfolinjeProps {
    arbeidsgivernavn?: string;
    arbeidsgiverOrgnr?: string;
    fom?: Dayjs;
    tom?: Dayjs;
    skjæringstidspunkt?: Dayjs;
    maksdato?: Dayjs;
    over67År?: boolean;
}

export const Infolinje = ({
    arbeidsgivernavn,
    arbeidsgiverOrgnr,
    fom,
    tom,
    skjæringstidspunkt,
    maksdato,
    over67År,
}: InfolinjeProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();

    const fomForVisning = fom?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent periodestart';
    const tomForVisning = tom?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent periodeslutt';
    const skjæringstidspunktForVisning =
        skjæringstidspunkt?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent skjæringstidspunkt';
    const maksDatoForVisning = maksdato?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent maksdato';

    return (
        <InfolinjeContainer alignItems="center">
            <Strek />
            <InfolinjeElement data-tip="Arbeidsgiver">
                <Arbeidsgiverikon />
                {anonymiseringEnabled
                    ? arbeidsgiverOrgnr
                        ? getAnonymArbeidsgiverForOrgnr(arbeidsgiverOrgnr).navn
                        : '-'
                    : arbeidsgivernavn}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Sykmeldingsperiode">
                <Sykmeldingsperiodeikon />
                {`${fomForVisning} - ${tomForVisning}`}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Skjæringstidspunkt">
                <Skjæringstidspunktikon />
                {skjæringstidspunktForVisning}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Maksdato">
                <Maksdatoikon />
                {maksDatoForVisning}
                {over67År && (
                    <Flex alignItems="center" style={{ marginLeft: '8px' }}>
                        <Advarselikon height={16} width={16} />
                        <Undertekst>
                            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                        </Undertekst>
                    </Flex>
                )}
            </InfolinjeElement>
            <Tooltip effect="solid" />
        </InfolinjeContainer>
    );
};
