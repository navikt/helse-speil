import styled from '@emotion/styled';
import React, { useState } from 'react';

import { BodyShort, Link } from '@navikt/ds-react';

import { LinkButton } from '../../../components/LinkButton';
import { useArbeidsgiver } from '../../../modell/arbeidsgiver';
import { useUtbetaling } from '../../../modell/utbetalingshistorikkelement';
import { usePersonnavn, useSykepengegrunnlag } from '../../../state/person';
import { somPenger } from '../../../utils/locale';

import { anonymisertPersoninfo, getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Card } from './Card';
import { CardTitle } from './CardTitle';
import { Utbetalingssum } from './Utbetalingssum';
import { SimuleringsinfoModal } from './utbetaling/SimuleringsinfoModal';

const Feilmelding = styled(BodyShort)`
    color: var(--navds-color-text-error);
    font-weight: 600;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.125rem;
    justify-items: flex-start;
`;

const Value = styled(BodyShort)`
    justify-self: flex-end;
`;

interface UtbetalingCardProps {
    beregningId: string;
    utbetalingsdagerTotalt: number;
    ikkeUtbetaltEnda: boolean;
    simulering?: Vedtaksperiode['simuleringsdata'];
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
                <BodyShort as="p">Sykepengegrunnlag</BodyShort>
                <Value as="p">{somPenger(sykepengegrunnlag?.sykepengegrunnlag)}</Value>
                <BodyShort as="p">Utbetalingdager</BodyShort>
                <Value as="p">{utbetalingsdagerTotalt}</Value>
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
                    <LinkButton onClick={() => setSimuleringÅpen(true)}>Simulering</LinkButton>
                    <SimuleringsinfoModal
                        simulering={simulering}
                        åpenModal={simuleringÅpen}
                        lukkModal={() => setSimuleringÅpen(false)}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                </>
            ) : (
                <Feilmelding as="p">Mangler simulering</Feilmelding>
            )}
        </Card>
    );
};
