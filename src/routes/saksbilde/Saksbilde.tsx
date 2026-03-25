import React, { useEffect } from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Box, HStack, InfoCard, Tabs, VStack } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { Periodetilstand, PersonFragment } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeDropdownMenu } from '@saksbilde/saksbildeMenu/dropdown/SaksbildeDropdownMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { harPeriodeDagerMedUnder20ProsentTotalGrad } from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/arbeidstidsvurdering';
import { finnInitierendeVedtaksperiodeIdFraOverlappendePeriode } from '@saksbilde/utils';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { InngangsvilkårNy } from '@saksbilde/vilkår/ny-inngangsvilkår/InngangsvilkårNy';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { SaksbildeTab, useSaksbildeTab } from '@state/tab';
import { useKanSeNyInngangsvilkår } from '@state/toggles';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

const useAvailableTabs = (aktivPeriode: ActivePeriod | null) => {
    if (!aktivPeriode) return { tabs: [] as { value: SaksbildeTab; label: string }[], erAnnullert: false };

    const erBeregnetPeriode = isBeregnetPeriode(aktivPeriode);
    const erPeriode = erBeregnetPeriode || isUberegnetPeriode(aktivPeriode);
    const erVilkårsvurdert = erBeregnetPeriode || isGhostPeriode(aktivPeriode);
    const harRisikofunn =
        erBeregnetPeriode && aktivPeriode.risikovurdering?.funn && aktivPeriode.risikovurdering?.funn?.length > 0;

    const erAnnullert =
        isBeregnetPeriode(aktivPeriode) &&
        (aktivPeriode.periodetilstand === Periodetilstand.Annullert ||
            aktivPeriode.periodetilstand === Periodetilstand.TilAnnullering);

    const tabs: { value: SaksbildeTab; label: string }[] = [];

    if (!erAnnullert) {
        if (erPeriode) tabs.push({ value: 'dagoversikt', label: 'Dagoversikt' });
        if (erBeregnetPeriode) tabs.push({ value: 'inngangsvilkår', label: 'Inngangsvilkår' });
        if (erVilkårsvurdert) tabs.push({ value: 'sykepengegrunnlag', label: 'Sykepengegrunnlag' });
        if (harRisikofunn) tabs.push({ value: 'vurderingsmomenter', label: 'Vurderingsmomenter' });
    }

    return { tabs, erAnnullert };
};

export const Saksbilde = () => {
    const { loading, data, error } = useFetchPersonQuery();
    const [tab, setTab] = useSaksbildeTab();
    const visNyInngangsvilkår = useKanSeNyInngangsvilkår();

    const person: PersonFragment | null = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);

    const { tabs: availableTabs, erAnnullert } = useAvailableTabs(aktivPeriode);

    // Correct tab if current tab is not available for this period type
    useEffect(() => {
        if (!aktivPeriode || availableTabs.length === 0) return;
        const tabIsAvailable = availableTabs.some((t) => t.value === tab);
        if (!tabIsAvailable) {
            setTab(availableTabs[0]!.value);
        }
    }, [aktivPeriode, availableTabs, tab, setTab]);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !person) {
        return <PeriodeViewError />;
    }

    if (!aktivPeriode) {
        return (
            <InfoCard data-color="info" className="m-8 [grid-area:content]">
                <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                    Personen har ingen perioder i Speil
                </InfoCard.Message>
            </InfoCard>
        );
    }

    const inntektsforhold = finnAlleInntektsforhold(person);
    const initierendeVedtaksperiodeId =
        isBeregnetPeriode(aktivPeriode) || isUberegnetPeriode(aktivPeriode)
            ? aktivPeriode.vedtaksperiodeId
            : finnInitierendeVedtaksperiodeIdFraOverlappendePeriode(inntektsforhold, aktivPeriode);

    const periodeHarDatoerMedUnder20ProsentTotalGrad = harPeriodeDagerMedUnder20ProsentTotalGrad(
        aktivPeriode,
        inntektsforhold,
        aktivPeriode.skjaeringstidspunkt,
    );

    if (erAnnullert) {
        return (
            <VStack className="h-full min-w-0 flex-1 [grid-area:content]">
                <SaksbildeVarsel person={person} periode={aktivPeriode} />
            </VStack>
        );
    }

    return (
        <VStack className="h-full min-w-0 flex-1 [grid-area:content]">
            {periodeHarDatoerMedUnder20ProsentTotalGrad && initierendeVedtaksperiodeId && (
                <Verktøylinje
                    person={person}
                    aktivPeriode={aktivPeriode}
                    initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                />
            )}
            <SaksbildeVarsel person={person} periode={aktivPeriode} />
            <Tabs value={tab} onChange={(value) => setTab(value as SaksbildeTab)} size="medium">
                <HStack
                    wrap={false}
                    className="w-full inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtleA [&>*:first-child]:w-fit [&>*:first-child]:inset-shadow-none"
                >
                    <Tabs.List>
                        {availableTabs.map((t) => (
                            <Tabs.Tab key={t.value} value={t.value} label={t.label} />
                        ))}
                    </Tabs.List>
                    <VisHvisSkrivetilgang>
                        <SaksbildeDropdownMenu person={person} activePeriod={aktivPeriode} />
                    </VisHvisSkrivetilgang>
                </HStack>
                <Box overflowX="auto">
                    {isBeregnetPeriode(aktivPeriode) && (
                        <>
                            <Tabs.Panel value="dagoversikt">
                                <Utbetaling person={person} periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="inngangsvilkår">
                                {visNyInngangsvilkår ? (
                                    <InngangsvilkårNy periode={aktivPeriode} />
                                ) : (
                                    <Inngangsvilkår person={person} periode={aktivPeriode} />
                                )}
                            </Tabs.Panel>
                            <Tabs.Panel value="sykepengegrunnlag">
                                <Sykepengegrunnlag person={person} periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="vurderingsmomenter">
                                <Vurderingsmomenter periode={aktivPeriode} />
                            </Tabs.Panel>
                        </>
                    )}
                    {isGhostPeriode(aktivPeriode) && (
                        <Tabs.Panel value="sykepengegrunnlag">
                            <Sykepengegrunnlag person={person} periode={aktivPeriode} />
                        </Tabs.Panel>
                    )}
                    {isUberegnetPeriode(aktivPeriode) && (
                        <Tabs.Panel value="dagoversikt">
                            <Utbetaling person={person} periode={aktivPeriode} />
                        </Tabs.Panel>
                    )}
                </Box>
            </Tabs>
        </VStack>
    );
};
