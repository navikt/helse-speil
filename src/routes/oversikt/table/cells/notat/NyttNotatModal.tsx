import styles from './NyttNotatModal.module.scss';
import React, { ReactElement, ReactNode } from 'react';
import { Control, FieldValues, FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';

import { Button, Loader, Textarea as NavTextarea } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { GammelModal } from '@components/Modal';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { LeggTilNotatDocument, NotatType, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useNotaterForVedtaksperiode } from '@state/notater';
import { getFormatertNavn } from '@utils/string';

import { SisteNotat } from './SisteNotat';

interface Notattekster {
    tittel: string;
    description: string;
    submitTekst: string;
    errorTekst?: string;
}

const notattypeTekster = (notattype: NotatType): Notattekster => {
    switch (notattype) {
        case 'Retur':
            return {
                tittel: 'Retur',
                description:
                    'Skriv hvorfor saken returneres, så det er enkelt å forstå hva som må vurderes og gjøres om.\nEksempel: Ferie for 01.07.2022 må korrigeres.\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.',
                submitTekst: 'Returner',
                errorTekst: 'Du må skrive et returnotat hvis du vil sende oppgaven i retur til saksbehandler.',
            };
        default:
            return {
                tittel: 'Notat',
                description: 'Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.',
                submitTekst: 'Legg til notat',
            };
    }
};

interface NyttNotatModalProps {
    onClose: (event: React.SyntheticEvent) => void;
    navn: Personnavn;
    vedtaksperiodeId: string;
    onSubmitOverride?: (notattekst: string, frist?: string, begrunnelse?: string) => Promise<unknown>;
    errorOverride?: string | undefined;
    notattype: NotatType;
    ekstraInnhold?: ReactNode;
    submitButtonText?: string;
}

export const NyttNotatModal = ({
    onClose,
    navn,
    vedtaksperiodeId,
    onSubmitOverride,
    errorOverride,
    notattype,
    ekstraInnhold,
    submitButtonText,
}: NyttNotatModalProps): ReactElement => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const { oid } = useInnloggetSaksbehandler();
    const [nyttNotat, { loading, error }] = useMutation(LeggTilNotatDocument);
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;

    const form = useForm();

    const notattekst = notattypeTekster(notattype);

    const sisteNotat = [...notaterForOppgave]
        .filter((it) => !it.feilregistrert && it.type === notattype)
        .sort((a, b) => b.opprettet.diff(a.opprettet, 'millisecond'))
        .shift();

    const closeModal = (event: React.SyntheticEvent) => {
        onClose(event);
    };

    const submit: SubmitHandler<FieldValues> = async (fieldValues) => {
        if (onSubmitOverride) {
            void onSubmitOverride(fieldValues.tekst);
        } else {
            await nyttNotat({
                variables: {
                    oid: oid,
                    tekst: fieldValues.tekst,
                    type: notattype,
                    vedtaksperiodeId: vedtaksperiodeId,
                },
                update: (cache, { data }) => {
                    cache.writeQuery({
                        query: LeggTilNotatDocument,
                        variables: {
                            oid: oid,
                            tekst: data?.leggTilNotat?.tekst || '',
                            type: NotatType.Generelt,
                            vedtaksperiodeId: data?.leggTilNotat?.vedtaksperiodeId ?? '',
                        },
                        data: data,
                    });
                    cache.modify({
                        id: cache.identify({ __typename: 'Notater', id: vedtaksperiodeId }),
                        fields: {
                            notater(existingNotater) {
                                return [
                                    ...existingNotater,
                                    { __ref: cache.identify({ __typename: 'Notat', id: data?.leggTilNotat?.id }) },
                                ];
                            },
                        },
                    });
                },
            });
            onClose({} as React.SyntheticEvent);
        }
    };

    const tillattTekstlengde = 1_000;
    const errorMessage: string | undefined =
        errorOverride ?? error
            ? apolloErrorCode(error) === 401
                ? 'Du har blitt logget ut'
                : 'Notatet kunne ikke lagres'
            : undefined;

    return (
        <GammelModal
            title={<h1 className={styles.tittel}>{notattekst.tittel}</h1>}
            contentLabel={notattekst.tittel}
            isOpen
            onRequestClose={closeModal}
        >
            <section className={styles.container}>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
                {sisteNotat && <SisteNotat notat={sisteNotat} />}
                {ekstraInnhold}
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <ControlledTextarea
                            control={form.control}
                            notattekst={notattekst}
                            tillattTekstlengde={tillattTekstlengde}
                        />
                        <span className={styles.buttons}>
                            <Button size="small" disabled={loading} type="submit">
                                {submitButtonText ?? (onSubmitOverride ? notattekst.submitTekst : 'Lagre')}
                                {loading && <Loader size="xsmall" />}
                            </Button>
                            <Button size="small" variant="secondary" onClick={closeModal} type="button">
                                Avbryt
                            </Button>
                        </span>
                    </form>
                </FormProvider>
            </section>
            {errorMessage && <ErrorMessage className={styles.errormessage}>{errorMessage}</ErrorMessage>}
        </GammelModal>
    );
};

interface ControlledTextareaProps {
    control: Control;
    notattekst: Notattekster;
    tillattTekstlengde: number;
}

const ControlledTextarea = ({ control, notattekst, tillattTekstlengde }: ControlledTextareaProps): ReactElement => {
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            required: notattekst.errorTekst ?? 'Notat må fylles ut',
            maxLength: {
                value: tillattTekstlengde,
                message: `Det er kun tillatt med ${tillattTekstlengde} tegn`,
            },
        },
    });
    return (
        <NavTextarea
            {...field}
            className={styles.textarea}
            error={fieldState.error?.message}
            label={notattekst.tittel}
            hideLabel
            description={notattekst.description}
            maxLength={tillattTekstlengde}
            autoFocus
        />
    );
};

const apolloErrorCode = (error: ApolloError | undefined): number =>
    (
        error?.graphQLErrors[0].extensions['code'] as {
            value: number;
        }
    ).value;
