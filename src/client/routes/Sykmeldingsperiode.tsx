import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { useTranslation } from 'react-i18next';
import { Dagtype } from '../context/types';
import { Periodetabell } from '@navikt/helse-frontend-tabell/dist';
import { Dagtype as PeriodetabellDagtype } from '@navikt/helse-frontend-tabell/dist/periodetabell';
import styled from '@emotion/styled';

const dagType = (type: Dagtype): PeriodetabellDagtype => {
    switch (type) {
        case Dagtype.SYKEDAG:
            return PeriodetabellDagtype.Syk;
        case Dagtype.PERMISJONSDAG:
        case Dagtype.FERIEDAG:
            return PeriodetabellDagtype.Ferie;
        case Dagtype.UTENLANDSDAG:
        case Dagtype.UBESTEMTDAG:
        case Dagtype.STUDIEDAG:
            return PeriodetabellDagtype.Ubestemt;
        case Dagtype.IMPLISITT_DAG:
        case Dagtype.ARBEIDSDAG:
            return PeriodetabellDagtype.Arbeidsdag;
        case Dagtype.SYK_HELGEDAG:
            return PeriodetabellDagtype.Helg;
        case Dagtype.EGENMELDINGSDAG:
            return PeriodetabellDagtype.Egenmelding;
    }
};

const Container = styled.div`
    padding: 1.5rem 2rem;

    td {
        vertical-align: middle;
    }

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { t } = useTranslation();

    const dager =
        aktivVedtaksperiode?.sykdomstidslinje.map(dag => ({
            type: dagType(dag.type as Dagtype),
            dato: dag.dagen,
            gradering: 100
        })) ?? [];

    return (
        <Container>
            <Periodetabell dager={dager} />
            <Navigasjonsknapper next={pages.INNGANGSVILKÅR} />
        </Container>
    );
};

export default Sykmeldingsperiode;
