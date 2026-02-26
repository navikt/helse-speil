import { useParams } from 'next/navigation';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { type Control, Controller, FieldValues, FormProvider, useForm } from 'react-hook-form';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    HStack,
    Heading,
    Link,
    LocalAlert,
    Radio,
    RadioGroup,
    Skeleton,
    Table,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriode } from '@io/graphql';
import type { ApiManuellInngangsvilkårVurdering, Automatisk, Manuell } from '@io/rest/generated/spesialist.schemas';
import {
    getGetVurderteInngangsvilkårForPersonQueryKey,
    useGetVurderteInngangsvilkårForPerson,
    usePostVurderteInngangsvilkårForPerson,
} from '@io/rest/generated/vilkårsvurderinger/vilkårsvurderinger';
import { useQueryClient } from '@tanstack/react-query';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { cn } from '@utils/tw';

import type { Underspørsmål } from './kodeverkTyper';
import { saksbehandlerUiKodeverk } from './saksbehandlerUiKodeverk';
import {
    findVurderingForVilkår,
    getVilkårInfo,
    getVurderingStatus,
    getVurdertAv,
    getVurdertDato,
} from './vilkårHelper';

function InngangsvilkårContainer({ periode }: { periode: BeregnetPeriode }) {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const {
        data: samlingAvVurderinger,
        isLoading,
        isError,
    } = useGetVurderteInngangsvilkårForPerson(personPseudoId, periode.skjaeringstidspunkt);

    const vurderinger = useMemo(() => {
        if (!samlingAvVurderinger?.length) return [];
        const sisteSamling = samlingAvVurderinger.reduce((acc, samling) =>
            samling.versjon > acc.versjon ? samling : acc,
        );
        return sisteSamling.vurderteInngangsvilkår ?? [];
    }, [samlingAvVurderinger]);

    if (isError) {
        return (
            <LocalAlert status="error">
                <LocalAlert.Title>Feil ved innlastning av inngangsvilkår</LocalAlert.Title>
                <LocalAlert.Content>
                    Det skjedde en feil ved innlastning av inngangsvilkår. Prøv igjen senere.
                </LocalAlert.Content>
            </LocalAlert>
        );
    }

    return (
        <VStack marginBlock="space-20" marginInline="space-24" gap="space-20">
            <Heading size="xsmall">
                Inngangsvilkår for skjæringstidspunkt {somNorskDato(periode.skjaeringstidspunkt)}
            </Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdering
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdert av
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdert dato
                        </Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {saksbehandlerUiKodeverk.map((vilkårUiInfo) => {
                        const vilkårInfo = getVilkårInfo(vilkårUiInfo.vilkårskode);
                        const vurdering = findVurderingForVilkår(vilkårUiInfo.vilkårskode, vurderinger);
                        const status = getVurderingStatus(vurdering?.vurderingskode, vilkårUiInfo.vilkårskode);

                        if (!vilkårInfo) {
                            return null;
                        }
                        if (isLoading) {
                            return (
                                <Table.ExpandableRow
                                    key={vilkårUiInfo.vilkårskode}
                                    content={<></>}
                                    togglePlacement="right"
                                    expandOnRowClick
                                >
                                    <HStack as={Table.DataCell} gap="space-12">
                                        <Skeleton width={24} height={24} />
                                        <Skeleton variant="text" width="200px" />
                                    </HStack>
                                    <Table.DataCell>
                                        <Skeleton variant="text" width="40px" />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Skeleton variant="text" width="40px" />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Skeleton variant="text" width="40px" />
                                    </Table.DataCell>
                                </Table.ExpandableRow>
                            );
                        }
                        return (
                            <Vilkår
                                key={vilkårUiInfo.vilkårskode}
                                vilkårskode={vilkårUiInfo.vilkårskode}
                                periode={periode}
                                vilkår={{
                                    vilkår: vilkårInfo.beskrivelse,
                                    lovreferanse: vilkårInfo.paragrafTag,
                                    lovdatalenke: {
                                        href: '#',
                                        lenketekst: `Folketrygdloven ${vilkårInfo.paragrafTag}`,
                                    },
                                }}
                                rawVurdering={vurdering}
                                vurdering={
                                    status !== 'IkkeVurdert'
                                        ? {
                                              status: status as 'Oppfylt' | 'IkkeOppfylt',
                                              vurdertAv: getVurdertAv(vurdering) ?? '–',
                                              vurdertDato: getVurdertDato(vurdering) ?? '–',
                                          }
                                        : undefined
                                }
                            />
                        );
                    })}
                </Table.Body>
            </Table>
        </VStack>
    );
}

