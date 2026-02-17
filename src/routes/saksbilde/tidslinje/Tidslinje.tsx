import dayjs from 'dayjs';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort, HGrid, Heading, VStack } from '@navikt/ds-react';

import { GhostPeriode, Infotrygdutbetaling, Periode, PersonFragment } from '@io/graphql';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektKnapp } from '@saksbilde/tidslinje/TilkommenInntektKnapp';
import { groupTidslinjeData, useTilkomneInntekterRader } from '@saksbilde/tidslinje/groupTidslinjedata';
import { Timeline } from '@saksbilde/tidslinje/timeline/Timeline';
import { TimelinePeriod, TimelineVariant } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { MaksdatoPin } from '@saksbilde/tidslinje/timeline/pin/pins/MaksdatoPin';
import { TimelineRow } from '@saksbilde/tidslinje/timeline/row/TimelineRow';
import { TimelineZoom } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';
import { PeriodCategory } from '@saksbilde/timeline/Period';
import { useInfotrygdPeriods } from '@saksbilde/timeline/hooks/useInfotrygdPeriods';
import { useMaksdato } from '@saksbilde/timeline/hooks/useMaksdato';
import { BlankIcon, CheckIcon, CrossIcon, TaskIcon, WaitingIcon } from '@saksbilde/timeline/icons';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useSetActivePeriodId } from '@state/periode';
import { useNavigerTilTilkommenInntekt, useTilkommenInntektIdFraUrl } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { InfotrygdPeriod } from '@typer/shared';
import { TimelinePeriod as TimelinePeriodType } from '@typer/timeline';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';
import { kanLeggeTilTilkommenInntekt } from '@utils/featureToggles';
import { isSelvstendigNaering } from '@utils/typeguards';

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

    const { arbeidsgiverRader, infotrygdRad } = groupTidslinjeData(inntektsforhold, infotrygdPeriods);
    const { tilkommenRader } = useTilkomneInntekterRader(tilkomneInntekter ?? []);

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
                        copyLabelButton={rad.navn !== 'Selvstendig næringsdrivende'}
                    >
                        {rad.tidslinjeElementer.map((element) => {
                            const periode = element.periode;
                            const ghostPeriode = element.ghostPeriode;
                            const id = periode?.id ?? ghostPeriode?.id;

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
                                >
                                    {periode && <BehandlingPopover periode={periode} />}
                                    {ghostPeriode && <GhostPeriodePopover ghostPeriode={ghostPeriode} />}
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
                                    navigerTilTilkommenInntekt(element.tilkommenInntekt.tilkommenInntektId);
                                }}
                                activePeriod={activeTilkommenInntektId === element.tilkommenInntekt.tilkommenInntektId}
                                icon={statusTilIkon[element.status]}
                                variant="tilkommen_inntekt"
                            >
                                {element.tilkommenInntekt && (
                                    <TilkommenInntektPopover tilkommenInntekt={element.tilkommenInntekt} />
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
                                {element.infotrygdPeriode && (
                                    <InfotrygdPeriodePopover infotrygdPeriode={element.infotrygdPeriode} />
                                )}
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

function BehandlingPopover({ periode }: { periode: Periode }): ReactElement {
    return (
        <PopoverContentWrapper heading="Behandling">
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(periode.fom) + ' - ' + getFormattedDateString(periode.tom)}
            </BodyShort>

            {periode.skjaeringstidspunkt && (
                <>
                    <BodyShort size="small">Skjæringstidspunkt:</BodyShort>
                    <BodyShort size="small">{getFormattedDateString(periode.skjaeringstidspunkt)}</BodyShort>
                </>
            )}

            <BodyShort size="small">Opprettet:</BodyShort>
            <BodyShort size="small">{getFormattedDatetimeString(periode.opprettet)}</BodyShort>

            {/*<BodyShort size="small">Opprettet av:</BodyShort>*/}
            {/*<BodyShort size="small">{periode.opprettetAvNavIdent}</BodyShort>*/}

            {/*<BodyShort size="small">Status:</BodyShort>*/}
            {/*<BodyShort size="small">{statusTilTekst[periode.status]}</BodyShort>*/}
            {/*{periode.beslutterNavIdent && (*/}
            {/*    <>*/}
            {/*        <BodyShort size="small">Beslutter:</BodyShort>*/}
            {/*        <BodyShort size="small">{periode.beslutterNavIdent}</BodyShort>*/}
            {/*    </>*/}
            {/*)}*/}
        </PopoverContentWrapper>
    );
}

function GhostPeriodePopover({ ghostPeriode }: { ghostPeriode: GhostPeriode }): ReactElement {
    return (
        <PopoverContentWrapper heading="Arbeidsforhold uten sykefravær">
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(ghostPeriode.fom) + ' - ' + getFormattedDateString(ghostPeriode.tom)}
            </BodyShort>
        </PopoverContentWrapper>
    );
}

function InfotrygdPeriodePopover({ infotrygdPeriode }: { infotrygdPeriode: InfotrygdPeriod }): ReactElement {
    return (
        <PopoverContentWrapper heading="Behandlet i infotrygd">
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(infotrygdPeriode.fom) + ' - ' + getFormattedDateString(infotrygdPeriode.tom)}
            </BodyShort>
        </PopoverContentWrapper>
    );
}

function PopoverContentWrapper({ heading, children }: PropsWithChildren<{ heading: string }>): ReactElement {
    return (
        <VStack gap="space-4">
            <Heading size="xsmall" level="3">
                {heading}
            </Heading>
            <HGrid columns={2} gap="space-4 space-24">
                {children}
            </HGrid>
        </VStack>
    );
}

export const statusTilIkon: Record<PeriodCategory, ReactElement> = {
    success: <CheckIcon />,
    neutral: <CheckIcon />,
    ghost: <CheckIcon />,
    historisk: <CheckIcon />,
    plus: <CheckIcon />,
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
    plus: 'tilkommen_inntekt',
    neutralError: 'forkastet',
    error: 'forkastet',
    historisk: 'historisk',
    ukjent: 'ingen_utbetaling', // TODO fix
};

function TilkommenInntektPopover({ tilkommenInntekt }: { tilkommenInntekt: ApiTilkommenInntekt }): ReactElement {
    return (
        <PopoverContentWrapper heading="Tilkommen inntekt">
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(tilkommenInntekt.periode.fom) +
                    ' - ' +
                    getFormattedDateString(tilkommenInntekt.periode.tom)}
            </BodyShort>
            <BodyShort size="small">Organisasjonsnummer:</BodyShort>
            <BodyShort size="small">{tilkommenInntekt.organisasjonsnummer}</BodyShort>
        </PopoverContentWrapper>
    );
}
