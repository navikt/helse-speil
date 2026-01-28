import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { BodyShort, Button, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotatType, PersonFragment } from '@io/graphql';
import { Notattekstfelt } from '@saksbilde/notat/Notattekstfelt';
import { useNotatkladd } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { isGhostPeriode } from '@utils/typeguards';

interface ReturnotatProps {
    onSubmit: (returtekst: string) => Promise<unknown>;
    setShowNotat: Dispatch<SetStateAction<boolean>>;
    error?: string | undefined;
    person: PersonFragment;
}

export const Returnotat = ({ onSubmit, setShowNotat, error, person }: ReturnotatProps): ReactElement | null => {
    const aktivPeriode = useActivePeriod(person);

    const notatkladd = useNotatkladd();

    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;

    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(
        !erGhostEllerHarIkkeAktivPeriode ? aktivPeriode.vedtaksperiodeId : undefined,
    );

    const form = useForm<NotatFormFields>({
        resolver: zodResolver(notatSkjema),
        defaultValues: {
            tekst: lagretNotat,
        },
    });

    if (erGhostEllerHarIkkeAktivPeriode) return null;

    const submit: SubmitHandler<FieldValues> = (data) => {
        void onSubmit(data.tekst);
    };

    const lukkNotatfelt = () => {
        notatkladd.fjernNotat(aktivPeriode.vedtaksperiodeId, NotatType.Retur);
        setShowNotat(false);
    };

    return (
        <VStack as="li" paddingBlock="0 space-16">
            <VStack paddingBlock="0 space-8">
                <BodyShort weight="semibold">Returner sak til saksbehandler</BodyShort>
                <BodyShort>
                    Forklar hvorfor oppgaven sendes tilbake på en enkel måte, slik at det er lett å forstå hva som må
                    vurderes og gjøres annerledes.
                    <br />
                    (Blir ikke forevist den sykmeldte, med mindre hen ber om innsyn)
                </BodyShort>
            </VStack>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(submit)} style={{ width: '100%' }}>
                    <Notattekstfelt
                        control={form.control}
                        vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                        notatType={NotatType.Retur}
                    />
                    <HStack gap="space-8" align="center" marginBlock="space-16 space-0">
                        <Button size="small" variant="secondary" type="submit">
                            Lagre notat og returner
                        </Button>
                        <Button size="small" variant="tertiary" onClick={lukkNotatfelt} type="button">
                            Avbryt
                        </Button>
                    </HStack>
                </form>
            </FormProvider>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </VStack>
    );
};
