import styled from '@emotion/styled';
import { Simulering } from 'internal-types';
import React, { useState } from 'react';

import Lenke from 'nav-frontend-lenker';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';

import { useArbeidsgiver } from '../../../modell/arbeidsgiver';
import { useUtbetaling } from '../../../modell/utbetalingshistorikkelement';
import { usePersonnavn, useSykepengegrunnlag } from '../../../state/person';
import { somPenger } from '../../../utils/locale';

import { anonymisertPersoninfo, getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Card } from './Card';
import { CardTitle } from './CardTitle';
import { Utbetalingssum } from './Utbetalingssum';
import { SimuleringsinfoModal } from './utbetaling/SimuleringsinfoModal';

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.125rem;
    justify-items: flex-start;
`;

const Value = styled(Normaltekst)`
    justify-self: flex-end;
`;

interface UtbetalingCardProps {
    beregningId: string;
    utbetalingsdagerTotalt: number;
    ikkeUtbetaltEnda: boolean;
    simulering?: Simulering;
    anonymiseringEnabled: boolean;
}

export const UtbetalingCard = ({
    beregningId,
    utbetalingsdagerTotalt,
    ikkeUtbetaltEnda,
    simulering,
    anonymiseringEnabled,
}: UtbetalingCardProps) => {
    const sykepengegrunnlag = useSykepengegrunnlag(beregningId);
    const [simuleringÅpen, setSimuleringÅpen] = useState(false);

    const { arbeidsgiverNettobeløp, personNettobeløp } = useUtbetaling(beregningId) ?? {
        arbeidsgiverNettobeløp: 0,
        personNettobeløp: 0,
    };

    const fornavnMellomnavnEtternavn = usePersonnavn();
    const personnavn = anonymiseringEnabled
        ? `${anonymisertPersoninfo.fornavn} ${anonymisertPersoninfo.etternavn}`
        : fornavnMellomnavnEtternavn;

    const arbeidsgiver = useArbeidsgiver();
    const arbeidsgivernavn =
        anonymiseringEnabled && arbeidsgiver
            ? getAnonymArbeidsgiverForOrgnr(arbeidsgiver.organisasjonsnummer).navn
            : arbeidsgiver?.navn ?? arbeidsgiver?.organisasjonsnummer;

    return (
        <Card>
            <CardTitle>TIL UTBETALING</CardTitle>
            <Grid>
                <Normaltekst>Sykepengegrunnlag</Normaltekst>
                <Value>{somPenger(sykepengegrunnlag?.sykepengegrunnlag)}</Value>
                <Normaltekst>Utbetalingdager</Normaltekst>
                <Value>{utbetalingsdagerTotalt}</Value>
            </Grid>
            <Utbetalingssum
                erUtbetalt={!ikkeUtbetaltEnda}
                personNettobeløp={personNettobeløp ?? 0}
                arbeidsgiverNettobeløp={arbeidsgiverNettobeløp ?? 0}
                arbeidsgivernavn={arbeidsgivernavn ?? 'Arbeidsgiver'}
                personnavn={personnavn}
            />
            {simulering ? (
                <>
                    <Lenke href="#" onClick={() => setSimuleringÅpen(true)}>
                        Simulering
                    </Lenke>
                    <SimuleringsinfoModal
                        simulering={simulering}
                        åpenModal={simuleringÅpen}
                        lukkModal={() => setSimuleringÅpen(false)}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                </>
            ) : (
                <Feilmelding>Mangler simulering</Feilmelding>
            )}
        </Card>
    );
};
