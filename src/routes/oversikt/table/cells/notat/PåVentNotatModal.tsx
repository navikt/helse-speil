import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Control, FieldValues, FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';

import { Button, Checkbox, Heading, Loader, Textarea } from '@navikt/ds-react';

import { ApolloError } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { NotatType, Personnavn, Tildeling } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useNotaterForVedtaksperiode } from '@state/notater';
import { useLeggPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

import { Frist } from './Frist';
import { SisteNotat } from './SisteNotat';

import styles from './PåVentNotatModal.module.css';

interface PåVentNotatModalProps {
    onClose: (event: React.SyntheticEvent) => void;
    navn: Personnavn;
    vedtaksperiodeId: string;
    oppgaveId: string;
    tildeling: Maybe<Tildeling>;
}

export const PåVentNotatModal = ({ onClose, navn, vedtaksperiodeId, oppgaveId, tildeling }: PåVentNotatModalProps) => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const [leggPåVentMedNotat, { loading, error: leggPåVentError }] = useLeggPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const router = useRouter();
    const saksbehandler = useInnloggetSaksbehandler();
    const form = useForm();

    const { onChange, ...tildelingValidation } = form.register('tildeling');

    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
    };

    const erTildeltSaksbehandler = tildeling && tildeling.oid === saksbehandler.oid;

    const sisteNotat = [...notaterForOppgave]
        .filter((it) => !it.feilregistrert && it.type === NotatType.PaaVent)
        .sort((a, b) => b.opprettet.diff(a.opprettet, 'millisecond'))
        .shift();

    const closeModal = (event: React.SyntheticEvent) => {
        onClose(event);
    };

    const submit: SubmitHandler<FieldValues> = async (fieldValues) => {
        settPåVent(fieldValues.tekst, fieldValues.frist, fieldValues.tildeling, fieldValues.begrunnelse);
        onClose({} as React.SyntheticEvent);
    };

    const settPåVent = async (notattekst: string, frist: string, tildeling: boolean, begrunnelse?: Maybe<string>) => {
        const fristVerdi = dayjs(frist, NORSK_DATOFORMAT).format(ISO_DATOFORMAT);
        const begrunnelseVerdi = begrunnelse ?? null;

        await leggPåVentMedNotat(oppgaveId, fristVerdi, tildeling, begrunnelseVerdi, notattekst, vedtaksperiodeId);
        if (leggPåVentError) {
            errorHandler(leggPåVentError);
        } else {
            router.push('/');
        }
    };

    const tillattTekstlengde = 1_000;
    const errorMessage: string | undefined =
        leggPåVentError !== undefined
            ? apolloErrorCode(leggPåVentError) === 401
                ? 'Du har blitt logget ut'
                : 'Notatet kunne ikke lagres'
            : undefined;

    return (
        <Modal
            title={
                <Heading level="1" size="medium" className={styles.tittel}>
                    Legg på vent
                </Heading>
            }
            contentLabel="Legg på vent"
            isOpen
            onRequestClose={closeModal}
        >
            <div className={styles.container}>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
                {sisteNotat && <SisteNotat notat={sisteNotat} />}
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <ControlledTextarea control={form.control} tillattTekstlengde={tillattTekstlengde} />
                        <Frist />
                        <Checkbox
                            defaultChecked
                            onChange={onCheck}
                            {...tildelingValidation}
                            className={styles.tildeling}
                        >
                            {erTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                        </Checkbox>
                        <div className={styles.buttons}>
                            <Button size="small" disabled={loading} type="submit">
                                Legg på vent
                                {loading && <Loader size="xsmall" />}
                            </Button>
                            <Button size="small" variant="secondary" onClick={closeModal} type="button">
                                Avbryt
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
            {errorMessage && <ErrorMessage className={styles.error}>{errorMessage}</ErrorMessage>}
        </Modal>
    );
};

interface ControlledTextareaProps {
    control: Control;
    tillattTekstlengde: number;
}

const ControlledTextarea = ({ control, tillattTekstlengde }: ControlledTextareaProps) => {
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            required: 'Notat må fylles ut',
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
            label="Legg på vent"
            description={
                'Skriv hvorfor saken er lagt på vent. Det gjør det lettere å starte igjen senere.\n' +
                'Eks: Kontaktet arbeidsgiver, fikk ikke svar. Prøv igjen senere.\n' +
                'Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn.'
            }
            maxLength={tillattTekstlengde}
            autoFocus
        />
    );
};

const apolloErrorCode = (error: ApolloError | undefined) =>
    (
        error?.graphQLErrors[0].extensions['code'] as {
            value: number;
        }
    ).value;
