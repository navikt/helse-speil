import React, { ReactElement, useEffect, useRef } from 'react';
import {
    CustomElement,
    FieldErrors,
    FieldValues,
    FormProvider,
    useController,
    useForm,
    useFormContext,
} from 'react-hook-form';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage, HStack, Heading, Table, Textarea, VStack } from '@navikt/ds-react';

import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { TimeoutModal } from '@components/TimeoutModal';
import { ArbeidsgiverFragment, Maybe, PersonFragment } from '@io/graphql';
import { DelperiodeWrapper } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/DelperiodeWrapper';
import { overlapper } from '@state/selectors/period';
import { MinimumSykdomsgradPeriode } from '@typer/overstyring';
import { ActivePeriod, DatePeriod } from '@typer/shared';

import { useGetNotatTekst, usePostOverstyringMinimumSykdomsgrad, useReplaceNotat } from './minimumSykdomsgrad';

import styles from './MinimumSykdomsgrad.module.scss';

interface MinimumSykdomsgradFormFields {
    merEnn20periode: Record<string, 'Ja' | 'Nei'>;
    begrunnelse: string;
}

interface MinimumSykdomsgradFormProps {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
    oppkuttedePerioder: Maybe<DatePeriod[]>;
    overlappendeArbeidsgivere: ArbeidsgiverFragment[];
    initierendeVedtaksperiodeId: string;
    setOverstyrerMinimumSykdomsgrad: (overstyrer: boolean) => void;
}

export const MinimumSykdomsgradForm = ({
    person,
    aktivPeriode,
    oppkuttedePerioder,
    overlappendeArbeidsgivere,
    initierendeVedtaksperiodeId,
    setOverstyrerMinimumSykdomsgrad,
}: MinimumSykdomsgradFormProps): ReactElement => {
    const { isLoading, error, postMinimumSykdomsgrad, timedOut, setTimedOut } = usePostOverstyringMinimumSykdomsgrad(
        () => setOverstyrerMinimumSykdomsgrad(false),
    );
    const form = useForm<MinimumSykdomsgradFormFields>();
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);

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
            begrunnelse: skjemaverdier.begrunnelse,
            arbeidsgivere: overlappendeArbeidsgivere.map((arbeidsgiver) => {
                const berørtVedtaksperiodeId = arbeidsgiver.generasjoner[0]?.perioder.find(
                    overlapper(aktivPeriode),
                )?.vedtaksperiodeId;
                if (berørtVedtaksperiodeId == undefined)
                    throw new Error(
                        'Mangler berørt vedtaksperiodeId for arbeidsgiver: ' + arbeidsgiver.organisasjonsnummer,
                    );
                return {
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    berørtVedtaksperiodeId: berørtVedtaksperiodeId,
                };
            }),
            initierendeVedtaksperiodeId: initierendeVedtaksperiodeId,
        });
    };

    return (
        <Box background={'surface-subtle'} as="article" padding="4">
            <HStack gap="2" paddingBlock="0 3">
                <Heading size="small">Arbeidstidsvurdering</Heading>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<XMarkIcon />}
                    onClick={() => setOverstyrerMinimumSykdomsgrad(false)}
                >
                    Avbryt
                </Button>
            </HStack>
            <FormProvider {...form}>
                <form className={styles.form} onSubmit={form.handleSubmit(submitForm)}>
                    <Innledning />
                    <DelperiodeTabell
                        oppkuttedePerioder={oppkuttedePerioder}
                        aktivPeriode={aktivPeriode}
                        person={person}
                    />
                    <NotatTilBeslutter vedtaksperiodeId={initierendeVedtaksperiodeId} />
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
                    {timedOut && <TimeoutModal showModal={timedOut} closeModal={() => setTimedOut(false)} />}
                </form>
            </FormProvider>
        </Box>
    );
};

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

const formErrorsTilFeilliste = (errors: FieldErrors<MinimumSykdomsgradFormFields>): Skjemafeil[] =>
    Object.entries(errors)
        .map(([id, error]) => ({
            id: (error?.ref as RefMedId)?.id ?? id,
            melding:
                error.message?.toString() ??
                (Object.entries(error).length > 0 ? 'Du må gi en vurdering i alle periodene' : id),
        }))
        .flat();

interface DelperiodeTabellProps {
    oppkuttedePerioder: Maybe<DatePeriod[]>;
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
}

const DelperiodeTabell = ({ oppkuttedePerioder, person, aktivPeriode }: DelperiodeTabellProps) => (
    <Table size="small" zebraStripes>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {oppkuttedePerioder?.map((delperiode) => (
                <DelperiodeWrapper
                    key={delperiode.fom}
                    person={person}
                    aktivPeriode={aktivPeriode}
                    delperiode={delperiode}
                />
            ))}
        </Table.Body>
    </Table>
);

const Innledning = () => (
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
);

interface NotatTilBeslutterProps {
    vedtaksperiodeId: string;
}

const NotatTilBeslutter = ({ vedtaksperiodeId }: NotatTilBeslutterProps) => {
    const replaceNotat = useReplaceNotat();
    const lagretNotat = useGetNotatTekst(vedtaksperiodeId) ?? '';
    const { control, setValue } = useFormContext();
    const { field, fieldState } = useController({
        control: control,
        name: 'begrunnelse',
        rules: {
            required: 'Begrunnelse kan ikke være tom',
            validate: {
                måFyllesUt: () => lagretNotat.length !== 0 || 'Begrunnelse kan ikke være tom',
            },
        },
        defaultValue: lagretNotat,
        shouldUnregister: true,
    });

    useEffect(() => {
        setValue('begrunnelse', lagretNotat);
    }, [lagretNotat, setValue]);

    return (
        <Textarea
            {...field}
            className={styles.fritekst}
            label={<span className={styles.fritekstlabel}>Notat til beslutter</span>}
            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
            error={fieldState?.error?.message as string}
            onChange={(e) => {
                field.onChange(e);
                replaceNotat({
                    vedtaksperiodeId: vedtaksperiodeId,
                    tekst: e.target.value,
                });
            }}
            value={lagretNotat}
            resize
        />
    );
};
