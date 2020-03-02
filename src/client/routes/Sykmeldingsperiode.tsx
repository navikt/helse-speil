import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { useTranslation } from 'react-i18next';
import { Dag, Dagtype, Kildelabel } from '../context/types';
import { Periodetabell } from '@navikt/helse-frontend-tabell';
import { Dagtype as PeriodetabellDagtype } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';

const dagType = (type: Dagtype): PeriodetabellDagtype => {
    switch (type) {
        case Dagtype.SYKEDAG_SØKNAD:
        case Dagtype.SYKEDAG_SYKMELDING:
            return PeriodetabellDagtype.Syk;
        case Dagtype.PERMISJONSDAG_SØKNAD:
        case Dagtype.PERMISJONSDAG_AAREG:
        case Dagtype.FERIEDAG_INNTEKTSMELDING:
        case Dagtype.FERIEDAG_SØKNAD:
            return PeriodetabellDagtype.Ferie;
        case Dagtype.UTENLANDSDAG:
        case Dagtype.UBESTEMTDAG:
        case Dagtype.STUDIEDAG:
            return PeriodetabellDagtype.Ubestemt;
        case Dagtype.IMPLISITT_DAG:
        case Dagtype.ARBEIDSDAG_SØKNAD:
        case Dagtype.ARBEIDSDAG_INNTEKTSMELDING:
            return PeriodetabellDagtype.Arbeidsdag;
        case Dagtype.SYK_HELGEDAG_SYKMELDING:
        case Dagtype.SYK_HELGEDAG_SØKNAD:
            return PeriodetabellDagtype.Helg;
        case Dagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case Dagtype.EGENMELDINGSDAG_SØKNAD:
            return PeriodetabellDagtype.Egenmelding;
    }
};

const hendelseType = (type: Dagtype) => {
    switch (type) {
        case Dagtype.ARBEIDSDAG_INNTEKTSMELDING:
        case Dagtype.EGENMELDINGSDAG_INNTEKTSMELDING:
        case Dagtype.FERIEDAG_INNTEKTSMELDING:
            return 'IM';
        case Dagtype.ARBEIDSDAG_SØKNAD:
        case Dagtype.EGENMELDINGSDAG_SØKNAD:
        case Dagtype.FERIEDAG_SØKNAD:
        case Dagtype.PERMISJONSDAG_SØKNAD:
        case Dagtype.SYKEDAG_SØKNAD:
        case Dagtype.SYK_HELGEDAG_SØKNAD:
        case Dagtype.STUDIEDAG:
        case Dagtype.UTENLANDSDAG:
            return 'SØ';
        case Dagtype.SYK_HELGEDAG_SYKMELDING:
        case Dagtype.SYKEDAG_SYKMELDING:
            return 'SM';
        case Dagtype.UBESTEMTDAG:
        case Dagtype.IMPLISITT_DAG:
        case Dagtype.PERMISJONSDAG_AAREG:
            return undefined;
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
        aktivVedtaksperiode?.sykdomstidslinje.map((dag, index) => ({
            type: dagType(dag.type as Dagtype),
            dato: dag.dagen,
            gradering: 100,
            kilde: hendelseType(dag.type as Dagtype)
                ? { label: hendelseType(dag.type as Dagtype) as Kildelabel, link: '' }
                : undefined
        })) ?? [];

    return (
        <Container>
            <Periodetabell dager={dager} />
            <Navigasjonsknapper next={pages.INNGANGSVILKÅR} />
        </Container>
    );
};

export default Sykmeldingsperiode;
