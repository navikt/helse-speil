import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useRefetchPerson } from '@state/person';
import { isGhostPeriode } from '@utils/typeguards';

import { ControlledTextarea } from './ControlledTextarea';

import styles from './Notat.module.css';

export const Notat = () => {
    const notater = useRecoilValue(lokaleNotaterState);
    const oppdaterNotat = useSetRecoilState(lokaleNotaterState);
    const aktivPeriode = useActivePeriod();
    const [open, setOpen] = useState(false);
    const form = useForm();
    const [nyttNotat, { loading }] = useMutation(LeggTilNotatDocument);
    const [error, setError] = useState<string | undefined>();
    const { oid } = useInnloggetSaksbehandler();
    const refetchPerson = useRefetchPerson();

    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;
    const harPåbegyntNotat =
        !erGhostEllerHarIkkeAktivPeriode &&
        notater.find((notat) => notat.vedtaksperiodeId === aktivPeriode.vedtaksperiodeId)?.tekst !== undefined;
    useEffect(() => {
        setOpen(harPåbegyntNotat);
    }, [harPåbegyntNotat]);

    useKeyboard([
        {
            key: Key.N,
            action: () => {
                setOpen(true);
                form.setFocus('tekst');
            },
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    if (erGhostEllerHarIkkeAktivPeriode) return null;

    const submit = () => {
        setError(undefined);
        nyttNotat({
            variables: {
                oid: oid,
                tekst: notater.find((notat) => notat.vedtaksperiodeId === aktivPeriode.vedtaksperiodeId)?.tekst || '',
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
                slettNotat();
            })
            .catch((err) => {
                setError(err.statusCode === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres');
            });
    };

    const slettNotat = () => {
        oppdaterNotat((currentValue) => [
            ...currentValue.filter((notat) => notat.vedtaksperiodeId !== aktivPeriode.vedtaksperiodeId),
        ]);
        setOpen(false);
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
                <div>
                    <BodyShort>Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.</BodyShort>
                    <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                        <ControlledTextarea control={form.control} vedtaksperiodeId={aktivPeriode.vedtaksperiodeId} />
                        <span className={styles.buttons}>
                            <Button size="small" variant="secondary" disabled={loading} type="submit">
                                Lagre notat
                                {loading && <Loader size="xsmall" />}
                            </Button>
                            <Button size="small" variant="tertiary" onClick={() => slettNotat()} type="button">
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
