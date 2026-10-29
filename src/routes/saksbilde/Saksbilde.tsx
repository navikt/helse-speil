import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { InformationSquareIcon, TerminalIcon } from '@navikt/aksel-icons';
import { Box, HStack, InfoCard, Tabs, Tooltip, VStack } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { ApiPeriodetilstand } from '@io/rest/generated/spesialist.schemas';
import { SaksbildevarselContainer } from '@saksbilde/SaksbildevarselContainer';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeDropdownMenu } from '@saksbilde/saksbildeMenu/dropdown/SaksbildeDropdownMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { harPeriodeDagerMedUnder20ProsentTotalGrad } from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/arbeidstidsvurdering';
import { finnInitierendeVedtaksperiodeIdFraOverlappendePeriode } from '@saksbilde/utils';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import {
    periodeUrlIdFor,
    useActivePeriod,
    usePeriodeUrlIdFraUrl,
    useSynkroniserValgtPeriodeMedUrl,
} from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { SaksbildeTab, tabTilAnker, useLagreTabFraAnker, useSaksbildeTab, useTabFraAnker } from '@state/tab';
import { useUtviklersnacks } from '@state/toggles';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import { lagPeriodeUrl } from '@utils/undersider';

const Utvikler = dynamic(() => import('@saksbilde/utvikler/Utvikler').then((mod) => mod.Utvikler), { ssr: false });

type TilgjengeligTab = { value: SaksbildeTab; label: string; kunIkon?: boolean };

const useAvailableTabs = (aktivPeriode: ActivePeriod | null) => {
    const utviklersnacks = useUtviklersnacks();
    if (!aktivPeriode) return { tabs: [] as TilgjengeligTab[], erAnnullert: false };

    const erBeregnetPeriode = isBeregnetPeriode(aktivPeriode);
    const erPeriode = erBeregnetPeriode || isUberegnetPeriode(aktivPeriode);
    const erVilkårsvurdert = erBeregnetPeriode || isGhostPeriode(aktivPeriode);
    const harRisikofunn =
        erBeregnetPeriode && aktivPeriode.risikovurdering?.funn && aktivPeriode.risikovurdering?.funn?.length > 0;

    const erAnnullert =
        isBeregnetPeriode(aktivPeriode) &&
        (aktivPeriode.periodetilstand === ApiPeriodetilstand.Annullert ||
            aktivPeriode.periodetilstand === ApiPeriodetilstand.TilAnnullering);

    const tabs: TilgjengeligTab[] = [];

    if (!erAnnullert) {
        if (erPeriode) tabs.push({ value: 'dagoversikt', label: 'Dagoversikt' });
        if (erBeregnetPeriode) tabs.push({ value: 'inngangsvilkår', label: 'Inngangsvilkår' });
        if (erVilkårsvurdert) tabs.push({ value: 'sykepengegrunnlag', label: 'Sykepengegrunnlag' });
        if (utviklersnacks && erPeriode) tabs.push({ value: 'utvikler', label: 'Utvikler', kunIkon: true });
        if (harRisikofunn) tabs.push({ value: 'vurderingsmomenter', label: 'Vurderingsmomenter' });
    }

    return { tabs, erAnnullert };
};

