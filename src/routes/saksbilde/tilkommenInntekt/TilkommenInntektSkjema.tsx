import React, { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, HStack } from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeggTilTilkommenInntektDocument, PersonFragment, TilkommenInntektskilde } from '@io/graphql';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemaTabell';
import { TilkommenInntektSkjemafelter } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemafelter';
import {
    beregnInntektPerDag,
    lagEksisterendePerioder,
    utledSykefraværstilfeller,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useSetActiveTilkommenInntektId } from '@state/periode';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { DateString } from '@typer/shared';
import { erGyldigDato } from '@utils/date';

interface TilkommenInntektProps {
    person: PersonFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
}

export const TilkommenInntektSkjema = ({ person, tilkommeneInntektskilder }: TilkommenInntektProps): ReactElement => {
    const [ekskluderteUkedager, setEkskluderteUkedager] = React.useState<DateString[]>([]);
    const [leggTilTilkommenInntekt] = useMutation(LeggTilTilkommenInntektDocument);
    const { refetch } = useHentTilkommenInntektQuery(person.fodselsnummer);

    const [organisasjonsnavn, setOrganisasjonsnavn] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

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
    const periodebeløp = form.watch('periodebeløp');
    const fom = form.watch('fom');
    const tom = form.watch('tom');
    const inntektPerDag = beregnInntektPerDag(periodebeløp, fom, tom, ekskluderteUkedager);

    const organisasjonsnummer = form.watch('organisasjonsnummer');
    const { data: orgData } = useOrganisasjonQuery(organisasjonsnummer);
    useEffect(() => {
        setOrganisasjonsnavn(orgData?.organisasjon?.navn ?? undefined);
    }, [orgData]);

    const setActiveTilkommenInntektId = useSetActiveTilkommenInntektId();

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setLoading(true);
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
                    ekskluderteUkedager: ekskluderteUkedager,
                },
            },
            onCompleted: (data) => {
                refetch().then(() => {
                    setActiveTilkommenInntektId(data.leggTilTilkommenInntekt.tilkommenInntektId);
                    setLoading(false);
                });
            },
        });
    };
    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <HStack wrap={false}>
                <TilkommenInntektSkjemafelter
                    form={form}
                    handleSubmit={handleSubmit}
                    inntektPerDag={inntektPerDag}
                    organisasjonsnavn={organisasjonsnavn}
                    loading={loading}
                />
                {erGyldigDato(fom) && erGyldigDato(tom) && (
                    <TilkommenInntektSkjemaTabell
                        arbeidsgivere={person.arbeidsgivere}
                        fom={fom}
                        tom={tom}
                        setEkskluderteUkedager={setEkskluderteUkedager}
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