interface Vilkår {
    vilkår: string;
    lovreferanse: string;
    lovdatalenke: { href: string; lenketekst: string };
}

type VilkårStatus = 'Oppfylt' | 'IkkeOppfylt' | 'IkkeVurdert';
interface Vurdering {
    status: 'Oppfylt' | 'IkkeOppfylt';
    vurdertAv: string;
    vurdertDato: string;
}

interface VilkårProps {
    vilkår: Vilkår;
    vurdering?: Vurdering;
    rawVurdering?: Automatisk | Manuell;
}

function Vilkår({
    vilkår,
    vurdering,
    vilkårskode,
    periode,
    rawVurdering,
}: VilkårProps & { vilkårskode: string; periode: BeregnetPeriode }) {
    const [erÅpen, setErÅpen] = useState(false);
    return (
        <Table.ExpandableRow
            content={
                <VilkårContent vilkår={vilkår} vilkårskode={vilkårskode} vurdering={rawVurdering} periode={periode} />
            }
            togglePlacement="right"
            className={cn({ 'bg-ax-bg-accent-moderate': erÅpen })}
            contentGutter="none"
            expandOnRowClick
            onOpenChange={setErÅpen}
        >
            <HStack as={Table.DataCell} gap="space-12">
                <VilkårStatusIkon status={vurdering?.status ?? 'IkkeVurdert'} />
                <BodyShort>
                    {vilkår.lovreferanse} {vilkår.vilkår}
                </BodyShort>
            </HStack>
            <Table.DataCell>{getVilkårStatusVisningstekst(vurdering?.status)}</Table.DataCell>
            <Table.DataCell>{vurdering?.vurdertAv ?? '–'}</Table.DataCell>
            <Table.DataCell>{vurdering?.vurdertDato ?? '–'}</Table.DataCell>
        </Table.ExpandableRow>
    );
}

function getVilkårStatusVisningstekst(status: VilkårStatus | undefined): string {
    switch (status) {
        case 'Oppfylt':
            return 'Oppfylt';
        case 'IkkeOppfylt':
            return 'Ikke oppfylt';
        case 'IkkeVurdert':
            return 'Ikke vurdert';
    }
    return '';
}

