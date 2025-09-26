import React, { ReactElement } from 'react';

import { Alert, Button, Detail, Heading, List, VStack } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@components/Arbeidsgivernavn';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useNavigerTilPeriode, useNavigerTilTilkommenInntekt } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { somNorskDato } from '@utils/date';

import styles from './HarBeslutteroppgaver.module.scss';

interface HarBeslutteroppgaverProps {
    person: PersonFragment;
}

export const HarBeslutteroppgaver = ({ person }: HarBeslutteroppgaverProps): ReactElement | null => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person.aktorId);
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const navigerTilPeriode = useNavigerTilPeriode();

    if (!periodeTilGodkjenning || !harTotrinnsvurdering || !tilkommenInntektData) return null;

    const endredeTilkomneInntektskilder = tilkommenInntektData.restGetTilkomneInntektskilder.filter((inntektkilde) =>
        inntektkilde.inntekter.some((tilkommenInntekt) => tilkommenInntekt.erDelAvAktivTotrinnsvurdering),
    );

    const harTilkommenInntektEndring = endredeTilkomneInntektskilder.length > 0;

    const perioderTilKontroll = person.arbeidsgivere
        .map(
            (arbeidsgiver): Periodeinformasjon => ({
                arbeidsgiverIdentifikator: arbeidsgiver.organisasjonsnummer,
                arbeidsgivernavn: arbeidsgiver.navn,
                perioder:
                    arbeidsgiver.generasjoner[0]?.perioder
                        .filter((periode) => !periode.erForkastet)
                        .filter(
                            (periode) =>
                                arbeidsgiver.overstyringer
                                    .filter((overstyring) => !overstyring.ferdigstilt)
                                    .some((overstyring) => overstyring.vedtaksperiodeId === periode.vedtaksperiodeId) ||
                                (periodeTilGodkjenning.id === periode.id && harTilkommenInntektEndring),
                        )
                        .map((periode) => ({
                            id: periode.id,
                            fom: periode.fom,
                            tom: periode.tom,
                        })) ?? [],
            }),
        )
        .filter((overstyring) => overstyring.perioder.length > 0);

    if (perioderTilKontroll.length === 0 && !harTilkommenInntektEndring) return null;

    return (
        <Alert variant="info">
            <VStack gap="4">
                <VStack>
                    <Heading spacing size="xsmall" level="3" className={styles.tittel}>
                        Perioder til kontroll
                    </Heading>
                    {perioderTilKontroll.map((informasjon) => (
                        <List key={informasjon.arbeidsgivernavn} as="ul" className={styles.periodeListe}>
                            {perioderTilKontroll.length > 1 ||
                                (harTilkommenInntektEndring && (
                                    <Arbeidsgivernavn
                                        identifikator={informasjon.arbeidsgiverIdentifikator}
                                        navn={informasjon.arbeidsgivernavn}
                                        weight="semibold"
                                    />
                                ))}
                            {informasjon.perioder.map((periode) => (
                                <List.Item key={periode.id} className={styles.periodeListeElement}>
                                    <Button
                                        className={styles.lenkeknapp}
                                        variant="tertiary"
                                        onClick={() => navigerTilPeriode(periode.id)}
                                    >
                                        {somNorskDato(periode.fom)} – {somNorskDato(periode.tom)}
                                    </Button>
                                </List.Item>
                            ))}
                        </List>
                    ))}
                </VStack>
                {harTilkommenInntektEndring && (
                    <VStack>
                        <Detail>Tilkommen inntekt</Detail>
                        {endredeTilkomneInntektskilder.map((inntektskilde) => (
                            <React.Fragment key={inntektskilde.organisasjonsnummer}>
                                <Arbeidsgivernavn identifikator={inntektskilde.organisasjonsnummer} weight="semibold" />
                                <List as="ul" className={styles.periodeListe}>
                                    {inntektskilde.inntekter
                                        .filter((tilkommenInntekt) => tilkommenInntekt.erDelAvAktivTotrinnsvurdering)
                                        .map((tilkommenInntekt) => (
                                            <List.Item
                                                key={tilkommenInntekt.tilkommenInntektId}
                                                className={styles.periodeListeElement}
                                            >
                                                <Button
                                                    className={styles.lenkeknapp}
                                                    variant="tertiary"
                                                    onClick={() =>
                                                        navigerTilTilkommenInntekt(tilkommenInntekt.tilkommenInntektId)
                                                    }
                                                >
                                                    {somNorskDato(tilkommenInntekt.periode.fom)} –{' '}
                                                    {somNorskDato(tilkommenInntekt.periode.tom)}
                                                </Button>
                                            </List.Item>
                                        ))}
                                </List>
                            </React.Fragment>
                        ))}
                    </VStack>
                )}
            </VStack>
        </Alert>
    );
};
