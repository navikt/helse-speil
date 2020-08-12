import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Tabell } from '@navikt/helse-frontend-tabell';
import {
    dato,
    gradering,
    ikon,
    kilde,
    overstyrbarGradering,
    overstyrbarKilde,
    overstyrbarType,
    tomCelle,
    type,
} from '../../components/tabell/rader';
import { PersonContext } from '../../context/PersonContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NORSK_DATOFORMAT } from '../../utils/date';
import '@navikt/helse-frontend-tabell/lib/main.css';
import Element from 'nav-frontend-typografi/lib/element';
import { Dagtype, Sykdomsdag } from '../../context/types.internal';
import { overstyrbareTabellerEnabled } from '../../featureToggles';
import { Overstyringsknapp } from '../../components/tabell/Overstyringsknapp';
import { Overstyringsskjema } from '../../components/tabell/Overstyringsskjema';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

interface OverstyrbarTabellProps {
    overstyrer: boolean;
}

const OverstyrbarTabell = styled(Tabell)`
    thead tr {
        vertical-align: bottom;
    }

    ${({ overstyrer }: OverstyrbarTabellProps) =>
        overstyrer &&
        `
        tbody tr td {
            height: 48px;
        }
    `}
`;

const HøyrestiltContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const [overstyrer, setOverstyrer] = useState(false);
    const [overstyrteDager, setOverstyrteDager] = useState<Sykdomsdag[]>([]);

    const avbrytOverstyring = () => {
        setOverstyrer(false);
        setOverstyrteDager([]);
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
            kolonner: 3,
        },
        {
            render: <Element>Gradering</Element>,
        },
        overstyrbareTabellerEnabled ? (
            <HøyrestiltContainer>
                <Overstyringsknapp
                    overstyrer={overstyrer}
                    toggleOverstyring={() => (overstyrer ? avbrytOverstyring() : setOverstyrer(true))}
                />
            </HøyrestiltContainer>
        ) : (
            ''
        ),
    ];

    const vanligeRader = () =>
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => ({
            celler: [tomCelle(), dato(dag), ikon(dag), type(dag), gradering(dag), kilde(dag)],
            className: dag.type === Dagtype.Helg ? 'disabled' : undefined,
        })) ?? [];

    const overstyrteRader = () =>
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => {
            const overstyrtDag = overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(dag.dato));
            const erOverstyrt = overstyrtDag !== undefined && JSON.stringify(overstyrtDag) !== JSON.stringify(dag);
            const dagen = overstyrtDag ?? dag;
            return {
                celler: [
                    tomCelle(),
                    dato(dagen),
                    ikon(dagen),
                    overstyrbarType(dagen, leggTilOverstyrtDag, fjernOverstyrtDag),
                    overstyrbarGradering(dagen, leggTilOverstyrtDag, fjernOverstyrtDag),
                    overstyrbarKilde(dagen, erOverstyrt),
                ],
                className: dagen.type === Dagtype.Helg ? 'disabled' : undefined,
            };
        }) ?? [];

    const rader = overstyrer ? overstyrteRader() : vanligeRader();

    return (
        <Container>
            <ErrorBoundary>
                <OverstyrbarTabell
                    overstyrer={overstyrer}
                    beskrivelse={tabellbeskrivelse}
                    headere={headere}
                    rader={rader}
                />
                {overstyrer && (
                    <Overstyringsskjema overstyrteDager={overstyrteDager} avbrytOverstyring={avbrytOverstyring} />
                )}
            </ErrorBoundary>
            {!overstyrer && <Navigasjonsknapper />}
        </Container>
    );
};
