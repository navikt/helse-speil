import React, { ReactElement, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Box, Button, ErrorSummary, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { TimeoutModal } from '@components/TimeoutModal';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { overlapper } from '@state/selectors/period';
import { DateString } from '@typer/shared';

import {
    getGjeldendeFom,
    getGjeldendeTom,
    getOverlappendeArbeidsgivere,
    getOverlappendeOverstyringFraAnnenPeriode,
    usePostOverstyringMinimumSykdomsgrad,
} from './minimumSykdomsgrad';

import styles from './MinimumSykdomsgrad.module.scss';

interface MinimumSykdomsgradFormProps {
    person: PersonFragment;
    fom: DateString;
    tom: DateString;
    periode: BeregnetPeriodeFragment;
    setOverstyrerMinimumSykdomsgrad: (overstyrer: boolean) => void;
}

export const MINIMUM_SYKDOMSGRAD_INNVILGELSE_TEKST = 'Ja, tap av arbeidstid er på 20 % eller mer (innvilgelse)';
export const MINIMUM_SYKDOMSGRAD_AVSLAG_TEKST = 'Nei, tap av arbeidstid er under 20 % (avslag)';

export const MinimumSykdomsgradForm = ({
    person,
    fom,
    tom,
    periode,
    setOverstyrerMinimumSykdomsgrad,
}: MinimumSykdomsgradFormProps): ReactElement => {
    const { isLoading, error, postMinimumSykdomsgrad, timedOut, setTimedOut } = usePostOverstyringMinimumSykdomsgrad(
        () => setOverstyrerMinimumSykdomsgrad(false),
    );
    const form = useForm();
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const { ...merEnn20Validation } = form.register('MerEnn20', { required: 'Må velge et alternativ' });

    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, periode);
    const overlappendeOverstyringFraAnnenPeriode = getOverlappendeOverstyringFraAnnenPeriode(person, periode);
    const gjeldendeFom = getGjeldendeFom(overlappendeOverstyringFraAnnenPeriode, fom);
    const gjeldendeTom = getGjeldendeTom(overlappendeOverstyringFraAnnenPeriode, tom);

    const submitForm = () => {
        const skjemaverdier = form.getValues();
        postMinimumSykdomsgrad({
            aktørId: person.aktorId,
            fødselsnummer: person.fodselsnummer,
            fom: gjeldendeFom,
            tom: gjeldendeTom,
            vurdering: skjemaverdier.MerEnn20 === 'Ja',
            begrunnelse: skjemaverdier.Begrunnelse,
            arbeidsgivere: overlappendeArbeidsgivere.map((it) => {
                return {
                    organisasjonsnummer: it.organisasjonsnummer,
                    berørtVedtaksperiodeId: it.generasjoner[0].perioder.find(overlapper(periode))?.vedtaksperiodeId!!,
                };
            }),
            initierendeVedtaksperiodeId: periode.vedtaksperiodeId,
        });
    };

    return (
        <Box
            background="surface-subtle"
            as="article"
            padding="8"
            style={{ margin: '-1.5rem', marginTop: '-5.5rem', marginBottom: '1rem' }}
        >
            <Heading size="xsmall" spacing>
                Vurder arbeidstid
            </Heading>
            <form className={styles.form} onSubmit={form.handleSubmit(submitForm)}>
                <RadioGroup
                    className={styles.radiogroup}
                    legend="Er arbeidsevnen nedsatt med minst 20 % basert på arbeidstid?"
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
                <Textarea
                    {...form.register('Begrunnelse', { required: 'Begrunnelse kan ikke være tom' })}
                    className={styles.fritekst}
                    label={<span className={styles.fritekstlabel}>Begrunnelse</span>}
                    description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                    error={form.formState.errors.Begrunnelse?.message as string}
                    resize
                />
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
                <span className={styles.buttons}>
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
                </span>
                {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}
                {timedOut && <TimeoutModal showModal={timedOut} onClose={() => setTimedOut(false)} />}
            </form>
        </Box>
    );
};
