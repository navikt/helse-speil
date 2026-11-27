import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Fragment, ReactElement, useEffect, useState } from 'react';

import { CalculatorIcon, InformationSquareIcon, TasklistIcon, TerminalIcon } from '@navikt/aksel-icons';
import { Box, HStack, InfoCard, Tabs, Tooltip, VStack } from '@navikt/ds-react';

import { ApiBeregnetPeriode, ApiPeriodetilstand, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeDropdownMenu } from '@saksbilde/saksbildeMenu/dropdown/SaksbildeDropdownMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { harPeriodeDagerMedUnder20ProsentTotalGrad } from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/arbeidstidsvurdering';
import { finnInitierendeVedtaksperiodeIdFraOverlappendePeriode } from '@saksbilde/utils';
import { Beskjed } from '@saksbilde/varsler/Beskjeder';
import { SaksbildevarslerOgBeskjeder } from '@saksbilde/varsler/SaksbildevarslerOgBeskjeder';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import {
    finnPeriodeÅVelgeISykefraværstilfellet,
    finnSkjæringstidspunktForSykefraværstilfelle,
    periodeUrlIdFor,
    useActivePeriod,
    usePeriodeUrlIdFraUrl,
    useSynkroniserValgtPeriodeMedUrl,
    vilkårsgrunnlagIdFor,
} from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useRisikovurdering } from '@state/risikovurdering';
import { useNavigerTilTabgruppe } from '@state/routing';
import {
    tabgruppeForTab,
    SaksbildeTab,
    tabTilAnker,
    useLagreTabFraAnker,
    useTabgruppe,
    useSaksbildeTab,
    useSykefraværstilfelleFraUrl,
    useTabFraAnker,
} from '@state/tab';
import { useNyttSaksbildeoppsett, useUtviklersnacks } from '@state/toggles';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import { erSkjæringstidspunkt, lagPeriodeUrl, lagSykefraværstilfelleUrl } from '@utils/undersider';

const Utvikler = dynamic(() => import('@saksbilde/utvikler/Utvikler').then((mod) => mod.Utvikler), { ssr: false });

type TilgjengeligTab = { value: SaksbildeTab; label: string; kunIkon?: boolean; ikon?: ReactElement };

const innholdsområde = 'h-full min-w-0 flex-1 overflow-hidden [grid-area:content]';

