import styles from './OverstyrArbeidsforholdUtenSykdom.module.scss';
import { BegrunnelseForOverstyring } from './overstyring.types';
import classNames from 'classnames';
import React, { useContext, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Error } from '@navikt/ds-icons';
import { BodyShort, ErrorSummary, Loader, Button as NavButton } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';
import { ErrorMessage } from '@components/ErrorMessage';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { TimeoutModal } from '@components/TimeoutModal';
import { Maybe } from '@io/graphql';

import { VenterPåEndringContext } from '../../VenterPåEndringContext';
import { Begrunnelser } from '../inntekt/Begrunnelser';
import { AngreOverstyrArbeidsforholdUtenSykdom } from './AngreOverstyrArbeidsforholdUtenSykdom';
import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './overstyrArbeidsforholdHooks';

interface OverstyrArbeidsforholdUtenSykdomProps {
    organisasjonsnummerAktivPeriode: string;
    skjæringstidspunkt: string;
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
}

export const OverstyrArbeidsforholdUtenSykdom = ({
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    arbeidsforholdErDeaktivert,
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
                        organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                        skjæringstidspunkt={skjæringstidspunkt}
                        onClick={() => oppdaterVenterPåEndringState({ visAngreknapp: false, visOverstyrKnapp: true })}
                    />
                )}
                {skalViseOverstyr && (
                    <EditButton
                        isOpen={editingArbeidsforhold}
                        openText="Avbryt"
                        closedText="Ikke bruk arbeidsforholdet i beregningen"
                        onOpen={() => setEditingArbeidsforhold(true)}
                        onClose={() => setEditingArbeidsforhold(false)}
                        openIcon={<></>}
                        closedIcon={<Error />}
                    />
                )}
            </div>
            {editingArbeidsforhold && (
                <OverstyrArbeidsforholdSkjema
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
    onClose,
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    onSubmit,
}: OverstyrArbeidsforholdSkjemaProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const getOverstyrtArbeidsforhold = useGetOverstyrtArbeidsforhold();

    const { isLoading, error, timedOut, setTimedOut, postOverstyring } = usePostOverstyrtArbeidsforhold(onClose);

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
                        description={`Begrunn hvorfor inntekt ikke skal brukes i beregningen. \nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.`}
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
                        <NavButton as="button" disabled={isLoading} variant="secondary" className={styles.formbutton}>
                            Ferdig
                            {isLoading && <Loader size="xsmall" />}
                        </NavButton>
                        <NavButton
                            as="button"
                            disabled={isLoading}
                            variant="tertiary"
                            onClick={onClose}
                            className={styles.formbutton}
                        >
                            Avbryt
                        </NavButton>
                    </span>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <TimeoutModal onRequestClose={() => setTimedOut(false)} />}
                </div>
            </form>
        </FormProvider>
    );
};
