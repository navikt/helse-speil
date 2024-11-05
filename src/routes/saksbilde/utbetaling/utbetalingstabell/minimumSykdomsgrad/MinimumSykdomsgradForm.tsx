import dayjs from 'dayjs';
import React, { ReactElement, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { PadlockUnlockedIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    ErrorMessage,
    ErrorSummary,
    HStack,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { TimeoutModal } from '@components/TimeoutModal';
import { PersonFragment } from '@io/graphql';
import { overlapper } from '@state/selectors/period';
import { ActivePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT_LANG } from '@utils/date';

import { getOverlappendeArbeidsgivere, usePostOverstyringMinimumSykdomsgrad } from './minimumSykdomsgrad';

import styles from './MinimumSykdomsgrad.module.scss';

interface MinimumSykdomsgradFormProps {
    person: PersonFragment;
    periode: ActivePeriod;
    initierendeVedtaksperiodeId: string;
    setOverstyrerMinimumSykdomsgrad: (overstyrer: boolean) => void;
}

export const MINIMUM_SYKDOMSGRAD_INNVILGELSE_TEKST = 'Ja, tap av arbeidstid er på 20 % eller mer (innvilgelse)';
export const MINIMUM_SYKDOMSGRAD_AVSLAG_TEKST = 'Nei, tap av arbeidstid er under 20 % (avslag)';

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
    const merEnn20 = useWatch({ name: 'MerEnn20', control: form.control });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const { ...merEnn20Validation } = form.register('MerEnn20', { required: 'Må velge et alternativ' });

    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, periode);

    const submitForm = () => {
        const skjemaverdier = form.getValues();
        postMinimumSykdomsgrad({
            aktørId: person.aktorId,
            fødselsnummer: person.fodselsnummer,
            fom: periode.fom,
            tom: periode.tom,
            vurdering: skjemaverdier.MerEnn20 === 'Ja',
            begrunnelse: skjemaverdier.Begrunnelse,
            arbeidsgivere: overlappendeArbeidsgivere.map((it) => {
                return {
                    organisasjonsnummer: it.organisasjonsnummer,
                    berørtVedtaksperiodeId: it.generasjoner[0].perioder.find(overlapper(periode))?.vedtaksperiodeId!!,
                };
            }),
            initierendeVedtaksperiodeId: initierendeVedtaksperiodeId,
        });
    };

    const begrunnelseTittel = merEnn20 === 'Ja' ? 'Begrunnelse' : 'Begrunnelse til den sykmeldte';
    const begrunnelseInnledning =
        merEnn20 === 'Ja'
            ? 'Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn.'
            : 'Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»';

    return (
        <Box background="surface-subtle" as="article" padding="4">
            <VStack paddingBlock="0 3">
                <HStack gap="2">
                    <Heading size="small">Vurder arbeidstid for perioden</Heading>
                    <Button
                        size="xsmall"
                        variant="tertiary"
                        icon={<PadlockUnlockedIcon />}
                        onClick={() => setOverstyrerMinimumSykdomsgrad(false)}
                    >
                        Avbryt
                    </Button>
                </HStack>
                <Heading level="2" size="xsmall">
                    {dayjs(periode.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT_LANG)} –{' '}
                    {dayjs(periode.tom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT_LANG)}
                </Heading>
            </VStack>
            <form className={styles.form} onSubmit={form.handleSubmit(submitForm)}>
                <RadioGroup
                    className={styles.radiogroup}
                    legend={
                        <VStack>
                            <BodyShort weight="semibold">
                                Er arbeidsevnen nedsatt med minst 20 % basert på arbeidstid?
                            </BodyShort>
                            <BodyShort>Husk at arbeidstid må vurderes på tvers av alle arbeidsforhold</BodyShort>
                        </VStack>
                    }
                    error={form.formState.errors.MerEnn20?.message as string}
                    name="MerEnn20"
                    size="small"
                >
                    <Radio value="Ja" {...merEnn20Validation}>
                        {MINIMUM_SYKDOMSGRAD_INNVILGELSE_TEKST}
                    </Radio>
                    <Radio value="Nei" {...merEnn20Validation}>
                        {MINIMUM_SYKDOMSGRAD_AVSLAG_TEKST}
                    </Radio>
                </RadioGroup>
                {merEnn20 && (
                    <Textarea
                        {...form.register('Begrunnelse', { required: 'Begrunnelse kan ikke være tom' })}
                        className={styles.fritekst}
                        label={<span className={styles.fritekstlabel}>{begrunnelseTittel}</span>}
                        description={begrunnelseInnledning}
                        error={form.formState.errors.Begrunnelse?.message as string}
                        resize
                    />
                )}
                {!form.formState.isValid && form.formState.isSubmitted && (
                    <div className={styles.feiloppsummering}>
                        <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                            {Object.entries(form.formState.errors).map(([id, error]) => (
                                <ErrorSummary.Item key={id}>
                                    <>{error ? error.message : undefined}</>
                                </ErrorSummary.Item>
                            ))}
                        </ErrorSummary>
                    </div>
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