const useAvailableTabs = (
    aktivPeriode: ActivePeriod | null,
    nyttSaksbildeoppsett: boolean,
    grunnlagsperiode: ApiBeregnetPeriode | null,
) => {
    const utviklersnacks = useUtviklersnacks();
    const risikovurdering = useRisikovurdering(
        isBeregnetPeriode(aktivPeriode) ? aktivPeriode.vedtaksperiodeId : undefined,
    );
    if (!aktivPeriode) return { tabs: [] as TilgjengeligTab[], erAnnullert: false };

    const erBeregnetPeriode = isBeregnetPeriode(aktivPeriode);
    const erPeriode = erBeregnetPeriode || isUberegnetPeriode(aktivPeriode);
    const erVilkårsvurdert = erBeregnetPeriode || isGhostPeriode(aktivPeriode);
    const harRisikofunn = erBeregnetPeriode && (risikovurdering?.funn?.length ?? 0) > 0;

    const erAnnullert =
        isBeregnetPeriode(aktivPeriode) &&
        (aktivPeriode.periodetilstand === ApiPeriodetilstand.Annullert ||
            aktivPeriode.periodetilstand === ApiPeriodetilstand.TilAnnullering);

    const tabs: TilgjengeligTab[] = [];

    const harSykefraværstilfelle = vilkårsgrunnlagIdFor(aktivPeriode) !== null || isUberegnetPeriode(aktivPeriode);

    if (!erAnnullert && nyttSaksbildeoppsett) {
        if (erPeriode || isGhostPeriode(aktivPeriode)) tabs.push({ value: 'dagoversikt', label: 'Vedtaksperiode' });
        if (harRisikofunn) tabs.push({ value: 'vurderingsmomenter', label: 'Vurderingsmomenter' });
        if (utviklersnacks && erPeriode) tabs.push({ value: 'utvikler', label: 'Utvikler', kunIkon: true });
        if (harSykefraværstilfelle)
            tabs.push({
                value: 'sykepengegrunnlag',
                label: 'Sykepengegrunnlag',
                ikon: <CalculatorIcon aria-hidden />,
            });
        if (harSykefraværstilfelle && !isUberegnetPeriode(aktivPeriode) && grunnlagsperiode)
            tabs.push({ value: 'inngangsvilkår', label: 'Inngangsvilkår', ikon: <TasklistIcon aria-hidden /> });
    } else if (!erAnnullert) {
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
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    const tabgruppe = useTabgruppe();
    const navigerTilTabgruppe = useNavigerTilTabgruppe();
    const [periodetabs, setPeriodetabs] = useState<HTMLDivElement | null>(null);
    const periodetabsBredde = useBredde(periodetabs);
    const [meny, setMeny] = useState<HTMLDivElement | null>(null);
    const menyBredde = useBredde(meny);

    const aktivPeriode = useActivePeriod(person);
    useSynkroniserValgtPeriodeMedUrl(aktivPeriode);
    useLagreTabFraAnker();

    const grunnlagsperiode = finnGrunnlagsperiode(person, aktivPeriode);
    const { tabs: availableTabs, erAnnullert } = useAvailableTabs(aktivPeriode, nyttSaksbildeoppsett, grunnlagsperiode);
    useVideresendGammelSykefraværstilfelleUrl(person, tab);

    const erPåSykefraværstilfellet = tabgruppe === 'sykefraværstilfelle';
    const harPeriodeIUrl = periodeUrlId !== null;
    const harTabgruppeIUrl = harPeriodeIUrl || erPåSykefraværstilfellet;
    const behandlingIdFraUrl = periodeUrlId?.behandlingId;
    useEffect(() => {
        if (!aktivPeriode || erPåSykefraværstilfellet) return;
        const aktivPeriodeUrlId = periodeUrlIdFor(aktivPeriode);
        const ukjentBehandlingIUrl =
            behandlingIdFraUrl !== undefined && behandlingIdFraUrl !== aktivPeriodeUrlId.behandlingId;
        if (harPeriodeIUrl && !ukjentBehandlingIUrl) return;
        router.replace(lagPeriodeUrl(personPseudoId, aktivPeriodeUrlId, tabTilAnker(tab)), {
            scroll: false,
        });
    }, [aktivPeriode, erPåSykefraværstilfellet, harPeriodeIUrl, behandlingIdFraUrl, personPseudoId, router, tab]);

    // Velger første tilgjengelige fane hvis gjeldende fane ikke finnes for periodetypen, og holder ankeret i URL-en i synk
    useEffect(() => {
        const tabsITabgruppen = availableTabs.filter(
            (t) => !nyttSaksbildeoppsett || tabgruppeForTab(t.value) === tabgruppe,
        );
        if (!aktivPeriode || !harTabgruppeIUrl || tabsITabgruppen.length === 0) return;
        const gyldigTab = tabsITabgruppen.some((t) => t.value === tab) ? tab : tabsITabgruppen[0]!.value;
        if (gyldigTab !== tab || gyldigTab !== tabFraAnker) {
            setTab(gyldigTab, { erstatt: true });
        }
    }, [aktivPeriode, harTabgruppeIUrl, availableTabs, nyttSaksbildeoppsett, tabgruppe, tab, tabFraAnker, setTab]);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !person) {
        return <PeriodeViewError />;
    }

    if (!aktivPeriode && (periodeUrlId || erPåSykefraværstilfellet)) {
        return (
            <InfoCard data-color="warning" className="m-8 [grid-area:content]">
                <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
                    {erPåSykefraværstilfellet ? 'Fant ikke sykefraværstilfellet i Speil' : 'Fant ikke perioden i Speil'}
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
                <SaksbildevarslerOgBeskjeder person={person} periode={aktivPeriode} />
            </VStack>
        );
    }

    const erPåPerioden = tabgruppe === 'periode';
    const periodeTabs = availableTabs.filter((t) => tabgruppeForTab(t.value) === 'periode');
    const sykefraværstilfelleTabs = availableTabs.filter((t) => tabgruppeForTab(t.value) === 'sykefraværstilfelle');

    const velgTab = (valgtTab: SaksbildeTab) => {
        if (nyttSaksbildeoppsett && tabgruppeForTab(valgtTab) !== tabgruppe) {
            navigerTilTabgruppe(aktivPeriode, valgtTab);
        } else {
            setTab(valgtTab);
        }
    };

    const verktøylinje = erPåPerioden && periodeHarDatoerMedUnder20ProsentTotalGrad && initierendeVedtaksperiodeId && (
        <Verktøylinje
            person={person}
            aktivPeriode={aktivPeriode}
            initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
        />
    );

    return (
        <VStack className={nyttSaksbildeoppsett ? 'contents' : innholdsområde}>
            {!nyttSaksbildeoppsett && (
                <>
                    {verktøylinje}
                    <SaksbildevarslerOgBeskjeder person={person} periode={aktivPeriode} />
                </>
            )}
            <Tabs
                value={tab}
                onChange={(value) => velgTab(value as SaksbildeTab)}
                size="medium"
                className={nyttSaksbildeoppsett ? 'contents' : undefined}
            >
                {nyttSaksbildeoppsett ? (
                    <Box position="relative" width="100%" className="min-w-0 [grid-area:faner]">
                        <Tabs.List>
                            <HStack wrap={false} flexGrow="1">
                                <HStack ref={setPeriodetabs} wrap={false} flexShrink="0">
                                    {periodeTabs.map(visTab)}
                                </HStack>
                                <Box aria-hidden flexShrink="0" style={{ width: menyBredde ?? 0 }} />
                            </HStack>
                            <Box aria-hidden flexShrink="0" className="w-px self-stretch bg-ax-border-focus" />
                            <HStack
                                wrap={false}
                                flexShrink="0"
                                width="25%"
                                className="min-w-max bg-ax-bg-neutral-soft inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtleA"
                            >
                                {sykefraværstilfelleTabs.map((t, i) => (
                                    <Fragment key={t.value}>
                                        {i > 0 && (
                                            <Box
                                                aria-hidden
                                                flexShrink="0"
                                                className="h-6 w-px self-center bg-ax-border-neutral-subtle"
                                            />
                                        )}
                                        {visTab(t)}
                                    </Fragment>
                                ))}
                            </HStack>
                        </Tabs.List>
                        <HStack
                            ref={setMeny}
                            position="absolute"
                            align="center"
                            wrap={false}
                            className={periodetabsBredde === null ? 'invisible inset-y-0' : 'inset-y-0'}
                            style={{ left: periodetabsBredde ?? 0 }}
                        >
                            <SaksbildeDropdownMenu person={person} activePeriod={aktivPeriode} />
                        </HStack>
                    </Box>
                ) : (
                    <HStack
                        wrap={false}
                        className="w-full inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtleA [&>*:first-child]:w-fit [&>*:first-child]:inset-shadow-none"
                    >
                        <Tabs.List>{availableTabs.map(visTab)}</Tabs.List>
                        <HStack align="center" wrap={false}>
                            <SaksbildeDropdownMenu person={person} activePeriod={aktivPeriode} />
                        </HStack>
                    </HStack>
                )}
                <VStack className={nyttSaksbildeoppsett ? innholdsområde : 'contents'}>
                    {nyttSaksbildeoppsett && (
                        <>
                            <SaksbildevarslerOgBeskjeder
                                person={person}
                                periode={aktivPeriode}
                                className="[&>:first-child]:mt-(--ax-space-4)"
                            />
                            {verktøylinje}
                        </>
                    )}
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
                            <>
                                <Tabs.Panel value="dagoversikt">
                                    <Beskjed
                                        grad="info"
                                        tekst="Arbeidsforhold uten sykefravær. Det finnes ingen vedtaksperiode å vise for denne perioden."
                                    />
                                </Tabs.Panel>
                                {grunnlagsperiode && (
                                    <Tabs.Panel value="inngangsvilkår">
                                        <Inngangsvilkår person={person} periode={grunnlagsperiode} />
                                    </Tabs.Panel>
                                )}
                                <Tabs.Panel value="sykepengegrunnlag">
                                    <Sykepengegrunnlag person={person} periode={aktivPeriode} />
                                </Tabs.Panel>
                            </>
                        )}
                        {isUberegnetPeriode(aktivPeriode) && (
                            <>
                                <Tabs.Panel value="dagoversikt">
                                    <Utbetaling person={person} periode={aktivPeriode} />
                                </Tabs.Panel>
                                {nyttSaksbildeoppsett && (
                                    <Tabs.Panel value="sykepengegrunnlag">
                                        {grunnlagsperiode ? (
                                            <Sykepengegrunnlag person={person} periode={grunnlagsperiode} />
                                        ) : (
                                            <Beskjed
                                                grad="info"
                                                tekst="Perioden er ikke beregnet ennå. Det finnes ikke noe sykepengegrunnlag å vise for denne perioden."
                                            />
                                        )}
                                    </Tabs.Panel>
                                )}
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
                </VStack>
            </Tabs>
        </VStack>
    );
};

