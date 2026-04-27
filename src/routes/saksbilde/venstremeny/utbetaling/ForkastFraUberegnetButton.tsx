import React, { ReactElement, useState } from 'react';

import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { UberegnetPeriodeFragment } from '@io/graphql';
import { usePostAnmodOmForkasting } from '@io/rest/generated/vedtaksperioder/vedtaksperioder';

interface ForkastFraUberegnetButtonProps {
    activePeriod: UberegnetPeriodeFragment;
}

export const ForkastFraUberegnetButton = ({ activePeriod }: ForkastFraUberegnetButtonProps): ReactElement => {
    const { mutate, error, isPending } = usePostAnmodOmForkasting();
    const [forkastingAnmodet, setForkastingAnmodet] = useState(false);

    const submit = () => {
        mutate(
            {
                vedtaksperiodeId: activePeriod.vedtaksperiodeId,
                data: {
                    fødselsnummer: 'dummy',
                    vedtaksperiodeId: activePeriod.vedtaksperiodeId,
                    organisasjonsnummer: 'dummy',
                    yrkesaktivitetstype: 'dummy',
                },
            },
            {
                onSuccess: () => {
                    setForkastingAnmodet(true);
                },
            },
        );
    };

    return (
        <>
            {forkastingAnmodet ? (
                <BodyShort>Forkasting er anmodet</BodyShort>
            ) : isPending ? (
                <p>laster ..</p>
            ) : (
                <Button variant="secondary" size="small" onClick={submit}>
                    Kan ikke behandles her
                </Button>
            )}
            {error && <ErrorMessage className="px-6 pb-4">{error.message}</ErrorMessage>}
        </>
    );
};
