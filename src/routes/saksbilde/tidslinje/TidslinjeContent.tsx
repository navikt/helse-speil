import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ArchiveIcon } from '@navikt/aksel-icons';
import { Skeleton } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { useGetInfotrygdperioderForPerson } from '@io/rest/generated/personer/personer';
import { InfotrygdPopover, PeriodPopover, TilkommenInntektPopover } from '@saksbilde/tidslinje/PeriodPopover';
import { TilkommenInntektKnapp } from '@saksbilde/tidslinje/TilkommenInntektKnapp';
import { useTidslinjeRader } from '@saksbilde/tidslinje/groupTidslinjedata';
import { useInfotrygdPerioder } from '@saksbilde/tidslinje/hooks/useInfotrygdPerioder';
import { useMaksdato } from '@saksbilde/tidslinje/hooks/useMaksdato';
import {
    BlankIcon,
    CheckIcon,
    CrossIcon,
    FjernetTilkommenInntektIkon,
    TaskIcon,
    WaitingIcon,
} from '@saksbilde/tidslinje/icons';
import { Timeline } from '@saksbilde/tidslinje/timeline/Timeline';
import { TimelinePeriod, TimelineVariant } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { MaksdatoPin } from '@saksbilde/tidslinje/timeline/pin/pins/MaksdatoPin';
import { TimelineRow } from '@saksbilde/tidslinje/timeline/row/TimelineRow';
import { TimelineZoom, ZoomLevel } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';
import { useIsAnonymous } from '@state/anonymization';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { atomWithLocalStorage } from '@state/jotai';
import { useSetActivePeriodId } from '@state/periode';
import { useNavigerTilTilkommenInntekt, useTilkommenInntektIdFraUrl } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { useBrukRestForInfotrygdperioder } from '@state/toggles';
import { PeriodCategory } from '@typer/shared';
import { TimelinePeriod as TimelinePeriodType } from '@typer/timeline';
import { kanLeggeTilTilkommenInntekt } from '@utils/featureToggles';
import { isSelvstendigNaering } from '@utils/typeguards';

interface TidslinjeProps {
    inntektsforhold: Inntektsforhold[];
    activePeriod: TimelinePeriodType | null;
    person: PersonFragment;
}

const zoomLevelAtom = atomWithLocalStorage<ZoomLevel>('tidslinje-zoom-level', '6 mnd');