function UnderspørsmålRadioGroup({
    underspørsmål,
    vilkårskode,
    parentFieldName,
    control,
}: {
    underspørsmål: Underspørsmål[];
    vilkårskode: string;
    parentFieldName: string;
    control: Control<FieldValues>;
}) {
    return (
        <VStack gap="space-16">
            {underspørsmål.map((spørsmål) => (
                <div key={spørsmål.kode}>
                    <Controller
                        name={`${parentFieldName}_${spørsmål.kode}_vurderingskode`}
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                legend={spørsmål.navn || 'Velg svar'}
                                size="small"
                                {...field}
                                value={field.value || ''}
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                            >
                                {spørsmål.alternativer.map((alternativ) => (
                                    <div key={alternativ.kode}>
                                        <Radio value={alternativ.kode}>{alternativ.navn}</Radio>
                                        {alternativ.harUnderspørsmål &&
                                            field.value === alternativ.kode &&
                                            alternativ.underspørsmål.length > 0 && (
                                                <Box paddingInline="space-32" paddingBlock="space-8">
                                                    <UnderspørsmålRadioGroup
                                                        underspørsmål={alternativ.underspørsmål}
                                                        vilkårskode={vilkårskode}
                                                        parentFieldName={`${parentFieldName}_${spørsmål.kode}_${alternativ.kode}`}
                                                        control={control}
                                                    />
                                                </Box>
                                            )}
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                    />
                </div>
            ))}
        </VStack>
    );
}

function VilkårContent({
    vilkår,
    vilkårskode,
    vurdering,
    periode,
}: {
    vilkår: Vilkår;
    vilkårskode: string;
    vurdering: (Automatisk | Manuell) | undefined;
    periode: BeregnetPeriode;
}) {
    return (
        <Box
            borderWidth="1 0 0"
            borderColor="neutral-subtle"
            background="accent-moderate"
            className="-mt-4 -mr-2 -mb-4 -ml-2"
        >
            <VStack paddingInline="space-44" paddingBlock="space-12" gap="space-20">
                <Link href={vilkår.lovdatalenke.href}>{vilkår.lovdatalenke.lenketekst}</Link>
                <VilkårForm vilkårskode={vilkårskode} periode={periode} initialAssessment={vurdering} />
                <Endringslogg vilkårskode={vilkårskode} skjaeringstidspunkt={periode.skjaeringstidspunkt} />
            </VStack>
        </Box>
    );
}

// Traverserer underspørsmål-treet og finner field-path for en gitt vurderingskode.
// Returnerer Record<fieldName, value> for alle nivåer i stien.
function finnDefaultVerdier(
    underspørsmål: Underspørsmål[],
    vurderingskode: string,
    parentFieldName: string,
): Record<string, string> | null {
    for (const spørsmål of underspørsmål) {
        const fieldName = `${parentFieldName}_${spørsmål.kode}_vurderingskode`;

        for (const alternativ of spørsmål.alternativer) {
            if (alternativ.kode === vurderingskode) {
                return { [fieldName]: alternativ.kode };
            }

            if (alternativ.harUnderspørsmål && alternativ.underspørsmål.length > 0) {
                const nestedResult = finnDefaultVerdier(
                    alternativ.underspørsmål,
                    vurderingskode,
                    `${parentFieldName}_${spørsmål.kode}_${alternativ.kode}`,
                );
                if (nestedResult) {
                    return { [fieldName]: alternativ.kode, ...nestedResult };
                }
            }
        }
    }
    return null;
}

interface VilkårFormProps {
    vilkårskode: string;
    periode: BeregnetPeriode;
    initialAssessment?: Automatisk | Manuell;
}

function VilkårForm({ vilkårskode, periode, initialAssessment }: VilkårFormProps) {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const vilkårUiInfo = saksbehandlerUiKodeverk.find((v) => v.vilkårskode === vilkårskode);
    const postMutation = usePostVurderteInngangsvilkårForPerson({
        mutation: {
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: getGetVurderteInngangsvilkårForPersonQueryKey(
                        personPseudoId,
                        periode.skjaeringstidspunkt,
                    ),
                });
            },
        },
    });

    const defaultBegrunnelse =
        initialAssessment?.type === 'MANUELL' ? initialAssessment.manuellVurdering?.begrunnelse || '' : '';

    const fieldDefaults = useMemo(() => {
        if (!vilkårUiInfo || !initialAssessment?.vurderingskode) return {};
        const result = finnDefaultVerdier(
            vilkårUiInfo.underspørsmål,
            initialAssessment.vurderingskode,
            `vilkår_${vilkårskode}`,
        );

        return result ?? {};
    }, [vilkårUiInfo, initialAssessment, vilkårskode]);

    const form = useForm({
        defaultValues: {
            ...fieldDefaults,
            [`vilkår_${vilkårskode}_begrunnelse`]: defaultBegrunnelse,
        },
    });

    useEffect(() => {
        const resetValues = {
            ...fieldDefaults,
            [`vilkår_${vilkårskode}_begrunnelse`]: defaultBegrunnelse,
        };
        form.reset(resetValues);
    }, [fieldDefaults, defaultBegrunnelse, vilkårskode, form]);

    const handleSubmit = async (data: FieldValues) => {
        // Finn den dypeste vurderingskode-verdien (bladnoden i treet)
        const vurderingskodeFields = Object.entries(data).filter(
            ([key, value]) => key.endsWith('_vurderingskode') && value,
        );
        const leafVurderingskode = vurderingskodeFields.at(-1)?.[1] as string | undefined;
        const begrunnelse = data[`vilkår_${vilkårskode}_begrunnelse`];

        if (!leafVurderingskode) {
            return;
        }

        const vurdering: ApiManuellInngangsvilkårVurdering = {
            vilkårskode,
            vurderingskode: leafVurderingskode,
            begrunnelse: begrunnelse || '',
        };

        await postMutation.mutateAsync({
            pseudoId: personPseudoId,
            skjaeringstidspunkt: periode.skjaeringstidspunkt,
            data: {
                versjon: 0,
                vurderinger: [vurdering],
            },
        });
    };

    if (!vilkårUiInfo) {
        return null;
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" onSubmit={form.handleSubmit(handleSubmit)} gap="space-20" maxWidth="522px">
                {vilkårUiInfo.underspørsmål.length > 0 ? (
                    <UnderspørsmålRadioGroup
                        underspørsmål={vilkårUiInfo.underspørsmål}
                        vilkårskode={vilkårskode}
                        parentFieldName={`vilkår_${vilkårskode}`}
                        control={form.control}
                    />
                ) : (
                    <RadioGroup legend="Er vilkåret oppfylt?" size="small">
                        <Radio value="ja">Ja</Radio>
                        <Radio value="nei">Nei</Radio>
                    </RadioGroup>
                )}

                <Controller
                    name={`vilkår_${vilkårskode}_begrunnelse`}
                    control={form.control}
                    render={({ field }) => (
                        <Textarea
                            label="Utvidet begrunnelse"
                            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                            {...field}
                            value={field.value || ''}
                        />
                    )}
                />

                <Button type="submit" size="small" loading={postMutation.isPending}>
                    Lagre vurdering
                </Button>

                {postMutation.isError && (
                    <LocalAlert status="error" size="small">
                        <LocalAlert.Title>Feil ved lagring</LocalAlert.Title>
                        <LocalAlert.Content>Kunne ikke lagre vurderingen. Prøv igjen.</LocalAlert.Content>
                    </LocalAlert>
                )}
            </VStack>
        </FormProvider>
    );
}

