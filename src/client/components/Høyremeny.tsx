import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Hendelsesoversikt, { Hendelsetype } from '@navikt/helse-frontend-hendelsesoversikt';
import { PersonContext } from '../context/PersonContext';
import dayjs from 'dayjs';
import { Hendelse } from '../context/types';

const Container = styled.div`
    flex: 1;
    width: 16rem;
    max-width: 16rem;
    border-left: 1px solid #c6c2bf;
`;

const StyledHendelsesoversikt = styled(Hendelsesoversikt)`
    min-width: max-content;
    width: 100%;
`;

const typeForHendelse = (hendelse: Hendelse) => {
    switch (hendelse.type) {
        case 'INNTEKTSMELDING':
        case 'SENDT_SØKNAD':
        case 'NY_SØKNAD':
            return Hendelsetype.Dokumenter;
        default:
            return Hendelsetype.Historikk;
    }
};

const navnForHendelse = (hendelse: Hendelse) => {
    switch (hendelse.type) {
        case 'INNTEKTSMELDING':
            return 'Inntektsmelding mottatt';
        case 'SENDT_SØKNAD':
            return 'Søknad mottatt';
        case 'NY_SØKNAD':
            return 'Sykmelding mottatt';
        default:
            return 'Hendelse';
    }
};

const datoForHendelse = (hendelse: Hendelse) =>
    hendelse.rapportertdato ? dayjs(hendelse.rapportertdato).format('DD.MM.YYYY') : 'Ukjent dato';

const Høyremeny = () => {
    const { personTilBehandling } = useContext(PersonContext);

    const hendelser = personTilBehandling?.hendelser.map(hendelsen => ({
        id: `${hendelsen.type}-${hendelsen.fom}`,
        dato: datoForHendelse(hendelsen),
        navn: navnForHendelse(hendelsen),
        type: typeForHendelse(hendelsen)
    }));

    return (
        <Container>
            <StyledHendelsesoversikt hendelser={hendelser} />
        </Container>
    );
};

export default Høyremeny;