export function TidslinjeContent({ inntektsforhold, activePeriod, person }: TidslinjeProps): ReactElement {
    const pathname = usePathname();
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const isAnonymous = useIsAnonymous();
    const setActivePeriodId = useSetActivePeriodId(person);
    const brukRestForInfotrygdperioder = useBrukRestForInfotrygdperioder();
    const infotrygdPerioderFraGraphQL = useInfotrygdPerioder(person.infotrygdutbetalinger ?? []);
    const { data: infotrygdPerioderFraREST, isLoading: isLoadingInfotrygdperioder } = useGetInfotrygdperioderForPerson(
        personPseudoId,
        { query: { enabled: brukRestForInfotrygdperioder } },
    );
    const infotrygdPerioder = brukRestForInfotrygdperioder
        ? (infotrygdPerioderFraREST ?? [])
        : infotrygdPerioderFraGraphQL;
    const { data: tilkomneInntekter } = useHentTilkommenInntektQuery(personPseudoId);
    const activeTilkommenInntektId = useTilkommenInntektIdFraUrl();
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);

    const { arbeidsgiverRader, tilkommenRader } = useTidslinjeRader(inntektsforhold, tilkomneInntekter ?? []);

    const maksdato = useMaksdato(inntektsforhold);

    return (
        <div className="relative [grid-area:timeline]">
            <Timeline zoomLevel={zoomLevel} onZoomLevelChange={setZoomLevel}>
                <MaksdatoPin maksdato={maksdato} />
                {arbeidsgiverRader.map((rad) => (
                    <TimelineRow
                        key={rad.id}
                        label={rad.navn}
                        icon={rad.icon}
                        copyLabelButton={rad.navn !== 'Selvstendig næring'}
                        anonymized={isAnonymous}
                    >
                        {rad.tidslinjeElementer.map((element) => {
                            const id = element.periode?.id ?? element.ghostPeriode?.id;

                            return (
                                <TimelinePeriod
                                    key={rad.id + element.fom + element.tom}
                                    startDate={dayjs(element.fom)}
                                    endDate={dayjs(element.tom)}
                                    skjæringstidspunkt={dayjs(element.skjæringstidspunkt)}
                                    onSelectPeriod={() => {
                                        if (id) {
                                            setActivePeriodId(id);
                                            const erPåTilkommenInntektSide = pathname.includes('/tilkommeninntekt/');
                                            if (erPåTilkommenInntektSide) {
                                                router.push(`/person/${personPseudoId}`);
                                            }
                                        }
                                    }}
                                    activePeriod={!!(activePeriod && 'id' in activePeriod && activePeriod.id === id)}
                                    icon={statusTilIkon[element.status]}
                                    variant={statusTilVariant[element.status]}
                                    generasjonIndex={element.generasjonIndex}
                                    periodPins={element.periodPins}
                                >
                                    <PeriodPopover
                                        element={element}
                                        person={person}
                                        erSelvstendigNæring={rad.navn === 'Selvstendig næring'}
                                    />
                                </TimelinePeriod>
                            );
                        })}
                    </TimelineRow>
                ))}
                {tilkommenRader.map((rad) => (
                    <TimelineRow key={rad.id} label={rad.navn} icon={rad.icon} copyLabelButton anonymized={isAnonymous}>
                        {rad.tidslinjeElementer.map((element) => (
                            <TimelinePeriod
                                key={element.fom + element.tom}
                                startDate={dayjs(element.fom)}
                                endDate={dayjs(element.tom)}
                                onSelectPeriod={() => {
                                    navigerTilTilkommenInntekt(element.tilkommenInntekt!.tilkommenInntektId);
                                }}
                                activePeriod={activeTilkommenInntektId === element.tilkommenInntekt!.tilkommenInntektId}
                                icon={statusTilIkon[element.status]}
                                variant={statusTilVariant[element.status]}
                            >
                                {element.tilkommenInntekt && (
                                    <TilkommenInntektPopover
                                        tilkommenInntekt={element.tilkommenInntekt}
                                        element={element}
                                    />
                                )}
                            </TimelinePeriod>
                        ))}
                    </TimelineRow>
                ))}
                {brukRestForInfotrygdperioder && isLoadingInfotrygdperioder ? (
                    <TimelineRow
                        label="Infotrygd"
                        icon={<ArchiveIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />}
                    >
                        <Skeleton height={40} className="grow" />
                    </TimelineRow>
                ) : (
                    infotrygdPerioder.length > 0 && (
                        <TimelineRow
                            label="Infotrygd"
                            icon={<ArchiveIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />}
                        >
                            {infotrygdPerioder.map((periode) => (
                                <TimelinePeriod
                                    key={periode.fom + periode.tom}
                                    startDate={dayjs(periode.fom)}
                                    endDate={dayjs(periode.tom)}
                                    icon={<CheckIcon />}
                                    variant="infotrygd"
                                >
                                    <InfotrygdPopover fom={periode.fom} tom={periode.tom} />
                                </TimelinePeriod>
                            ))}
                        </TimelineRow>
                    )
                )}
                <TimelineZoom />
            </Timeline>
            <TilkommenInntektKnapp
                person={person}
                personPseudoId={personPseudoId}
                kanLeggeTilTilkommenInntekt={kanLeggeTilTilkommenInntekt(inntektsforhold.some(isSelvstendigNaering))}
            />
        </div>
    );
}

export const statusTilIkon: Record<PeriodCategory, ReactElement> = {
    success: <CheckIcon />,
    neutral: <CheckIcon />,
    ghost: <CheckIcon />,
    historisk: <CheckIcon />,
    tilkommen: <CheckIcon />,
    tilkommen_fjernet: <FjernetTilkommenInntektIkon />,
    attention: <TaskIcon />,
    waiting: <WaitingIcon />,
    neutralError: <CrossIcon />,
    error: <CrossIcon />,
    ukjent: <BlankIcon />,
};

const statusTilVariant: Record<PeriodCategory, TimelineVariant> = {
    success: 'godkjent',
    neutral: 'ingen_utbetaling',
    ghost: 'ghost',
    attention: 'behandles',
    waiting: 'ventende',
    tilkommen: 'tilkommen',
    tilkommen_fjernet: 'tilkommen_fjernet',
    neutralError: 'ingen_utbetaling',
    error: 'annullert',
    historisk: 'historisk',
    ukjent: 'ingen_utbetaling', // TODO fix
};
