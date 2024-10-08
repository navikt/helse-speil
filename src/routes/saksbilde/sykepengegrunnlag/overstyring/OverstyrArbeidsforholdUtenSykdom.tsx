import classNames from 'classnames';
import React, { ReactElement, useContext, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage, ErrorSummary } from '@navikt/ds-react';

import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { TimeoutModal } from '@components/TimeoutModal';
import { PersonFragment } from '@io/graphql';
import { VenterPåEndringContext } from '@saksbilde/VenterPåEndringContext';
import { BegrunnelseForOverstyring } from '@typer/overstyring';

import { Begrunnelser } from '../inntekt/Begrunnelser';
import { AngreOverstyrArbeidsforholdUtenSykdom } from './AngreOverstyrArbeidsforholdUtenSykdom';
import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './overstyrArbeidsforholdHooks';

import styles from './OverstyrArbeidsforholdUtenSykdom.module.scss';

interface OverstyrArbeidsforholdUtenSykdomProps {
    organisasjonsnummerAktivPeriode: string;
    skjæringstidspunkt: string;
    arbeidsforholdErDeaktivert: boolean;
    person: PersonFragment;
}

export const OverstyrArbeidsforholdUtenSykdom = ({
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    arbeidsforholdErDeaktivert,
    person,
}: OverstyrArbeidsforholdUtenSykdomProps) => {
    const [editingArbeidsforhold, setEditingArbeidsforhold] = useState(false);

    const tittel = arbeidsforholdErDeaktivert
        ? 'Bruk arbeidsforholdet i beregningen likevel'
        : 'Ikke bruk arbeidsforholdet i beregningen';

    const { venterPåEndringState, oppdaterVenterPåEndringState } = useContext(VenterPåEndringContext);

    const skalViseAngreknapp = venterPåEndringState.visAngreknapp && arbeidsforholdErDeaktivert;
    const skalViseOverstyr = venterPåEndringState.visOverstyrKnapp && !arbeidsforholdErDeaktivert;

    return (
        <div className={classNames(styles.formcontainer, editingArbeidsforhold && styles.editing)}>
            <div className={styles.header}>
                {editingArbeidsforhold && (
                    <div className={styles.tittelwrapper}>
                        <BodyShort as="h1" className={styles.tittel}>
                            {tittel}
                        </BodyShort>
                    </div>
                )}
                {skalViseAngreknapp && (
                    <AngreOverstyrArbeidsforholdUtenSykdom
                        person={person}
                        organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                        skjæringstidspunkt={skjæringstidspunkt}
                        onClick={() => oppdaterVenterPåEndringState({ visAngreknapp: false, visOverstyrKnapp: true })}
                    />
                )}
                {skalViseOverstyr &&
                    (editingArbeidsforhold ? (
                        <Button size="xsmall" variant="tertiary" onClick={() => setEditingArbeidsforhold(false)}>
                            Avbryt
                        </Button>
                    ) : (
                        <Button
                            size="xsmall"
                            variant="tertiary"
                            icon={<XMarkOctagonIcon />}
                            onClick={() => setEditingArbeidsforhold(true)}
                        >
                            Ikke bruk arbeidsforholdet i beregningen
                        </Button>
                    ))}
            </div>
            {editingArbeidsforhold && (
                <OverstyrArbeidsforholdSkjema
                    person={person}
                    onClose={() => setEditingArbeidsforhold(false)}
                    organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                    skjæringstidspunkt={skjæringstidspunkt}
                    onSubmit={() => oppdaterVenterPåEndringState({ visAngreknapp: true, visOverstyrKnapp: false })}
                />
            )}
        </div>
    );
};

interface OverstyrArbeidsforholdSkjemaProps {
    person: PersonFragment;
    onClose: () => void;
    organisasjonsnummerAktivPeriode: string;
    skjæringstidspunkt: string;
    onSubmit: () => void;
}

const begrunnelser: BegrunnelseForOverstyring[] = [
    {
        id: '0',
        forklaring: 'Avbrudd mer enn 14 dager (generell)',
        lovhjemmel: { paragraf: '8-15', lovverk: 'folketrygdloven', lovverksversjon: '1998-12-18' },
    },
    {
        id: '1',
        forklaring: 'Avbrudd mer enn 14 dager (tilkallingsvikar/sporadiske vakter)',
        lovhjemmel: { paragraf: '8-15', lovverk: 'folketrygdloven', lovverksversjon: '1998-12-18' },
    },
    {
        id: '2',
        forklaring: 'Arbeidsforhold opphørt',
        lovhjemmel: { paragraf: '8-15', lovverk: 'folketrygdloven', lovverksversjon: '1998-12-18' },
    },
    {
        id: '3',
        forklaring: 'Annet',
        lovhjemmel: { paragraf: '8-15', lovverk: 'folketrygdloven', lovverksversjon: '1998-12-18' },
    },
];

const OverstyrArbeidsforholdSkjema = ({
    person,
    onClose,
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    onSubmit,
}: OverstyrArbeidsforholdSkjemaProps): ReactElement => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const getOverstyrtArbeidsforhold = useGetOverstyrtArbeidsforhold(person);

    const { isLoading, error, timedOut, setTimedOut, postOverstyring } = usePostOverstyrtArbeidsforhold(
        person.aktorId,
        onClose,
    );

    const confirmChanges = () => {
        const { begrunnelseId, forklaring } = form.getValues();
        const begrunnelse = begrunnelser.find((begrunnelse) => begrunnelse.id === begrunnelseId);
        if (begrunnelse === undefined) {
            throw 'Mangler begrunnelse for overstyring av arbeidsforhold';
        }

        const overstyrtArbeidsforhold = getOverstyrtArbeidsforhold(
            organisasjonsnummerAktivPeriode,
            skjæringstidspunkt,
            true,
            forklaring,
            begrunnelse,
        );
        onSubmit();
        postOverstyring(overstyrtArbeidsforhold);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.container}>
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea
                        description={`Begrunn hvorfor inntekt ikke skal brukes i beregningen. \nTeksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.`}
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
                            Ferdig
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={onClose}>
                            Avbryt
                        </Button>
                    </span>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <TimeoutModal showModal={timedOut} onClose={() => setTimedOut(false)} />}
                </div>
            </form>
        </FormProvider>
    );
};
