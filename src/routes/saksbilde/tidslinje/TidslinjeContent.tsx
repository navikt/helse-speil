import dayjs from 'dayjs';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { Infotrygdutbetaling, PersonFragment } from '@io/graphql';
import { PeriodPopover, TilkommenInntektPopover } from '@saksbilde/tidslinje/PeriodPopover';
import { TilkommenInntektKnapp } from '@saksbilde/tidslinje/TilkommenInntektKnapp';
import { useTidslinjeRader } from '@saksbilde/tidslinje/groupTidslinjedata';
import { useInfotrygdPeriods } from '@saksbilde/tidslinje/hooks/useInfotrygdPeriods';
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
import { TimelineZoom } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useSetActivePeriodId } from '@state/periode';
import { useNavigerTilTilkommenInntekt, useTilkommenInntektIdFraUrl } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { PeriodCategory } from '@typer/shared';
import { TimelinePeriod as TimelinePeriodType } from '@typer/timeline';
import { kanLeggeTilTilkommenInntekt } from '@utils/featureToggles';
import { isSelvstendigNaering } from '@utils/typeguards';

interface TidslinjeProps {
    inntektsforhold: Inntektsforhold[];
    infotrygdutbetalinger: Infotrygdutbetaling[];
    activePeriod: TimelinePeriodType | null;
    person: PersonFragment;
}

export function TidslinjeContent({
    inntektsforhold,
    infotrygdutbetalinger,
    activePeriod,
    person,
}: TidslinjeProps): ReactElement {
    const pathname = usePathname();
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const setActivePeriodId = useSetActivePeriodId(person);
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
        <div className="relative [grid-area:timeline]">
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
                                <PeriodPopover element={element} person={person} />
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
    ghostDeaktivert: <CrossIcon />,
    neutralError: <CrossIcon />,
    error: <CrossIcon />,
    ukjent: <BlankIcon />,
};

const statusTilVariant: Record<PeriodCategory, TimelineVariant> = {
    success: 'godkjent',
    neutral: 'ingen_utbetaling',
    ghost: 'ghost',
    ghostDeaktivert: 'ghost',
    attention: 'behandles',
    waiting: 'ventende',
    tilkommen: 'tilkommen',
    tilkommen_fjernet: 'tilkommen_fjernet',
    neutralError: 'ingen_utbetaling',
    error: 'annullert',
    historisk: 'historisk',
    ukjent: 'ingen_utbetaling', // TODO fix
};
