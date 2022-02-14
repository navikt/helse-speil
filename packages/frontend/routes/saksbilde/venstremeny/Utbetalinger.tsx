import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Bag, People } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { somPenger } from '@utils/locale';
import { LinkButton } from '@components/LinkButton';

import { SimuleringsinfoModal } from './utbetaling/SimuleringsinfoModal';

const Container = styled.div`
    display: grid;
    margin-top: 2rem;
    align-items: center;
    grid-template-columns: 2.5rem auto auto;
    grid-gap: 0.25rem;
    grid-template-areas:
        'title title total'
        'arbeidsgiverIcon arbeidsgiverName arbeidsgiverSum'
        '. simuleringArbeidsgiver .'
        'personIcon personName personSum'
        '. simuleringPerson .';
`;

const Title = styled(BodyShort)`
    font-weight: 600;
    grid-area: title;
`;

const Total = styled(BodyShort)`
    font-weight: 600;
    grid-area: total;
    justify-self: flex-end;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
`;

const ArbeidsgiverIcon = styled(IconContainer)`
    grid-area: arbeidsgiverIcon;
    justify-self: flex-end;
`;

const PersonIcon = styled(IconContainer)`
    grid-area: personIcon;
    justify-self: flex-end;
`;

const ArbeidsgiverName = styled.div`
    grid-area: arbeidsgiverName;
    max-width: 150px;
`;

const PersonName = styled.div`
    grid-area: personName;
    max-width: 150px;
`;

const ArbeidsgiverSum = styled(BodyShort)`
    grid-area: arbeidsgiverSum;
    justify-self: flex-end;
`;

const PersonSum = styled(BodyShort)`
    grid-area: personSum;
    justify-self: flex-end;
`;

const SimuleringButton = styled(LinkButton)`
    margin-top: -0.25rem;
    margin-bottom: 0.25rem;
    width: max-content;
`;

interface BeløpTilUtbetalingProps {
    erUtbetalt: boolean;
    personNettobeløp: number;
    arbeidsgiverNettobeløp: number;
    arbeidsgivernavn: string;
    personnavn: string;
    simuleringsdata?: Simuleringsdata;
}

export const Utbetalinger = ({
    erUtbetalt,
    personNettobeløp,
    arbeidsgiverNettobeløp,
    arbeidsgivernavn,
    personnavn,
    simuleringsdata,
}: BeløpTilUtbetalingProps) => {
    const [simulering, setSimulering] = useState<Simulering | null>();
    return (
        <Container>
            <Title as="p">{erUtbetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}</Title>
            <Total as="p">{somPenger(arbeidsgiverNettobeløp + personNettobeløp)}</Total>
            <ArbeidsgiverIcon>
                <Bag data-tip="Arbeidsgiver" title="Arbeidsgiver" />
            </ArbeidsgiverIcon>
            <ArbeidsgiverName>
                <AnonymizableTextWithEllipsis>{arbeidsgivernavn}</AnonymizableTextWithEllipsis>
            </ArbeidsgiverName>
            <ArbeidsgiverSum as="p">{somPenger(arbeidsgiverNettobeløp)}</ArbeidsgiverSum>
            {simuleringsdata?.arbeidsgiver && (
                <SimuleringButton
                    style={{ gridArea: 'simuleringArbeidsgiver' }}
                    onClick={() => setSimulering(simuleringsdata.arbeidsgiver)}
                >
                    Simulering
                </SimuleringButton>
            )}
            <PersonIcon>
                <People data-tip="Sykmeldt" title="Arbeidstaker" />
            </PersonIcon>
            <PersonName>
                <AnonymizableTextWithEllipsis>{personnavn}</AnonymizableTextWithEllipsis>
            </PersonName>
            <PersonSum as="p">{somPenger(personNettobeløp)}</PersonSum>
            {simuleringsdata?.person && (
                <SimuleringButton
                    style={{ gridArea: 'simuleringPerson' }}
                    onClick={() => setSimulering(simuleringsdata.person)}
                >
                    Simulering
                </SimuleringButton>
            )}
            {simulering && <SimuleringsinfoModal simulering={simulering} lukkModal={() => setSimulering(null)} />}
        </Container>
    );
};
