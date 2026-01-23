import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';
import { Control, FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage, HStack, Textarea } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { LeggTilNotatDocument, NotatType, PersonFragment } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useFjernNotat, useGetNotatTekst, useUpsertNotat } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { apolloErrorCode } from '@utils/error';
import { isGhostPeriode } from '@utils/typeguards';

import styles from './Notat.module.css';

interface NotatProps {
    person: PersonFragment;
}

export const Notat = ({ person }: NotatProps): ReactElement | null => {
    const aktivPeriode = useActivePeriod(person);
    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;

    const fjernNotat = useFjernNotat();
    const lagretNotat = useGetNotatTekst(
        NotatType.Generelt,
        !erGhostEllerHarIkkeAktivPeriode ? aktivPeriode.vedtaksperiodeId : '',
    );

    const [nyttNotat, { loading, error }] = useMutation(LeggTilNotatDocument);
    const { oid } = useInnloggetSaksbehandler();

    const form = useForm<NotatFormFields>({
        resolver: zodResolver(notatSkjema),
        defaultValues: {
            tekst: lagretNotat,
        },
    });

    const [open, setOpen] = useState(lagretNotat != undefined);

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

    const submit: SubmitHandler<NotatFormFields> = (data) => {
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
            <button onClick={() => setOpen(!open)} className={classNames(styles.apneNotat, open && styles.apen)}>
                {open ? (
                    <MinusCircleIcon title="nytt-notat" fontSize="1.5rem" />
                ) : (
                    <PlusCircleFillIcon title="nytt-notat" fontSize="1.5rem" />
                )}
                <BodyShort className={styles.tekst}>Skriv nytt notat</BodyShort>
            </button>

            {open && (
                <>
                    <BodyShort>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</BodyShort>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                            <Notattekstfelt control={form.control} vedtaksperiodeId={aktivPeriode.vedtaksperiodeId} />
                            <HStack gap="space-8" align="center" marginBlock="space-16 space-0">
                                <Button size="small" variant="secondary" type="submit" loading={loading}>
                                    Lagre notat
                                </Button>
                                <Button size="small" variant="tertiary" type="button" onClick={lukkNotatfelt}>
                                    Avbryt
                                </Button>
                            </HStack>
                        </form>
                    </FormProvider>
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

function Notattekstfelt({
    control,
    vedtaksperiodeId,
}: {
    control: Control<NotatFormFields>;
    vedtaksperiodeId: string;
}) {
    const { field, fieldState } = useController({ name: 'tekst', control });

    const replaceNotat = useUpsertNotat();
    const lagretNotat = useGetNotatTekst(NotatType.Generelt, vedtaksperiodeId);

    return (
        <Textarea
            {...field}
            label="tekst"
            hideLabel
            error={fieldState.error?.message}
            onChange={(e) => {
                field.onChange(e);
                replaceNotat({
                    vedtaksperiodeId: vedtaksperiodeId,
                    tekst: e.target.value,
                    type: NotatType.Generelt,
                });
            }}
            value={lagretNotat}
            description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
            maxLength={2000}
        />
    );
}
