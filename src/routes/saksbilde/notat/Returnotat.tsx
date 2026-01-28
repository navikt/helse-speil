import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { BodyShort, ErrorMessage, VStack } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { NotatSkjema } from '@saksbilde/notat/NotatSkjema';
import { useActivePeriod } from '@state/periode';
import { isGhostPeriode } from '@utils/typeguards';

interface ReturnotatProps {
    onSubmit: (returtekst: string) => Promise<unknown>;
    setShowNotat: Dispatch<SetStateAction<boolean>>;
    error?: string | undefined;
    person: PersonFragment;
    loading: boolean;
}

export const Returnotat = ({
    onSubmit,
    setShowNotat,
    error,
    person,
    loading,
}: ReturnotatProps): ReactElement | null => {
    const aktivPeriode = useActivePeriod(person);

    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;

    if (erGhostEllerHarIkkeAktivPeriode) return null;

    const submit: SubmitHandler<FieldValues> = (data) => {
        void onSubmit(data.tekst);
    };

    return (
        <VStack as="li" paddingBlock="space-0 space-16">
            <VStack paddingBlock="space-0 space-8">
                <BodyShort weight="semibold">Returner sak til saksbehandler</BodyShort>
                <BodyShort>
                    Forklar hvorfor oppgaven sendes tilbake på en enkel måte, slik at det er lett å forstå hva som må
                    vurderes og gjøres annerledes.
                    <br />
                    (Blir ikke forevist den sykmeldte, med mindre hen ber om innsyn)
                </BodyShort>
            </VStack>
            <NotatSkjema
                submit={submit}
                vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                skjulNotatFelt={() => setShowNotat(false)}
                loading={loading}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </VStack>
    );
};
