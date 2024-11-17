import dayjs from 'dayjs';
import React, { ReactElement, useRef } from 'react';
import { CustomElement, FieldErrors, FieldValues, useForm } from 'react-hook-form';

import { PadlockUnlockedIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    ErrorMessage,
    HStack,
    Heading,
    Radio,
    RadioGroup,
    Table,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { TimeoutModal } from '@components/TimeoutModal';
import { PersonFragment } from '@io/graphql';
import { InntektFormFields } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import { overlapper } from '@state/selectors/period';
import { MinimumSykdomsgradPeriode } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    usePostOverstyringMinimumSykdomsgrad,
} from './minimumSykdomsgrad';

import styles from './MinimumSykdomsgrad.module.scss';

interface MinimumSykdomsgradFormProps {
    person: PersonFragment;
    periode: ActivePeriod;
    initierendeVedtaksperiodeId: string;
    setOverstyrerMinimumSykdomsgrad: (overstyrer: boolean) => void;
}

export const MINIMUM_SYKDOMSGRAD_INNVILGELSE_TEKST = 'Ja, tap av arbeidstid er på 20 % eller mer (innvilgelse)';
export const MINIMUM_SYKDOMSGRAD_AVSLAG_TEKST = 'Nei, tap av arbeidstid er under 20 % (avslag)';
export const MINIMUM_SYKDOMSGRAD_BEGRUNNELSE_INNLEDNING_AVSLAG = 'Begrunnelse til den sykmeldte';

export const MinimumSykdomsgradForm = ({
    person,
    periode,
    initierendeVedtaksperiodeId,
    setOverstyrerMinimumSykdomsgrad,
}: MinimumSykdomsgradFormProps): ReactElement => {
    const { isLoading, error, postMinimumSykdomsgrad, timedOut, setTimedOut } = usePostOverstyringMinimumSykdomsgrad(
        () => setOverstyrerMinimumSykdomsgrad(false),
    );
    const form = useForm();
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);

    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, periode);
    const oppkuttedePerioder = getOppkuttedePerioder(overlappendeArbeidsgivere, periode);

    const submitForm = () => {
        const skjemaverdier = form.getValues();

        const perioderVurdertOk: MinimumSykdomsgradPeriode[] = [];
        const perioderVurdertIkkeOk: MinimumSykdomsgradPeriode[] = [];

        Object.entries(skjemaverdier.merEnn20periode).map((key) => {
            const oppkuttetPeriode = oppkuttedePerioder?.find((periode) => periode.fom === key[0]);
            if (!oppkuttetPeriode) return;

            if (key[1] === 'Ja') {
                perioderVurdertOk.push(oppkuttetPeriode);
            } else {
                perioderVurdertIkkeOk.push(oppkuttetPeriode);
            }
        });

        postMinimumSykdomsgrad({
            aktørId: person.aktorId,
            fødselsnummer: person.fodselsnummer,
            perioderVurdertOk: perioderVurdertOk,
            perioderVurdertIkkeOk: perioderVurdertIkkeOk,
            begrunnelse: skjemaverdier.Begrunnelse,
            arbeidsgivere: overlappendeArbeidsgivere.map((it) => {
                return {
                    organisasjonsnummer: it.organisasjonsnummer,
                    berørtVedtaksperiodeId: it.generasjoner[0]?.perioder.find(overlapper(periode))?.vedtaksperiodeId!,
                };
            }),
            initierendeVedtaksperiodeId: initierendeVedtaksperiodeId,
        });
    };

    return (
        <Box background="surface-subtle" as="article" padding="4">
            <HStack gap="2" paddingBlock="0 3">
                <Heading size="small">Arbeidstidsvurdering</Heading>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<PadlockUnlockedIcon />}
                    onClick={() => setOverstyrerMinimumSykdomsgrad(false)}
                >
                    Avbryt
                </Button>
            </HStack>
            <form className={styles.form} onSubmit={form.handleSubmit(submitForm)}>
                <VStack marginBlock="0 4" width="675px">
                    <BodyShort weight="semibold">
                        Vurder om arbeidsevnen er nedsatt med minst 20 % basert på arbeidstid i disse periodene
                    </BodyShort>
                    <BodyShort>
                        Husk at arbeidstid må vurderes på tvers av alle arbeidsforhold. Ved{' '}
                        <BodyShort as="span" weight="semibold">
                            avslag
                        </BodyShort>{' '}
                        må det skrives en individuell begrunnelse i tillegg til notatet til beslutter.
                    </BodyShort>
                </VStack>
                <Table size="small" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {oppkuttedePerioder?.map((it) => {
                            const {
                                ref,
                                onChange: onChangeMerEnn20perioder,
                                ...merEnn20periodeValidation
                            } = form.register(`merEnn20periode.${it.fom}`, { required: 'Du må velge en vurdering' });
                            const harError =
                                form.formState.errors.merEnn20periode &&
                                (Object.entries(form.formState.errors.merEnn20periode).find(
                                    (errorPeriode) => errorPeriode[0] === it.fom,
                                )?.[1]?.message as string);

                            return (
                                <Table.Row key={it.fom} className={styles.zebrarad}>
                                    <Table.DataCell scope="col">
                                        {dayjs(it.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)} –{' '}
                                        {dayjs(it.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <RadioGroup
                                            legend="Perioder"
                                            error={harError}
                                            size="small"
                                            hideLegend
                                            {...merEnn20periodeValidation}
                                            onChange={() => {
                                                onChangeMerEnn20perioder;
                                                form.clearErrors(`merEnn20periode.${it.fom}`);
                                            }}
                                        >
                                            <HStack gap="8">
                                                <Radio value="Ja" size="small" {...merEnn20periodeValidation} ref={ref}>
                                                    Ja (innvilgelse)
                                                </Radio>
                                                <Radio
                                                    value="Nei"
                                                    size="small"
                                                    {...merEnn20periodeValidation}
                                                    ref={ref}
                                                >
                                                    Nei (avslag)
                                                </Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
                <Textarea
                    {...form.register('Begrunnelse', { required: 'Begrunnelse kan ikke være tom' })}
                    className={styles.fritekst}
                    label={<span className={styles.fritekstlabel}>Notat til beslutter</span>}
                    description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                    error={form.formState.errors.Begrunnelse?.message as string}
                    resize
                />
                {!form.formState.isValid && form.formState.isSubmitted && (
                    <Feiloppsummering
                        feiloppsummeringRef={feiloppsummeringRef}
                        feilliste={formErrorsTilFeilliste(form.formState.errors)}
                    />
                )}
                <HStack gap="2" align="center" marginBlock="6 0">
                    <Button size="small" variant="secondary" type="submit" loading={isLoading}>
                        Lagre
                    </Button>
                    <Button
                        size="small"
                        variant="tertiary"
                        type="button"
                        onClick={() => setOverstyrerMinimumSykdomsgrad(false)}
                    >
                        Avbryt
                    </Button>
                </HStack>
                {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}
                {timedOut && <TimeoutModal showModal={timedOut} onClose={() => setTimedOut(false)} />}
            </form>
        </Box>
    );
};

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

const formErrorsTilFeilliste = (errors: FieldErrors<InntektFormFields>): Skjemafeil[] =>
    Object.entries(errors)
        .map(([id, error]) => ({
            id: (error?.ref as RefMedId)?.id ?? id,
            melding:
                error.message ?? (Object.entries(error).length > 0 ? 'Du må gi en vurdering i alle periodene' : id),
        }))
        .flat();
