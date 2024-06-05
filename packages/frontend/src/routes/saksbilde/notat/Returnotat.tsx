import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { useSetRecoilState } from 'recoil';

import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { NotatType } from '@io/graphql';
import { lokaleNotaterState } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { isGhostPeriode } from '@utils/typeguards';

import { ControlledTextarea } from './ControlledTextarea';

import styles from './Notat.module.css';

interface ReturnotatProps {
    onSubmit: (returtekst: string) => Promise<unknown>;
    setShowNotat: Dispatch<SetStateAction<boolean>>;
    error?: string | undefined;
}

export const Returnotat = ({ onSubmit, setShowNotat, error }: ReturnotatProps) => {
    const oppdaterNotat = useSetRecoilState(lokaleNotaterState);
    const aktivPeriode = useActivePeriod();
    const form = useForm();

    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;

    if (erGhostEllerHarIkkeAktivPeriode) return null;

    const submit: SubmitHandler<FieldValues> = (data) => {
        void onSubmit(data.tekst);
    };

    const lukkNotatfelt = () => {
        oppdaterNotat((currentValue) => [
            ...currentValue.filter(
                (notat) => notat.type !== NotatType.Retur || notat.vedtaksperiodeId !== aktivPeriode.vedtaksperiodeId,
            ),
        ]);
        setShowNotat(false);
    };

    return (
        <li className={classNames(styles.notat, styles.retur)}>
            <BodyShort style={{ fontWeight: 600 }}>Returner sak til saksbehandler</BodyShort>
            <BodyShort>
                Forklar hvorfor saken sendes tilbake på en enkel måte, slik at det er lett å forstå hva som må vurderes
                og gjøres annerledes.
                <br />
                (Blir ikke forevist den sykmeldte med mindre hen ber om innsyn)
            </BodyShort>
            <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                <ControlledTextarea
                    control={form.control}
                    vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                    notattype={NotatType.Retur}
                />
                <span className={styles.buttons}>
                    <Button size="small" variant="secondary" type="submit">
                        Lagre notat og returner
                    </Button>
                    <Button size="small" variant="tertiary" onClick={lukkNotatfelt} type="button">
                        Avbryt
                    </Button>
                </span>
            </form>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </li>
    );
};
