import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { FieldValues, FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';

import { BodyShort, Button, Checkbox, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arsak } from '@external/sanity';
import { Maybe, PaVentArsakInput, Personnavn, Tildeling } from '@io/graphql';
import { PåVentÅrsakerOgBegrunnelse } from '@oversikt/table/cells/notat/PåVentÅrsakerOgBegrunnelse';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useLeggPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { apolloErrorCode } from '@utils/error';
import { getFormatertNavn } from '@utils/string';

import { Frist } from './Frist';

import styles from './PåVentModal.module.scss';

interface PåVentNotatModalProps {
    onClose: () => void;
    showModal: boolean;
    navn: Personnavn;
    oppgaveId: string;
    tildeling: Maybe<Tildeling>;
    periodeId?: string;
}

export const PåVentNotatModal = ({
    onClose,
    showModal,
    navn,
    oppgaveId,
    tildeling,
    periodeId,
}: PåVentNotatModalProps): ReactElement => {
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const [leggPåVent, { loading, error: leggPåVentError }] = useLeggPåVent(periodeId);
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const router = useRouter();
    const saksbehandler = useInnloggetSaksbehandler();
    const form = useForm();
    const erTildelingAvhuket = useWatch({ name: 'tildeling', control: form.control });

    const { onChange, ...tildelingValidation } = form.register('tildeling');
    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        void onChange(event);
    };
    const arsaker: Arsak[] = ((form.watch('arsaker') as string[]) || [])?.map((arsak: string) => JSON.parse(arsak));

    const harMinstÉnÅrsak = () => arsaker?.length > 0;

    const erTildeltSaksbehandler = tildeling && tildeling.oid === saksbehandler.oid;

    const submit: SubmitHandler<FieldValues> = async (fieldValues) => {
        if (!harMinstÉnÅrsak()) {
            form.setError('arsaker', {
                type: 'manual',
                message: 'Velg minst én årsak',
            });
            return;
        }
        await settPåVent(
            fieldValues.tekst ?? null,
            fieldValues.frist,
            fieldValues.tildeling,
            fieldValues.arsaker ? fieldValues.arsaker.map((a: string) => JSON.parse(a)) : [],
        );
        onClose();
    };
    const settPåVent = async (
        notattekst: Maybe<string>,
        frist: string,
        tildeling: boolean,
        arsaker: PaVentArsakInput[],
    ) => {
        const fristVerdi = dayjs(frist, NORSK_DATOFORMAT).format(ISO_DATOFORMAT);
        await leggPåVent(oppgaveId, fristVerdi, tildeling, notattekst, arsaker);
        if (leggPåVentError) {
            errorHandler(leggPåVentError);
        } else {
            router.push('/');
        }
    };

    const errorMessage: string | undefined =
        leggPåVentError !== undefined
            ? apolloErrorCode(leggPåVentError) === 401
                ? 'Du har blitt logget ut'
                : 'Notatet kunne ikke lagres'
            : undefined;

    return (
        <Modal aria-label="Legg på vent modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    Legg på vent
                </Heading>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)} id="på-vent-notat-form">
                        <PåVentÅrsakerOgBegrunnelse />
                        <Frist />
                        <Checkbox
                            defaultChecked
                            onChange={onCheck}
                            {...tildelingValidation}
                            className={styles.tildeling}
                        >
                            {erTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                        </Checkbox>
                    </form>
                    {!erTildelingAvhuket && <BodyShort>Uten tildeling vil saken kunne bli automatisert</BodyShort>}
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="på-vent-notat-form" loading={loading}>
                    Legg på vent
                </Button>
                <Button variant="tertiary" type="button" onClick={onClose}>
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.errormessage}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
