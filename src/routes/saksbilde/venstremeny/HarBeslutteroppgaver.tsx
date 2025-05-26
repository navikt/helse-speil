import React, { ReactElement } from 'react';

import { Alert, Button, ErrorMessage, Heading, List, Skeleton } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { Maybe, PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import styles from '@saksbilde/venstremeny/Periodeinformasjon.module.scss';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useSetActivePeriodId } from '@state/periode';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { somNorskDato } from '@utils/date';

interface HarBeslutteroppgaverProps {
    person: PersonFragment;
}

export const HarBeslutteroppgaver = ({ person }: HarBeslutteroppgaverProps): Maybe<ReactElement> => {
    const setActivePeriodId = useSetActivePeriodId(person);
    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person.fodselsnummer);
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();

    if (!periodeTilGodkjenning || !harTotrinnsvurdering || !tilkommenInntektData) return null;

    const endredeTilkomneInntektskilder = tilkommenInntektData.tilkomneInntektskilderV2.filter((inntektkilde) =>
        inntektkilde.inntekter.some((tilkommenInntekt) => tilkommenInntekt.erDelAvAktivTotrinnsvurdering),
    );

    const harTilkommenInntektEndring = endredeTilkomneInntektskilder.length > 0;

    const perioderTilKontroll = person.arbeidsgivere
        .map(
            (arbeidsgiver): Periodeinformasjon => ({
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
            <Heading spacing size="xsmall" level="3" className={styles.tittel}>
                Perioder til kontroll
            </Heading>
            {perioderTilKontroll.map((informasjon) => (
                <List key={informasjon.arbeidsgivernavn} as="ul">
                    {perioderTilKontroll.length > 1 ||
                        (harTilkommenInntektEndring && (
                            <AnonymizableText>{informasjon.arbeidsgivernavn}</AnonymizableText>
                        ))}
                    {informasjon.perioder.map((periode) => (
                        <List.Item key={periode.id} className={styles.datoliste}>
                            <Button
                                className={styles.lenkeknapp}
                                variant="tertiary"
                                onClick={() => setActivePeriodId(periode.id)}
                            >
                                {somNorskDato(periode.fom)} – {somNorskDato(periode.tom)}
                            </Button>
                        </List.Item>
                    ))}
                </List>
            ))}
            {endredeTilkomneInntektskilder && (
                <>
                    <Heading spacing size="xsmall" level="3" className={styles.tittel}>
                        Endringer i tilkomne inntekter
                    </Heading>
                    {endredeTilkomneInntektskilder.map((inntektskilde) => (
                        <List key={inntektskilde.organisasjonsnummer} as="ul">
                            <TilkommenInntektArbeidsgivernavn organisasjonsnummer={inntektskilde.organisasjonsnummer} />
                            {inntektskilde.inntekter
                                .filter((tilkommenInntekt) => tilkommenInntekt.erDelAvAktivTotrinnsvurdering)
                                .map((tilkommenInntekt) => (
                                    <List.Item key={tilkommenInntekt.tilkommenInntektId} className={styles.datoliste}>
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
                    ))}
                </>
            )}
        </Alert>
    );
};

const TilkommenInntektArbeidsgivernavn = ({ organisasjonsnummer }: { organisasjonsnummer: string }): ReactElement => {
    const { loading: organisasjonLoading, data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);
    const organisasjonsnavn = organisasjonData?.organisasjon?.navn;
    return organisasjonLoading ? (
        <Skeleton width="8rem" />
    ) : organisasjonsnavn === undefined ? (
        <ErrorMessage>Feil ved navnoppslag</ErrorMessage>
    ) : (
        <AnonymizableText>{organisasjonsnavn}</AnonymizableText>
    );
};
