import classNames from 'classnames';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { Maybe, NotatType, PersonFragment } from '@io/graphql';
import { lokaleNotaterState } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { isGhostPeriode, isTilkommenInntekt } from '@utils/typeguards';

import { ControlledTextarea } from './ControlledTextarea';

import styles from './Notat.module.css';

interface ReturnotatProps {
    onSubmit: (returtekst: string) => Promise<unknown>;
    setShowNotat: Dispatch<SetStateAction<boolean>>;
    error?: string | undefined;
    person: PersonFragment;
}

export const Returnotat = ({ onSubmit, setShowNotat, error, person }: ReturnotatProps): Maybe<ReactElement> => {
    const oppdaterNotat = useSetRecoilState(lokaleNotaterState);
    const aktivPeriode = useActivePeriod(person);
    const form = useForm();

    const erGhostTilkommenEllerHarIkkeAktivPeriode =
        isGhostPeriode(aktivPeriode) || isTilkommenInntekt(aktivPeriode) || !aktivPeriode;

    if (erGhostTilkommenEllerHarIkkeAktivPeriode) return null;

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
                (Blir ikke forevist den sykmeldte, med mindre hen ber om innsyn)
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
