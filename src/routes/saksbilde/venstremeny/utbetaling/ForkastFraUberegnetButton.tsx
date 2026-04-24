import React, { ReactElement } from 'react';

import { Button } from '@navikt/ds-react';

import { UberegnetPeriodeFragment } from '@io/graphql';
import { usePostAnmodOmForkasting } from '@io/rest/generated/vedtaksperioder/vedtaksperioder';

interface ForkastFraUberegnetButtonProps {
    activePeriod: UberegnetPeriodeFragment;
}

export const ForkastFraUberegnetButton = ({ activePeriod }: ForkastFraUberegnetButtonProps): ReactElement => {
    const { mutate, error, isPending: loading } = usePostAnmodOmForkasting();

    const submit = () => {
        mutate({
            vedtaksperiodeId: activePeriod.vedtaksperiodeId,
            data: {
                fødselsnummer: 'dummy',
                vedtaksperiodeId: activePeriod.vedtaksperiodeId,
                organisasjonsnummer: 'dummy',
                yrkesaktivitetstype: 'dummy',
            },
        });
    };

    return error ? (
        <>
            <p>Noe gikk galt! Feilmelding:</p>
            <p>${error.message}</p>
        </>
    ) : loading ? (
        <p>laster</p>
    ) : (
        <Button variant="secondary" size="small" onClick={submit}>
            Kan ikke behandles her
        </Button>
    );
};
