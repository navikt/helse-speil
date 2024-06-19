import React, { ReactElement, ReactNode, useRef } from 'react';
import { Control, FieldValues, FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';

import { Button, Heading, Loader, Modal, Textarea } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { LeggTilNotatDocument, NotatType, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useNotaterForVedtaksperiode } from '@state/notater';
import { getFormatertNavn } from '@utils/string';

import { SisteNotat } from './SisteNotat';

import styles from './PåVentModal.module.scss';

type Notattekster = {
    tittel: string;
    description: string;
    submitTekst: string;
    errorTekst?: string;
};

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

type NyttNotatModalProps = {
    setShowModal: (visModal: boolean) => void;
    showModal: boolean;
    navn: Personnavn;
    vedtaksperiodeId: string;
    onSubmitOverride?: (notattekst: string, frist?: string, begrunnelse?: string) => Promise<unknown>;
    errorOverride?: string | undefined;
    notattype: NotatType;
    ekstraInnhold?: ReactNode;
    submitButtonText?: string;
};

export const NyttNotatModal = ({
    setShowModal,
    showModal,
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
    const form = useForm();
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const [nyttNotat, { loading, error }] = useMutation(LeggTilNotatDocument);
    const ref = useRef<HTMLDialogElement>(null);

    const notattekst = notattypeTekster(notattype);

    const sisteNotat = [...notaterForOppgave]
        .filter((it) => !it.feilregistrert && it.type === notattype)
        .sort((a, b) => b.opprettet.diff(a.opprettet, 'millisecond'))
        .shift();

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
            ref.current?.close();
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
        <Modal
            ref={ref}
            aria-label="Legg på vent nytt notat modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={() => setShowModal(false)}
        >
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    {notattekst.tittel}
                </Heading>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
            </Modal.Header>
            <Modal.Body>
                {sisteNotat && <SisteNotat notat={sisteNotat} />}
                {ekstraInnhold}
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)} id="nytt-på-vent-notat-form">
                        <ControlledTextarea
                            control={form.control}
                            notattekst={notattekst}
                            tillattTekstlengde={tillattTekstlengde}
                        />
                    </form>
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button size="small" disabled={loading} form="nytt-på-vent-notat-form">
                    {submitButtonText ?? (onSubmitOverride ? notattekst.submitTekst : 'Lagre')}
                    {loading && <Loader size="xsmall" />}
                </Button>
                <Button size="small" variant="secondary" onClick={() => ref.current?.close()} type="button">
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.errormessage}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
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
        <Textarea
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
