import styles from './AngreOverstyrArbeidsforholdUtenSykdom.module.scss';
import React, { ReactElement } from 'react';

import { Button } from '@components/Button';
import { TimeoutModal } from '@components/TimeoutModal';
import { PersonFragment } from '@io/graphql';
import { BegrunnelseForOverstyring } from '@typer/overstyring';

import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './overstyrArbeidsforholdHooks';

const UndoIcon = (): ReactElement => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.2187 8.60333C14.8513 6.408 13.6513 4.48667 11.84 3.194C10.04 1.90867 7.81 1.454 5.562 1.91133C3.98733 2.23267 2.514 3 1.33333 4.08533V1.16667C1.33333 0.798667 1.03467 0.5 0.666667 0.5C0.298 0.5 0 0.798667 0 1.16667V5.83333C0 6.202 0.298 6.5 0.666667 6.5H5.33333C5.70133 6.5 6 6.202 6 5.83333C6 5.46533 5.70133 5.16667 5.33333 5.16667H2.12533C3.14667 4.19067 4.44133 3.50067 5.82733 3.218C7.70933 2.83533 9.56933 3.21133 11.0647 4.27933C12.5867 5.36533 13.5947 6.97933 13.9033 8.82267C14.2113 10.6673 13.7827 12.5207 12.6967 14.0427C12.3687 14.5013 11.988 14.9193 11.564 15.2847C11.2853 15.5247 11.254 15.946 11.4947 16.2247C11.6267 16.3773 11.8133 16.4567 12 16.4567C12.154 16.4567 12.3093 16.4033 12.4347 16.2947C12.9393 15.8607 13.3927 15.3633 13.782 14.8173C15.0753 13.006 15.5853 10.7987 15.2187 8.60333Z"
            fill="#0067C5"
        />
    </svg>
);

interface AngreOverstyrArbeidsforholdUtenSykdomProps {
    person: PersonFragment;
    organisasjonsnummerAktivPeriode: string;
    skjæringstidspunkt: string;
    onClick: () => void;
}

export const AngreOverstyrArbeidsforholdUtenSykdom = ({
    person,
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    onClick,
}: AngreOverstyrArbeidsforholdUtenSykdomProps): ReactElement => {
    const getOverstyrtArbeidsforhold = useGetOverstyrtArbeidsforhold(person);
    const { postOverstyring, timedOut, setTimedOut } = usePostOverstyrtArbeidsforhold();
    const begrunnelse: BegrunnelseForOverstyring = {
        id: '',
        forklaring: 'Angret å ikke bruke det i beregningen',
    };
    const overstyrtArbeidsforhold = getOverstyrtArbeidsforhold(
        organisasjonsnummerAktivPeriode,
        skjæringstidspunkt,
        false,
        'Saksbehandler angret å deaktivere arbeidsforholdet i beregningen',
        begrunnelse,
    );
    return (
        <>
            <Button
                onClick={() => {
                    onClick();
                    postOverstyring(overstyrtArbeidsforhold);
                }}
                className={styles.angre}
            >
                <UndoIcon />
                Bruk arbeidsforholdet i beregningen likevel
            </Button>
            {timedOut && <TimeoutModal onRequestClose={() => setTimedOut(false)} />}
        </>
    );
};
