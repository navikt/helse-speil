import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { MinusCircle } from '@navikt/ds-icons';
import { BodyShort, Button, ErrorMessage, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { LeggTilNotatDocument, NotatType } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { lokaleNotaterState } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { isGhostPeriode } from '@utils/typeguards';

import { ControlledTextarea } from './ControlledTextarea';

import styles from './Notat.module.css';

export const Notat = () => {
    const notater = useRecoilValue(lokaleNotaterState);
    const oppdaterNotat = useSetRecoilState(lokaleNotaterState);
    const aktivPeriode = useActivePeriod();
    const [open, setOpen] = useState(false);
    const form = useForm();
    const [nyttNotat, { loading, error }] = useMutation(LeggTilNotatDocument);
    const { oid } = useInnloggetSaksbehandler();

    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;
    const harPåbegyntNotat =
        !erGhostEllerHarIkkeAktivPeriode &&
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

    if (erGhostEllerHarIkkeAktivPeriode) return null;

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
                    id: cache.identify({ __typename: aktivPeriode?.__typename, id: aktivPeriode?.id }),
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
        oppdaterNotat((currentValue) => [
            ...currentValue.filter(
                (notat) =>
                    notat.type !== NotatType.Generelt || notat.vedtaksperiodeId !== aktivPeriode.vedtaksperiodeId,
            ),
        ]);
    };

    return (
        <li className={styles.notat}>
            <div onClick={() => setOpen(!open)} className={classNames(styles.apneNotat, open && styles.apen)}>
                {open ? (
                    <MinusCircle title="nytt-notat" fontSize="1.5rem" />
                ) : (
                    <PlusCircleFillIcon title="nytt-notat" fontSize="1.5rem" />
                )}
                <BodyShort className={styles.tekst}>Skriv nytt notat</BodyShort>
            </div>

            {open && (
                <>
                    <BodyShort>Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.</BodyShort>
                    <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                        <ControlledTextarea control={form.control} vedtaksperiodeId={aktivPeriode.vedtaksperiodeId} />
                        <span className={styles.buttons}>
                            <Button size="small" variant="secondary" disabled={loading} type="submit">
                                Lagre notat
                                {loading && <Loader size="xsmall" />}
                            </Button>
                            <Button size="small" variant="tertiary" onClick={lukkNotatfelt} type="button">
                                Avbryt
                            </Button>
                        </span>
                    </form>
                </>
            )}
            {error && (
                <ErrorMessage>
                    {(error.graphQLErrors[0].extensions['code'] as { value: number }).value === 401
                        ? 'Du har blitt logget ut'
                        : 'Notatet kunne ikke lagres'}
                </ErrorMessage>
            )}
        </li>
    );
};