function Endringslogg({ vilkårskode, skjaeringstidspunkt }: { vilkårskode: string; skjaeringstidspunkt: string }) {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: samlingAvVurderinger } = useGetVurderteInngangsvilkårForPerson(personPseudoId, skjaeringstidspunkt);

    const historikk = useMemo(() => {
        if (!samlingAvVurderinger?.length) return [];
        const seenIds = new Set<string>();
        return samlingAvVurderinger
            .flatMap((samling) => {
                const vurdering = samling.vurderteInngangsvilkår?.find((v) => v.vilkårskode === vilkårskode);
                return vurdering ? [vurdering] : [];
            })
            .filter((vurdering) => {
                if (seenIds.has(vurdering.id)) return false;
                seenIds.add(vurdering.id);
                return true;
            })
            .sort((a, b) => new Date(b.tidspunkt).getTime() - new Date(a.tidspunkt).getTime());
    }, [samlingAvVurderinger, vilkårskode]);

    return (
        <Box borderWidth="1 0 0" paddingBlock="space-20" borderColor="neutral" paddingInline="space-8">
            <Heading size="xsmall">Endringslogg:</Heading>
            <Table size="small" zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdert dato
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdering
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Utvidet begrunnelse
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Kilde
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {historikk.map((vurdering, index) => (
                        <Table.Row key={index}>
                            <Table.DataCell>{getFormattedDatetimeString(vurdering.tidspunkt)}</Table.DataCell>
                            <Table.DataCell>
                                {getVilkårStatusVisningstekst(
                                    getVurderingStatus(vurdering.vurderingskode, vilkårskode) as VilkårStatus,
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {vurdering.type === 'MANUELL' ? vurdering.manuellVurdering?.begrunnelse : ''}
                            </Table.DataCell>
                            <Table.DataCell>
                                {vurdering.type === 'MANUELL' ? vurdering.manuellVurdering?.navident : 'Automatisk'}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Box>
    );
}

function VilkårStatusIkon({ status }: { status: VilkårStatus }) {
    switch (status) {
        case 'Oppfylt':
            return <CheckmarkCircleFillIcon fontSize="1.5rem" className="text-ax-text-success-decoration" />;
        case 'IkkeOppfylt':
            return <XMarkOctagonFillIcon fontSize="1.5rem" className="text-ax-text-danger-decoration" />;
        case 'IkkeVurdert':
            return <ExclamationmarkTriangleFillIcon fontSize="1.5rem" className="text-ax-text-warning-decoration" />;
    }
}

interface InngangsvilkårNyProps {
    periode: BeregnetPeriode;
}

export function InngangsvilkårNy({ periode }: InngangsvilkårNyProps): ReactElement {
    return (
        <ErrorBoundary fallback={inngangsvilkårError}>
            <InngangsvilkårContainer periode={periode} />
        </ErrorBoundary>
    );
}

function inngangsvilkårError(error: Error): ReactElement {
    return (
        <Box marginBlock="space-16" marginInline="space-16">
            <LocalAlert status="error" size="small">
                <LocalAlert.Header>
                    <LocalAlert.Title>Kan ikke vise inngangsvilkår</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    <VStack gap="space-8">
                        <BodyShort>Det skjedde en feil som gjorde at vi ikke kan vise inngangsvilkår.</BodyShort>
                        <VStack>
                            <BodyShort>Feilmelding:</BodyShort>
                            <Box
                                borderWidth="0 0 0 2"
                                borderColor="neutral-subtle"
                                paddingInline="space-4 space-0"
                                marginInline="space-2 space-0"
                            >
                                <BodyShort>{error.message}</BodyShort>
                            </Box>
                        </VStack>
                    </VStack>
                </LocalAlert.Content>
            </LocalAlert>
        </Box>
    );
}