function finnGrunnlagsperiode(
    person: ApiSaksbildePerson | null,
    aktivPeriode: ActivePeriod | null,
): ApiBeregnetPeriode | null {
    if (isBeregnetPeriode(aktivPeriode)) return aktivPeriode;
    if (!person || !aktivPeriode) return null;
    if (isGhostPeriode(aktivPeriode) && !aktivPeriode.vilkarsgrunnlagId) return null;
    const periode = finnPeriodeÅVelgeISykefraværstilfellet(person, aktivPeriode.skjaeringstidspunkt);
    return isBeregnetPeriode(periode) && periode.vilkarsgrunnlagId ? periode : null;
}

function useVideresendGammelSykefraværstilfelleUrl(person: ApiSaksbildePerson | null, tab: SaksbildeTab) {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const sykefraværstilfelle = useSykefraværstilfelleFraUrl();
    const tabgruppe = useTabgruppe();

    useEffect(() => {
        if (!person || tabgruppe !== 'sykefraværstilfelle' || sykefraværstilfelle === null) return;
        if (erSkjæringstidspunkt(sykefraværstilfelle)) return;
        const skjæringstidspunkt = finnSkjæringstidspunktForSykefraværstilfelle(person, sykefraværstilfelle);
        if (skjæringstidspunkt === null) return;
        router.replace(lagSykefraværstilfelleUrl(personPseudoId, skjæringstidspunkt, tabTilAnker(tab)), {
            scroll: false,
        });
    }, [person, tabgruppe, sykefraværstilfelle, personPseudoId, router, tab]);
}

function useBredde(element: HTMLElement | null): number | null {
    const [bredde, setBredde] = useState<number | null>(null);

    useEffect(() => {
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry) setBredde(entry.contentRect.width);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return bredde;
}

function visTab(t: TilgjengeligTab) {
    return t.kunIkon ? (
        <Tooltip key={t.value} content={t.label}>
            <Tabs.Tab value={t.value} icon={<TerminalIcon aria-hidden />} />
        </Tooltip>
    ) : (
        <Tabs.Tab key={t.value} value={t.value} label={t.label} icon={t.ikon} />
    );
}
