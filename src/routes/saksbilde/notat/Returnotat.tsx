import classNames from 'classnames';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { BodyShort, Button, ErrorMessage, HStack } from '@navikt/ds-react';

import { Maybe, NotatType, PersonFragment } from '@io/graphql';
import { useFjernNotat } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { isGhostPeriode } from '@utils/typeguards';

import { ControlledTextarea } from './ControlledTextarea';

import styles from './Notat.module.css';

interface ReturnotatProps {
    onSubmit: (returtekst: string) => Promise<unknown>;
    setShowNotat: Dispatch<SetStateAction<boolean>>;
    error?: string | undefined;
    person: PersonFragment;
}

export const Returnotat = ({ onSubmit, setShowNotat, error, person }: ReturnotatProps): Maybe<ReactElement> => {
    const fjernNotat = useFjernNotat();
    const aktivPeriode = useActivePeriod(person);
    const form = useForm();

    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;

    if (erGhostEllerHarIkkeAktivPeriode) return null;

    const submit: SubmitHandler<FieldValues> = (data) => {
        void onSubmit(data.tekst);
    };

    const lukkNotatfelt = () => {
        fjernNotat(aktivPeriode.vedtaksperiodeId, NotatType.Generelt);
        setShowNotat(false);
    };

    return (
        <li className={classNames(styles.notat, styles.retur)}>
            <BodyShort style={{ fontWeight: 600 }}>Returner sak til saksbehandler</BodyShort>
            <BodyShort>
                Forklar hvorfor saken sendes tilbake på en enkel måte, slik at det er lett å forstå hva som må vurderes
                og gjøres annerledes.
                <br />
                (Blir ikke forevist den sykmeldte, med mindre hen ber om innsyn)
            </BodyShort>
            <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                <ControlledTextarea
                    control={form.control}
                    vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                    notattype={NotatType.Retur}
                />
                <HStack gap="2" align="center" marginBlock="4 0">
                    <Button size="small" variant="secondary" type="submit">
                        Lagre notat og returner
                    </Button>
                    <Button size="small" variant="tertiary" onClick={lukkNotatfelt} type="button">
                        Avbryt
                    </Button>
                </HStack>
            </form>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </li>
    );
};
