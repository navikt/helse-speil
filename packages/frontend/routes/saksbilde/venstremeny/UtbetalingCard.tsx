import styled from '@emotion/styled';
import React, { useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LinkButton } from '../../../components/LinkButton';
import { useUtbetaling } from '../../../modell/utbetalingshistorikkelement';
import { useArbeidsgivernavnRender, usePersonnavnRender, useVilkårsgrunnlaghistorikk } from '../../../state/person';
import { somPenger } from '../../../utils/locale';
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
    skjæringstidspunkt: DateString;
    vilkårsgrunnlaghistorikkId: UUID;
    organisasjonsnummer: string;
}

export const UtbetalingCard = ({
    beregningId,
    utbetalingsdagerTotalt,
    ikkeUtbetaltEnda,
    simulering,
    skjæringstidspunkt,
    vilkårsgrunnlaghistorikkId,
    organisasjonsnummer,
}: UtbetalingCardProps) => {
    const vilkårsgrunnlaghistorikk = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlaghistorikkId);
    const [simuleringÅpen, setSimuleringÅpen] = useState(false);

    const { arbeidsgiverNettobeløp, personNettobeløp } = useUtbetaling(beregningId) ?? {
        arbeidsgiverNettobeløp: 0,
        personNettobeløp: 0,
    };

    const personnavn = usePersonnavnRender();
    const arbeidsgivernavn = useArbeidsgivernavnRender(organisasjonsnummer);

    return (
        <section>
            <CardTitle>TIL UTBETALING</CardTitle>
            <Grid>
                <BodyShort as="p">Sykepengegrunnlag</BodyShort>
                <Value as="p">{somPenger(vilkårsgrunnlaghistorikk?.sykepengegrunnlag)}</Value>
                <BodyShort as="p">Utbetalingsdager</BodyShort>
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
                    />
                </>
            ) : (
                <Feilmelding as="p">Mangler simulering</Feilmelding>
            )}
        </section>
    );
};
