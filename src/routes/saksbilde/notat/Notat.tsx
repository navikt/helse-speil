import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage, HStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { LeggTilNotatDocument, Maybe, NotatType, PersonFragment } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useFjernNotat, useNotater } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { apolloErrorCode } from '@utils/error';
import { isGhostPeriode, isTilkommenInntekt } from '@utils/typeguards';

import { ControlledTextarea } from './ControlledTextarea';

import styles from './Notat.module.css';

interface NotatProps {
    person: PersonFragment;
}

export const Notat = ({ person }: NotatProps): Maybe<ReactElement> => {
    const notater = useNotater();
    const fjernNotat = useFjernNotat();
    const aktivPeriode = useActivePeriod(person);
    const [open, setOpen] = useState(false);
    const form = useForm();
    const [nyttNotat, { loading, error }] = useMutation(LeggTilNotatDocument);
    const { oid } = useInnloggetSaksbehandler();

    const erGhostTilkommenEllerHarIkkeAktivPeriode =
        isGhostPeriode(aktivPeriode) || isTilkommenInntekt(aktivPeriode) || !aktivPeriode;
    const harPåbegyntNotat =
        !erGhostTilkommenEllerHarIkkeAktivPeriode &&
        notater.find(
            (notat) => notat.type === NotatType.Generelt && notat.vedtaksperiodeId === aktivPeriode.vedtaksperiodeId,
        )?.tekst !== undefined;
    useEffect(() => {
        setOpen(harPåbegyntNotat);
    }, [harPåbegyntNotat]);

    useKeyboard([
        {
            key: Key.N,
            action: () => {
                setOpen(true);
                form.setFocus(`${NotatType.Generelt}-tekst`);
            },
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    if (erGhostTilkommenEllerHarIkkeAktivPeriode) return null;

    const submit: SubmitHandler<FieldValues> = (data) => {
        void nyttNotat({
            variables: {
                oid: oid,
                tekst: data.tekst || '',
                type: NotatType.Generelt,
                vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
            },
            update: (cache, { data }) => {
                cache.writeQuery({
                    query: LeggTilNotatDocument,
                    variables: {
                        oid: oid,
                        tekst: data?.leggTilNotat?.tekst || '',
                        type: NotatType.Generelt,
                        vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
                    },
                    data: data,
                });
                cache.modify({
                    id: cache.identify({
                        __typename: aktivPeriode?.__typename,
                        behandlingId: aktivPeriode?.behandlingId,
                    }),
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
            onCompleted: () => {
                lukkNotatfelt();
            },
        });
    };

    const lukkNotatfelt = () => {
        setOpen(false);
        fjernNotat(aktivPeriode.vedtaksperiodeId, NotatType.Generelt);
    };

    return (
        <li className={styles.notat}>
            <div onClick={() => setOpen(!open)} className={classNames(styles.apneNotat, open && styles.apen)}>
                {open ? (
                    <MinusCircleIcon title="nytt-notat" fontSize="1.5rem" />
                ) : (
                    <PlusCircleFillIcon title="nytt-notat" fontSize="1.5rem" />
                )}
                <BodyShort className={styles.tekst}>Skriv nytt notat</BodyShort>
            </div>

            {open && (
                <>
                    <BodyShort>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</BodyShort>
                    <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                        <ControlledTextarea control={form.control} vedtaksperiodeId={aktivPeriode.vedtaksperiodeId} />
                        <HStack gap="2" align="center" marginBlock="4 0">
                            <Button size="small" variant="secondary" type="submit" loading={loading}>
                                Lagre notat
                            </Button>
                            <Button size="small" variant="tertiary" type="button" onClick={lukkNotatfelt}>
                                Avbryt
                            </Button>
                        </HStack>
                    </form>
                </>
            )}
            {error && (
                <ErrorMessage>
                    {apolloErrorCode(error) === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres'}
                </ErrorMessage>
            )}
        </li>
    );
};
