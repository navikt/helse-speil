import React, { useState } from 'react';
import { Overstyringsskjema } from '../../../components/tabell/Overstyringsskjema';
import {
    dato,
    ikon,
    overstyrbarGradering,
    overstyrbarKilde,
    overstyrbarType,
    tomCelle,
} from '../../../components/tabell/rader';
import { Dagtype, Sykdomsdag } from 'internal-types';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import Element from 'nav-frontend-typografi/lib/element';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import styled from '@emotion/styled';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { overstyrbareTabellerEnabled } from '../../../featureToggles';
import { FormProvider, useForm } from 'react-hook-form';
import { postAbonnerPåAktør, postOverstyring } from '../../../io/http';
import { useAddToast } from '../../../state/toasts';
import { kalkulererToast } from './kalkuleringstoasts';
import { OverstyrtDagDTO } from '../../../io/types';
import { useOverstyrteDager } from './useOverstyrteDager';
import { organisasjonsnummerForPeriode } from '../../../mapping/selectors';
import classNames from 'classnames';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { usePerson } from '../../../state/person';
import { opptegnelsePollingTimeState } from '../../../state/opptegnelser';
import { useSetRecoilState } from 'recoil';

const OverstyrbarTabell = styled(Tabell)`
    thead tr th {
        vertical-align: top;
        box-sizing: border-box;
        padding-top: 0;
        padding-bottom: 10px;
    }

    tbody tr td:not(:first-of-type):not(:nth-of-type(3)):not(:nth-of-type(5)) {
        padding-right: 3rem;
    }

    tbody tr td {
        height: 48px;
    }
`;

const Feilmelding = styled.p`
    color: var(--navds-color-text-error);
    margin: 1rem 0 0;
    font-weight: 600;
`;

const tilOverstyrtDagtype = (type: Dagtype): 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | Dagtype => {
    switch (type) {
        case Dagtype.Syk:
            return 'Sykedag';
        case Dagtype.Ferie:
            return 'Feriedag';
        case Dagtype.Permisjon:
            return 'Permisjonsdag';
        case Dagtype.Egenmelding:
            return 'Egenmeldingsdag';
        default:
            return type;
    }
};

const tilOverstyrteDager = (dager: Sykdomsdag[]): OverstyrtDagDTO[] =>
    dager.map((dag) => ({
        dato: dag.dato.format('YYYY-MM-DD'),
        type: tilOverstyrtDagtype(dag.type),
        grad: dag.gradering,
    }));

interface OverstyrbarSykmeldingsperiodetabellProps {
    onOverstyr: () => void;
    onToggleOverstyring: () => void;
    originaleDager?: Sykdomsdag[];
}

export const OverstyrbarSykmeldingsperiodetabell = ({
    onOverstyr,
    onToggleOverstyring,
    originaleDager,
}: OverstyrbarSykmeldingsperiodetabellProps) => {
    const { overstyrteDager, leggTilOverstyrtDag } = useOverstyrteDager(originaleDager);
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const [overstyringserror, setOverstyringserror] = useState<string>();
    const leggtilEnToast = useAddToast();
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Overstyrer sykmeldingsperiode fra ${fom} til ${tom}`;
    const organisasjonsnummer = organisasjonsnummerForPeriode(aktivVedtaksperiode!, personTilBehandling!);

    const headere = [
        '',
        { render: <Element>Dato</Element>, kolonner: 1 },
        { render: <Element>Dagtype</Element>, kolonner: 2 },
        { render: <Element>Grad</Element> },
        '',
        overstyrbareTabellerEnabled ? <Overstyringsknapp overstyrer toggleOverstyring={onToggleOverstyring} /> : '',
    ];

    const tilTabellrad = (dag: Sykdomsdag) => {
        const overstyrtDag = overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(dag.dato));
        const erOverstyrt = overstyrtDag !== undefined && JSON.stringify(overstyrtDag) !== JSON.stringify(dag);
        const dagen = overstyrtDag ?? dag;
        return {
            celler: [
                tomCelle(),
                dato(dagen),
                ikon(dagen),
                overstyrbarType(dagen, leggTilOverstyrtDag),
                overstyrbarGradering(dagen, leggTilOverstyrtDag),
                overstyrbarKilde(dagen, erOverstyrt),
                tomCelle(),
            ],
            className: classNames({
                disabled: dag.type === Dagtype.Helg,
            }),
        };
    };

    const rader = aktivVedtaksperiode?.sykdomstidslinje.map(tilTabellrad) ?? [];

    const overstyring = () => ({
        aktørId: personTilBehandling!.aktørId,
        fødselsnummer: personTilBehandling!.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        dager: tilOverstyrteDager(overstyrteDager),
        begrunnelse: form.getValues().begrunnelse,
    });

    const sendOverstyring = () => {
        postOverstyring(overstyring())
            .then(() => {
                leggtilEnToast(kalkulererToast({}));
                onOverstyr();
                postAbonnerPåAktør(personTilBehandling!.aktørId).then(() => {
                    setOpptegnelsePollingTime(1000);
                });
            })
            .catch(() => setOverstyringserror('Feil under sending av overstyring. Prøv igjen senere.'));
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(sendOverstyring)}>
                <OverstyrbarTabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />
                <Overstyringsskjema avbrytOverstyring={onToggleOverstyring} overstyrteDager={overstyrteDager} />
                {overstyringserror && <Feilmelding role="alert">{overstyringserror}</Feilmelding>}
            </form>
        </FormProvider>
    );
};
