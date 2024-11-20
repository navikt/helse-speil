import React, { ReactElement, useRef } from 'react';
import { CustomElement, FieldErrors, FieldValues, FormProvider, useForm } from 'react-hook-form';

import { PadlockUnlockedIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage, HStack, Heading, Table, Textarea, VStack } from '@navikt/ds-react';

import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { TimeoutModal } from '@components/TimeoutModal';
import { PersonFragment } from '@io/graphql';
import { InntektFormFields } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import { Delperiode } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/Delperiode';
import { overlapper } from '@state/selectors/period';
import { MinimumSykdomsgradPeriode } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';

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
            <FormProvider {...form}>
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
                            {oppkuttedePerioder?.map((delperiode) => (
                                <Delperiode
                                    key={delperiode.fom}
                                    person={person}
                                    aktivPeriode={periode}
                                    delperiode={delperiode}
                                />
                            ))}
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
            </FormProvider>
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
