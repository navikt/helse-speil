import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { dato, gradering, ikon, kilde, tomCelle, type } from '../../components/tabell/rader';
import { PersonContext } from '../../context/PersonContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NORSK_DATOFORMAT } from '../../utils/date';
import '@navikt/helse-frontend-tabell/lib/main.css';
import Element from 'nav-frontend-typografi/lib/element';
import { Dagtype, Sykdomsdag } from '../../context/types.internal';
import { overstyrbareTabellerEnabled } from '../../featureToggles';
import { OverstyrbarDagtype } from '../../components/tabell/OverstyrbarDagtype';
import { IkonOverstyrt } from '../../components/tabell/ikoner/IkonOverstyrt';
import { Overstyringsknapp } from '../../components/tabell/Overstyringsknapp';
import { Overstyringsskjema } from '../../components/tabell/Overstyringsskjema';
import { OverstyrbarGradering } from '../../components/tabell/OverstyrbarGradering';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Overstyrtikon = styled(IkonOverstyrt)`
    display: flex;
    margin-left: -0.5rem;
`;

interface OverstyrbarTabellProps {
    overstyrer: boolean;
}

const OverstyrbarTabell = styled(Tabell)`
    ${({ overstyrer }: OverstyrbarTabellProps) =>
        overstyrer &&
        `
        tbody tr td {
            height: 48px;
        }
    `}
`;

export const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const [overstyrer, setOverstyrer] = useState(false);
    const [overstyrteDager, setOverstyrteDager] = useState<Sykdomsdag[]>([]);

    const avbrytOverstyring = () => {
        setOverstyrer(false);
    };

    const leggTilOverstyrtDag = (nyDag: Sykdomsdag) => {
        const finnesFraFør = overstyrteDager.find((dag) => dag.dato.isSame(nyDag.dato));
        if (!finnesFraFør) {
            setOverstyrteDager((dager) => [...dager, nyDag]);
        } else {
            setOverstyrteDager((dager) =>
                dager.map((gammelDag) => (gammelDag.dato.isSame(nyDag.dato) ? nyDag : gammelDag))
            );
        }
    };

    const fjernOverstyrtDag = (dagen: Sykdomsdag) => {
        setOverstyrteDager((dager) => dager.filter((overstyrtDag) => !overstyrtDag.dato.isSame(dagen.dato)));
    };

    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Sykmeldingsperiode fra ${fom} til ${tom}`;

    const headere = [
        '',
        {
            render: <Element>Sykmeldingsperiode</Element>,
            kolonner: 4,
        },
        {
            render: <Element>Gradering</Element>,
            kolonner: 2,
        },
    ];

    const rader =
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => ({
            celler: [
                tomCelle(),
                dato(dag),
                ikon(dag),
                overstyrer && dag.type !== Dagtype.Helg ? (
                    <OverstyrbarDagtype
                        dag={dag}
                        onOverstyr={leggTilOverstyrtDag}
                        onFjernOverstyring={fjernOverstyrtDag}
                    />
                ) : (
                    type(dag)
                ),
                overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(dag.dato)) ? (
                    <Overstyrtikon />
                ) : (
                    kilde(dag)
                ),
                overstyrer && dag.gradering && dag.type !== Dagtype.Helg ? (
                    <OverstyrbarGradering
                        dag={dag}
                        onOverstyr={leggTilOverstyrtDag}
                        onFjernOverstyring={fjernOverstyrtDag}
                    />
                ) : (
                    gradering(dag)
                ),
                kilde(dag),
            ],
            className: dag.type === Dagtype.Helg ? 'disabled' : undefined,
        })) ?? [];

    return (
        <Container>
            <ErrorBoundary>
                {overstyrbareTabellerEnabled && (
                    <Overstyringsknapp
                        overstyrer={overstyrer}
                        toggleOverstyring={() => setOverstyrer((prev) => !prev)}
                    />
                )}
                <OverstyrbarTabell
                    overstyrer={overstyrer}
                    beskrivelse={tabellbeskrivelse}
                    headere={headere}
                    rader={rader}
                />
                {overstyrer && (
                    <Overstyringsskjema
                        overstyrteDager={overstyrteDager}
                        avbrytOverstyring={() => setOverstyrer(false)}
                    />
                )}
            </ErrorBoundary>
            {!overstyrer && <Navigasjonsknapper />}
        </Container>
    );
};
