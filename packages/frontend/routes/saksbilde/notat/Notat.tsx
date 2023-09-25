import classNames from 'classnames';
import React, { useState } from 'react';
import { Control, useController, useForm } from 'react-hook-form';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { MinusCircle } from '@navikt/ds-icons';
import { BodyShort, Button, ErrorMessage, Loader, Textarea } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { LeggTilNotatDocument, NotatType } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { useRefetchPerson } from '@state/person';
import { isGhostPeriode } from '@utils/typeguards';

import styles from './Notat.module.css';

interface ControlledTextareaProps {
    control: Control;
}

const ControlledTextarea = ({ control }: ControlledTextareaProps) => {
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            required: 'Notat må fylles ut',
            maxLength: {
                value: 1000,
                message: `Det er kun tillatt med 1000 tegn`,
            },
        },
    });
    return (
        <Textarea
            {...field}
            {...fieldState}
            error={fieldState.error?.message}
            label="hei"
            hideLabel
            description="Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn."
            maxLength={1000}
            autoFocus
        />
    );
};
export const Notat = () => {
    const [open, setOpen] = useState(false);
    const form = useForm();
    const [nyttNotat, { loading }] = useMutation(LeggTilNotatDocument);
    const [error, setError] = useState<string | undefined>();
    const { oid } = useInnloggetSaksbehandler();
    const aktivPeriode = useActivePeriod();
    const refetchPerson = useRefetchPerson();

    if (isGhostPeriode(aktivPeriode) || !aktivPeriode) return null;

    const submit = () => {
        setError(undefined);
        nyttNotat({
            variables: {
                oid: oid,
                tekst: form.getValues().tekst,
                type: NotatType.Generelt,
                vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
            },
            update: (cache, { data }) => {
                cache.modify({
                    id: cache.identify({ __typename: 'Notater', id: aktivPeriode.vedtaksperiodeId }),
                    fields: {
                        notater(existingNotater) {
                            return [...existingNotater, data];
                        },
                    },
                });
            },
        })
            .then(() => {
                void refetchPerson(); // Refresher for saksbildet, for GraphQL
                setOpen(false);
                form.resetField('tekst');
            })
            .catch((err) => {
                setError(err.statusCode === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres');
            });
    };

    return (
        <li className={styles.notat}>
            <BodyShort onClick={() => setOpen(!open)} className={classNames(styles.apneNotat, open && styles.apen)}>
                {open ? (
                    <MinusCircle title="nytt-notat" fontSize="1.5rem" />
                ) : (
                    <PlusCircleFillIcon title="nytt-notat" fontSize="1.5rem" />
                )}
                <BodyShort className={styles.tekst}>Skriv nytt notat</BodyShort>
            </BodyShort>

            {open && (
                <div>
                    <BodyShort>Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.</BodyShort>
                    <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                        <ControlledTextarea control={form.control} />
                        <span className={styles.buttons}>
                            <Button size="small" variant="secondary" disabled={loading} type="submit">
                                Lagre notat
                                {loading && <Loader size="xsmall" />}
                            </Button>
                            <Button size="small" variant="tertiary" onClick={() => setOpen(false)} type="button">
                                Avbryt
                            </Button>
                        </span>
                    </form>
                </div>
            )}
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </li>
    );
};
