import React, { ReactElement, useState } from 'react';

import { Alert, BodyShort, Button, ErrorMessage, HStack } from '@navikt/ds-react';

import { SlettLokaleEndringerModal } from '@components/SlettLokaleEndringerModal';
import { TimeoutModal } from '@components/TimeoutModal';
import { Maybe } from '@io/graphql';
import { useCalculatingValue } from '@state/calculating';
import { OverstyrtInntektOgRefusjon, useSlettLokaleOverstyringer } from '@state/overstyring';
import { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

import styles from './Saksbildevarsler.module.css';

interface KalkulerEndringerVarselProps {
    lokaleInntektoverstyringer: OverstyrtInntektOgRefusjon;
}

export const KalkulerEndringerVarsel = ({
    lokaleInntektoverstyringer,
}: KalkulerEndringerVarselProps): Maybe<ReactElement> => {
    const slettLokaleOverstyringer = useSlettLokaleOverstyringer();
    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntektOgRefusjon();
    const [showModal, setShowModal] = useState(false);
    const antallRedigerteArbeidsgivere = lokaleInntektoverstyringer?.arbeidsgivere.length ?? 0;
    const calculating = useCalculatingValue();

    return (
        <>
            <Alert className={styles.Varsel} variant="info">
                <BodyShort>
                    Endringene for sykepengegrunnlag må kalkuleres før du sender oppgaven til godkjenning.
                </BodyShort>
                <HStack gap="4" align="center" marginBlock="3 0">
                    <Button
                        size="small"
                        variant="primary"
                        type="button"
                        data-testid="kalkuler-button"
                        loading={isLoading}
                        onClick={() => postOverstyring(lokaleInntektoverstyringer as OverstyrtInntektOgRefusjonDTO)}
                    >
                        Kalkuler endringer ({antallRedigerteArbeidsgivere})
                    </Button>
                    <Button
                        size="small"
                        variant="tertiary"
                        type="button"
                        data-testid="kalkuler-avbryt-button"
                        disabled={calculating}
                        onClick={() => setShowModal(true)}
                    >
                        Forkast endringer ({antallRedigerteArbeidsgivere})
                    </Button>
                </HStack>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Alert>
            {timedOut && <TimeoutModal showModal={timedOut} closeModal={() => setTimedOut(false)} />}
            {showModal && (
                <SlettLokaleEndringerModal
                    heading="Er du sikker på at du vil forkaste endringene?"
                    showModal={showModal}
                    onApprove={() => {
                        slettLokaleOverstyringer();
                        setShowModal(false);
                    }}
                    closeModal={() => setShowModal(false)}
                >
                    <BodyShort>
                        Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil endringene ikke bli lagret.
                    </BodyShort>
                </SlettLokaleEndringerModal>
            )}
        </>
    );
};
