import dayjs from 'dayjs';
import React, { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, HStack } from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    GhostPeriodeFragment,
    LeggTilTilkommenInntektDocument,
    PeriodeFragment,
    PersonFragment,
    TilkommenInntektskilde,
} from '@io/graphql';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemaTabell';
import { TilkommenInntektSkjemafelter } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemafelter';
import {
    filtrerDager,
    lagDatoIntervall,
    lagEksisterendePerioder,
    utledSykefraværstilfeller,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT, erGyldigDato } from '@utils/date';

interface TilkommenInntektProps {
    person: PersonFragment;
    periode: PeriodeFragment | GhostPeriodeFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
}

export const TilkommenInntektSkjema = ({
    person,
    periode,
    tilkommeneInntektskilder,
}: TilkommenInntektProps): ReactElement => {
    const [dagerSomSkalEkskluderes, setdagerSomSkalEkskluderes] = React.useState<DateString[]>([]);
    const [leggTilTilkommenInntekt] = useMutation(LeggTilTilkommenInntektDocument);

    const [organisasjonsnavn, setOrganisasjonsnavn] = useState<string | undefined>(undefined);

    const organisasjonEksisterer = () => {
        return organisasjonsnavn !== undefined;
    };

    const sykefraværstilfeller = utledSykefraværstilfeller(person);
    const eksisterendePerioder = lagEksisterendePerioder(tilkommeneInntektskilder);
    const form = useForm<TilkommenInntektSchema>({
        resolver: zodResolver(
            lagTilkommenInntektSchema(sykefraværstilfeller, eksisterendePerioder, organisasjonEksisterer),
        ),
        reValidateMode: 'onBlur',
        defaultValues: {
            organisasjonsnummer: '',
            fom: '',
            tom: '',
            periodebeløp: 0,
            notat: '',
        },
    });
    const defaultFom = dayjs(periode.fom).toDate();
    const defaultTom = dayjs(periode.tom).toDate();

    const fom = form.watch('fom');
    const tom = form.watch('tom');
    const datoIntervall = lagDatoIntervall(fom, tom);

    const organisasjonsnummer = form.watch('organisasjonsnummer');
    const { data: orgData } = useOrganisasjonQuery(organisasjonsnummer);
    useEffect(() => {
        setOrganisasjonsnavn(orgData?.organisasjon?.navn);
    }, [orgData]);

    const dagerTilGradering = filtrerDager(datoIntervall, dagerSomSkalEkskluderes);

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        const dager = dagerTilGradering.map((dag) => dag.format(ISO_DATOFORMAT));
        await leggTilTilkommenInntekt({
            variables: {
                fodselsnummer: person.fodselsnummer,
                notatTilBeslutter: values.notat,
                tilkommenInntekt: {
                    periode: {
                        fom: values.fom,
                        tom: values.tom,
                    },
                    organisasjonsnummer: values.organisasjonsnummer,
                    periodebelop: values.periodebeløp.toString(),
                    dager: dager,
                },
            },
        });
    };
    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <HStack wrap={false}>
                <TilkommenInntektSkjemafelter
                    form={form}
                    handleSubmit={handleSubmit}
                    dagerTilFordeling={dagerTilGradering.length}
                    defaultFom={defaultFom}
                    defaultTom={defaultTom}
                    organisasjonsnavn={organisasjonsnavn}
                />
                {erGyldigDato(fom) && erGyldigDato(tom) && (
                    <TilkommenInntektSkjemaTabell
                        arbeidsgivere={person.arbeidsgivere}
                        fom={fom}
                        tom={tom}
                        setDagerSomSkalEkskluderes={setdagerSomSkalEkskluderes}
                    />
                )}
            </HStack>
        </ErrorBoundary>
    );
};

const TilkommenInntektError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise tilkommen inntekt for denne perioden.
    </Alert>
);
