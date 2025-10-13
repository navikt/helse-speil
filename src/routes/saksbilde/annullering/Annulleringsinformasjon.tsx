import React, { ReactElement } from 'react';

import { Alert, BodyShort, Box, HStack, List } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { somNorskDato } from '@utils/date';

import { useTotaltUtbetaltForSykefraværstilfellet } from './annullering';

import styles from './Annulleringsmodal.module.scss';

export const Annulleringsinformasjon = ({
    person,
    periode,
    inntektsforholdReferanse,
}: {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    inntektsforholdReferanse: InntektsforholdReferanse;
}): ReactElement | null => {
    const { totalbeløp, førsteUtbetalingsdag, sisteUtbetalingsdag } = useTotaltUtbetaltForSykefraværstilfellet(person);

    if (!førsteUtbetalingsdag && !sisteUtbetalingsdag && !totalbeløp) return null;

    const kandidater = periode.annulleringskandidater.map((kandidat) => ({
        fom: kandidat.fom,
        tom: kandidat.tom,
    }));

    return (
        <div className={styles.gruppe}>
            <>
                <Box paddingBlock="0 4">
                    <Alert variant="info">
                        Når en periode annulleres, vil overlappende og etterfølgende perioder som det ikke har vært
                        fattet vedtak på, bli tatt ut av Speil.
                    </Alert>
                </Box>
                <HStack gap="2" paddingBlock="2">
                    <Inntektsforholdnavn
                        inntektsforholdReferanse={inntektsforholdReferanse}
                        maxWidth="190px"
                        weight="semibold"
                    />
                    {inntektsforholdReferanse.type === 'Arbeidsgiver' && (
                        <AnonymizableText weight="semibold">
                            {inntektsforholdReferanse.organisasjonsnummer}
                        </AnonymizableText>
                    )}
                </HStack>
                <BodyShort>Utbetalingene for følgende perioder annulleres</BodyShort>
                <List as="ul" size="small">
                    {kandidater.map((kandidat) => (
                        <ListItem key={'kandidater'}>
                            {somNorskDato(kandidat.fom)} - {somNorskDato(kandidat.tom)}
                        </ListItem>
                    ))}
                </List>
            </>
        </div>
    );
};
