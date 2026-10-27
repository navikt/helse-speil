import React, { ReactElement, useState } from 'react';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { ÅrsakForOverstyring } from '@typer/overstyring';

import { BrukArbeidsforholdILikevelDialog } from './BrukArbeidsforholdILikevelDialog';
import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './overstyrArbeidsforholdHooks';

interface AngreOverstyrArbeidsforholdUtenSykdomProps {
    person: ApiSaksbildePerson;
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
    const [open, setOpen] = useState(false);
    const getOverstyrtArbeidsforhold = useGetOverstyrtArbeidsforhold(person);
    const { postOverstyring } = usePostOverstyrtArbeidsforhold(person.aktorId);
    const årsak: ÅrsakForOverstyring = {
        id: '',
        forklaring: 'Angret å ikke bruke det i beregningen',
    };
    const overstyrtArbeidsforhold = getOverstyrtArbeidsforhold(
        organisasjonsnummerAktivPeriode,
        skjæringstidspunkt,
        false,
        'Saksbehandler angret å deaktivere arbeidsforholdet i beregningen',
        årsak,
    );
    return (
        <>
            <VisHvisSkrivetilgang>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    onClick={() => setOpen(true)}
                    icon={<ArrowUndoIcon aria-hidden />}
                >
                    Bruk arbeidsforholdet i beregningen likevel
                </Button>
            </VisHvisSkrivetilgang>
            <BrukArbeidsforholdILikevelDialog
                open={open}
                onOpenChange={setOpen}
                onApprove={() => {
                    onClick();
                    postOverstyring(overstyrtArbeidsforhold);
                }}
            />
        </>
    );
};