export const Saksbilde = () => {
    const { loading, data: person = null, error } = useFetchPersonQuery();
    const [tab, setTab] = useSaksbildeTab();
    const tabFraAnker = useTabFraAnker();
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const periodeUrlId = usePeriodeUrlIdFraUrl();

    const aktivPeriode = useActivePeriod(person);
    useSynkroniserValgtPeriodeMedUrl(aktivPeriode);
    useLagreTabFraAnker();

    const { tabs: availableTabs, erAnnullert } = useAvailableTabs(aktivPeriode);

    const harPeriodeIUrl = periodeUrlId !== null;
    const behandlingIdFraUrl = periodeUrlId?.behandlingId;
    useEffect(() => {
        if (!aktivPeriode) return;
        const aktivPeriodeUrlId = periodeUrlIdFor(aktivPeriode);
        const ukjentBehandlingIUrl =
            behandlingIdFraUrl !== undefined && behandlingIdFraUrl !== aktivPeriodeUrlId.behandlingId;
        if (harPeriodeIUrl && !ukjentBehandlingIUrl) return;
        router.replace(lagPeriodeUrl(personPseudoId, aktivPeriodeUrlId, tabTilAnker(tab)), {
            scroll: false,
        });
    }, [aktivPeriode, harPeriodeIUrl, behandlingIdFraUrl, personPseudoId, router, tab]);

    // Velger første tilgjengelige fane hvis gjeldende fane ikke finnes for periodetypen, og holder ankeret i URL-en i synk
    useEffect(() => {
        if (!aktivPeriode || !harPeriodeIUrl || availableTabs.length === 0) return;
        const gyldigTab = availableTabs.some((t) => t.value === tab) ? tab : availableTabs[0]!.value;
        if (gyldigTab !== tab || gyldigTab !== tabFraAnker) {
            setTab(gyldigTab, { erstatt: true });
        }
    }, [aktivPeriode, harPeriodeIUrl, availableTabs, tab, tabFraAnker, setTab]);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !person) {
        return <PeriodeViewError />;
    }

    if (!aktivPeriode && periodeUrlId) {
        return (
            <InfoCard data-color="warning" className="m-8 [grid-area:content]">
                <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                    Fant ikke perioden i Speil
                </InfoCard.Message>
            </InfoCard>
        );
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
            <VStack className="h-full min-w-0 flex-1 overflow-hidden [grid-area:content]">
                <SaksbildevarselContainer person={person} periode={aktivPeriode} />
            </VStack>
        );
    }

    return (
        <VStack className="h-full min-w-0 flex-1 overflow-hidden [grid-area:content]">
            {periodeHarDatoerMedUnder20ProsentTotalGrad && initierendeVedtaksperiodeId && (
                <Verktøylinje
                    person={person}
                    aktivPeriode={aktivPeriode}
                    initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                />
            )}
            <SaksbildevarselContainer person={person} periode={aktivPeriode} />
            <Tabs value={tab} onChange={(value) => setTab(value as SaksbildeTab)} size="medium">
                <HStack
                    wrap={false}
                    className="w-full inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtleA [&>*:first-child]:w-fit [&>*:first-child]:inset-shadow-none"
                >
                    <Tabs.List>
                        {availableTabs.map((t) =>
                            t.kunIkon ? (
                                <Tooltip key={t.value} content={t.label}>
                                    <Tabs.Tab value={t.value} icon={<TerminalIcon aria-hidden />} />
                                </Tooltip>
                            ) : (
                                <Tabs.Tab key={t.value} value={t.value} label={t.label} />
                            ),
                        )}
                    </Tabs.List>
                    <HStack align="center" wrap={false}>
                        <VisHvisSkrivetilgang>
                            <SaksbildeDropdownMenu person={person} activePeriod={aktivPeriode} />
                        </VisHvisSkrivetilgang>
                    </HStack>
                </HStack>
                <Box overflowX="auto">
                    {isBeregnetPeriode(aktivPeriode) && (
                        <>
                            <Tabs.Panel value="dagoversikt">
                                <Utbetaling person={person} periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="inngangsvilkår">
                                <Inngangsvilkår person={person} periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="sykepengegrunnlag">
                                <Sykepengegrunnlag person={person} periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="vurderingsmomenter">
                                <Vurderingsmomenter periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="utvikler">
                                <Utvikler
                                    vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                                    fødselsnummer={person.fodselsnummer}
                                    personPseudoId={personPseudoId}
                                />
                            </Tabs.Panel>
                        </>
                    )}
                    {isGhostPeriode(aktivPeriode) && (
                        <Tabs.Panel value="sykepengegrunnlag">
                            <Sykepengegrunnlag person={person} periode={aktivPeriode} />
                        </Tabs.Panel>
                    )}
                    {isUberegnetPeriode(aktivPeriode) && (
                        <>
                            <Tabs.Panel value="dagoversikt">
                                <Utbetaling person={person} periode={aktivPeriode} />
                            </Tabs.Panel>
                            <Tabs.Panel value="utvikler">
                                <Utvikler
                                    vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                                    fødselsnummer={person.fodselsnummer}
                                    personPseudoId={personPseudoId}
                                />
                            </Tabs.Panel>
                        </>
                    )}
                </Box>
            </Tabs>
        </VStack>
    );
};
