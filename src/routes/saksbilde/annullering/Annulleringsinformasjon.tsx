import React, { ReactElement } from 'react';

import { BodyShort, List } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';

import { useBrukerGrupper } from '@auth/brukerContext';
import { BeregnetPeriodeFragment, Maybe, PersonFragment } from '@io/graphql';
import { somNorskDato } from '@utils/date';
import { kanSeNyAnnulleringsrigg } from '@utils/featureToggles';
import { somPenger } from '@utils/locale';

import { useTotaltUtbetaltForSykefraværstilfellet } from './annullering';

import styles from './Annulleringsmodal.module.scss';

export const Annulleringsinformasjon = ({
    person,
    periode,
}: {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}): Maybe<ReactElement> => {
    const { totalbeløp, førsteUtbetalingsdag, sisteUtbetalingsdag } = useTotaltUtbetaltForSykefraværstilfellet(person);
    const grupper = useBrukerGrupper();

    if (!førsteUtbetalingsdag && !sisteUtbetalingsdag && !totalbeløp) return null;

    const kandidater = periode.annulleringskandidater.map((kandidat) => ({
        fom: kandidat.fom,
        tom: kandidat.tom,
    }));

    const unikeOrganisasjonsnummere = [...new Set(periode.annulleringskandidater.map((o) => o.organisasjonsnummer))];

    return (
        <div className={styles.gruppe}>
            {kanSeNyAnnulleringsrigg(grupper) && (
                <>
                    <BodyShort weight={'semibold'}>Ny rigg:</BodyShort>
                    <BodyShort>Organisasjonsnummer: {unikeOrganisasjonsnummere.join(', ')}</BodyShort>
                    <BodyShort>Utbetalingene for følgende perioder annulleres:</BodyShort>
                    <List as="ul">
                        {kandidater.map((kandidat) => (
                            <ListItem key={'kandidater'}>
                                {somNorskDato(kandidat.fom)} - {somNorskDato(kandidat.tom)}
                            </ListItem>
                        ))}
                    </List>
                    <BodyShort weight={'semibold'}>Gammel rigg:</BodyShort>
                </>
            )}
            <BodyShort>Følgende utbetalinger annulleres:</BodyShort>
            <ul>
                <li>
                    <BodyShort>
                        {førsteUtbetalingsdag !== undefined && somNorskDato(førsteUtbetalingsdag)} -{' '}
                        {sisteUtbetalingsdag !== undefined && somNorskDato(sisteUtbetalingsdag)}
                        {totalbeløp ? ` - ${somPenger(totalbeløp)}` : null}
                    </BodyShort>
                </li>
            </ul>
        </div>
    );
};
