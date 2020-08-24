import React, { useContext, useState } from 'react';
import { Overstyringsskjema } from '../../../components/tabell/Overstyringsskjema';
import {
    dato,
    ikon,
    overstyrbarGradering,
    overstyrbarKilde,
    overstyrbarType,
    tomCelle,
} from '../../../components/tabell/rader';
import { Dagtype, Sykdomsdag } from '../../../context/types.internal';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import Element from 'nav-frontend-typografi/lib/element';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import styled from '@emotion/styled';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { overstyrbareTabellerEnabled } from '../../../featureToggles';
import { FormProvider, useForm } from 'react-hook-form';
import { getOppgavereferanse, postOverstyring } from '../../../io/http';
import { useFjernEnToast, useLeggTilEnToast } from '../../../state/toastsState';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from './KalkulererOverstyringToast';

const OverstyrbarTabell = styled(Tabell)`
    thead,
    thead tr,
    thead tr th {
        vertical-align: bottom;
    }
    tbody tr td {
        height: 48px;
    }
`;

const HøyrestiltContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Feilmelding = styled.p`
    color: #ba3a26;
    margin: 1rem 0 0;
    font-weight: 600;
`;

const tilOverstyrtDagtype = (type: Dagtype): 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | Dagtype => {
    switch (type) {
        case Dagtype.Syk:
            return 'Sykedag';
        case Dagtype.Ferie:
            return 'Feriedag';
        case Dagtype.Egenmelding:
            return 'Egenmeldingsdag';
        default:
            return type;
    }
};

const tilOverstyrteDager = (dager: Sykdomsdag[]) =>
    dager.map((dag) => ({
        dato: dag.dato.format('YYYY-MM-DD'),
        type: tilOverstyrtDagtype(dag.type),
        grad: dag.gradering,
    }));

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

interface OverstyrbarSykmeldingsperiodetabellProps {
    onOverstyr: () => void;
    onToggleOverstyring: () => void;
}

export const OverstyrbarSykmeldingsperiodetabell = ({
    onOverstyr,
    onToggleOverstyring,
}: OverstyrbarSykmeldingsperiodetabellProps) => {
    const { aktivVedtaksperiode, personTilBehandling, hentPerson } = useContext(PersonContext);
    const [overstyrteDager, setOverstyrteDager] = useState<Sykdomsdag[]>([]);
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const leggtilEnToast = useLeggTilEnToast();
    const fjernToast = useFjernEnToast();
    const [overstyringserror, setOverstyringserror] = useState<string>();

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
    const tabellbeskrivelse = `Overstyrer sykmeldingsperiode fra ${fom} til ${tom}`;

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
                <Overstyringsknapp overstyrer toggleOverstyring={onToggleOverstyring} />
            </HøyrestiltContainer>
        ) : (
            ''
        ),
    ];

    const rader =
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

    const organisasjonsnummer = () =>
        personTilBehandling!.arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.vedtaksperioder.find((vedtaksperiode) => vedtaksperiode.id === aktivVedtaksperiode?.id)
        )!.organisasjonsnummer;

    const pollEtterNyOppgave = async () => {
        const fødselsnummer = personTilBehandling!.fødselsnummer;
        for (let _ = 0; _ < 10; _++) {
            await delay(1000);
            const oppgavereferanse = await getOppgavereferanse(fødselsnummer)
                .then((response) => response.data.oppgavereferanse)
                .catch((error) => {
                    if (error.statusCode >= 500) {
                        console.error(error);
                    }
                });

            if (oppgavereferanse && oppgavereferanse !== aktivVedtaksperiode!.oppgavereferanse) {
                hentPerson(fødselsnummer).then();
                break;
            }
        }
    };

    const sendOverstyring = () => {
        const { begrunnelse, unntaFraInnsyn } = form.getValues();

        const overstyring = {
            aktørId: personTilBehandling!.aktørId,
            fødselsnummer: personTilBehandling!.fødselsnummer,
            organisasjonsnummer: organisasjonsnummer(),
            dager: tilOverstyrteDager(overstyrteDager),
            begrunnelse,
            unntaFraInnsyn,
        };

        postOverstyring(overstyring)
            .then(() => {
                leggtilEnToast(kalkulererToast({}));
                onOverstyr();
                pollEtterNyOppgave().then(() => {
                    leggtilEnToast(
                        kalkuleringFerdigToast({
                            timeToLiveMs: 5000,
                            callback: () => fjernToast(kalkulererFerdigToastKey),
                        })
                    );
                });
            })
            .catch(() => {
                setOverstyringserror('Feil under sending av overstyring. Prøv igjen senere.');
            });
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(sendOverstyring)}>
                <OverstyrbarTabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />
                <Overstyringsskjema overstyrteDager={overstyrteDager} avbrytOverstyring={onToggleOverstyring} />
                {overstyringserror && <Feilmelding role="alert">{overstyringserror}</Feilmelding>}
            </form>
        </FormProvider>
    );
};
