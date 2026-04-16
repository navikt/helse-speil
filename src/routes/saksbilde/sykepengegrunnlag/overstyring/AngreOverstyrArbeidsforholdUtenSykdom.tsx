import React, { ReactElement } from 'react';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { BegrunnelseForOverstyring } from '@typer/overstyring';

import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './overstyrArbeidsforholdHooks';

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
    const { postOverstyring } = usePostOverstyrtArbeidsforhold(person.aktorId);
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
                size="xsmall"
                variant="tertiary"
                onClick={() => {
                    onClick();
                    postOverstyring(overstyrtArbeidsforhold);
                }}
                icon={<ArrowUndoIcon />}
            >
                Bruk arbeidsforholdet i beregningen likevel
            </Button>
        </>
    );
};
