import dayjs from 'dayjs';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, HGrid } from '@navikt/ds-react';

import { Infotrygdutbetaling, PersonFragment } from '@io/graphql';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektKnapp } from '@saksbilde/tidslinje/TilkommenInntektKnapp';
import { TidslinjeElement, useTidslinjeRader } from '@saksbilde/tidslinje/groupTidslinjedata';
import { Timeline } from '@saksbilde/tidslinje/timeline/Timeline';
import { TimelinePeriod, TimelineVariant } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { MaksdatoPin } from '@saksbilde/tidslinje/timeline/pin/pins/MaksdatoPin';
import { TimelineRow } from '@saksbilde/tidslinje/timeline/row/TimelineRow';
import { TimelineZoom } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';
import { PeriodCategory } from '@saksbilde/timeline/Period';
import { BeregnetPopover, GhostPopover, InfotrygdPopover, UberegnetPopover } from '@saksbilde/timeline/PeriodPopover';
import { useInfotrygdPeriods } from '@saksbilde/timeline/hooks/useInfotrygdPeriods';
import { useMaksdato } from '@saksbilde/timeline/hooks/useMaksdato';
import {
    BlankIcon,
    CheckIcon,
    CrossIcon,
    FjernetTilkommenInntektIkon,
    TaskIcon,
    WaitingIcon,
} from '@saksbilde/timeline/icons';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useSetActivePeriodId } from '@state/periode';
import { useNavigerTilTilkommenInntekt, useTilkommenInntektIdFraUrl } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { TimelinePeriod as TimelinePeriodType } from '@typer/timeline';
import { somNorskDato } from '@utils/date';
import { kanLeggeTilTilkommenInntekt } from '@utils/featureToggles';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isSelvstendigNaering } from '@utils/typeguards';

interface TidslinjeProps {
    inntektsforhold: Inntektsforhold[];
    infotrygdutbetalinger: Infotrygdutbetaling[];
    activePeriod: TimelinePeriodType | null;
    person: PersonFragment;
}

export function Tidslinje({
    inntektsforhold,
    infotrygdutbetalinger,
    activePeriod,
    person,
}: TidslinjeProps): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const setActivePeriodId = useSetActivePeriodId(person);
    const pathname = usePathname();
    const router = useRouter();
    const infotrygdPeriods = useInfotrygdPeriods(infotrygdutbetalinger);
    const { data: tilkomneInntekter } = useHentTilkommenInntektQuery(personPseudoId);
    const activeTilkommenInntektId = useTilkommenInntektIdFraUrl();
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();

    const { arbeidsgiverRader, infotrygdRad, tilkommenRader } = useTidslinjeRader(
        inntektsforhold,
        infotrygdPeriods,
        tilkomneInntekter ?? [],
    );

    const maksdato = useMaksdato(inntektsforhold);

    return (
        <div className="relative">
            <Timeline>
                <MaksdatoPin maksdato={maksdato} />
                {arbeidsgiverRader.map((rad) => (
                    <TimelineRow
                        key={rad.id}
                        label={rad.navn}
                        icon={rad.icon}
                        copyLabelButton={rad.navn !== 'Selvstendig næring'}
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
                                                router.push(`/person/${personPseudoId}/dagoversikt`);
                                            }
                                        }
                                    }}
                                    activePeriod={!!(activePeriod && 'id' in activePeriod && activePeriod.id === id)}
                                    icon={statusTilIkon[element.status]}
                                    variant={statusTilVariant[element.status]}
                                    generasjonIndex={element.generasjonIndex}
                                    periodPins={element.periodPins}
                                >
                                    <Popover
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
                    <TimelineRow key={rad.id} label={rad.navn} icon={rad.icon} copyLabelButton>
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
                {infotrygdRad.tidslinjeElementer.length > 0 && (
                    <TimelineRow label={infotrygdRad.navn} icon={infotrygdRad.icon}>
                        {infotrygdRad.tidslinjeElementer.map((element) => (
                            <TimelinePeriod
                                key={element.fom + element.tom}
                                startDate={dayjs(element.fom)}
                                endDate={dayjs(element.tom)}
                                icon={<CheckIcon />}
                                variant="infotrygd"
                            >
                                <Popover element={element} person={person} />
                            </TimelinePeriod>
                        ))}
                    </TimelineRow>
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

function TilkommenInntektPopover({
    tilkommenInntekt,
    element,
}: {
    tilkommenInntekt: ApiTilkommenInntekt;
    element: TidslinjeElement;
}): ReactElement {
    const fom = somNorskDato(element.fom) ?? '-';
    const tom = somNorskDato(element.tom) ?? '-';

    return (
        <HGrid columns={2} gap="space-4 space-24">
            <BodyShort size="small" className="col-span-2" weight="semibold">
                Tilkommen inntekt
                {tilkommenInntekt.fjernet ? ' (fjernet)' : ''}
            </BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </HGrid>
    );
}

function Popover({
    element,
    person,
    erSelvstendigNæring = false,
}: {
    element: TidslinjeElement;
    person: PersonFragment;
    erSelvstendigNæring?: boolean;
}): ReactElement {
    const period = element.periode ?? element.ghostPeriode ?? element.infotrygdPeriode;
    const fom = somNorskDato(element.fom) ?? '-';
    const tom = somNorskDato(element.tom) ?? '-';
    const state = getPeriodState(period);

    return (
        <HGrid columns={2} gap="space-4 space-24">
            {isInfotrygdPeriod(period) ? (
                <InfotrygdPopover fom={fom} tom={tom} />
            ) : isBeregnetPeriode(period) ? (
                <BeregnetPopover
                    period={period}
                    state={state}
                    fom={fom}
                    tom={tom}
                    person={person}
                    erSelvstendigNæringsdrivende={erSelvstendigNæring}
                />
            ) : isGhostPeriode(period) ? (
                <GhostPopover fom={fom} tom={tom} />
            ) : (
                <UberegnetPopover state={state} fom={fom} tom={tom} />
            )}
        </HGrid>
    );
}
