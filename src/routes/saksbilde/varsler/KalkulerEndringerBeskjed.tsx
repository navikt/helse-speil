import { ReactElement, useState } from 'react';

import { BodyShort, Button, ErrorMessage, HStack } from '@navikt/ds-react';

import { SlettLokaleEndringerDialog } from '@components/SlettLokaleEndringerDialog';
import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import { OverstyrtInntektOgRefusjon, useSlettLokaleOverstyringer } from '@state/overstyring';
import { useVisningenOppdateresValue } from '@state/visningenOppdateres';
import { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';

import { Beskjedboks } from './Beskjeder';
import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

interface KalkulerEndringerBeskjedProps {
    lokaleInntektoverstyringer: OverstyrtInntektOgRefusjon;
}

export const KalkulerEndringerBeskjed = ({
    lokaleInntektoverstyringer,
}: KalkulerEndringerBeskjedProps): ReactElement | null => {
    const slettLokaleOverstyringer = useSlettLokaleOverstyringer();
    const { isLoading, error, postOverstyring } = usePostOverstyrtInntektOgRefusjon();
    const [showModal, setShowModal] = useState(false);
    const antallRedigerteArbeidsgivere = lokaleInntektoverstyringer?.arbeidsgivere.length ?? 0;
    const visningenOppdateres = useVisningenOppdateresValue();

    return (
        <>
            <Beskjedboks grad="info">
                Endringene for sykepengegrunnlag må kalkuleres før du sender oppgaven til godkjenning.
                <HStack gap="space-16" align="center" marginBlock="space-12 space-0">
                    <ButtonKreverSkrivetilgang
                        size="small"
                        variant="primary"
                        type="button"
                        data-testid="kalkuler-button"
                        loading={isLoading}
                        onClick={() => postOverstyring(lokaleInntektoverstyringer as OverstyrtInntektOgRefusjonDTO)}
                    >
                        Kalkuler endringer ({antallRedigerteArbeidsgivere})
                    </ButtonKreverSkrivetilgang>
                    <Button
                        size="small"
                        variant="tertiary"
                        type="button"
                        data-testid="kalkuler-avbryt-button"
                        disabled={visningenOppdateres}
                        onClick={() => setShowModal(true)}
                    >
                        Forkast endringer ({antallRedigerteArbeidsgivere})
                    </Button>
                </HStack>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Beskjedboks>
            <SlettLokaleEndringerDialog
                heading="Er du sikker på at du vil forkaste endringene?"
                open={showModal}
                onOpenChange={setShowModal}
                onApprove={slettLokaleOverstyringer}
            >
                <BodyShort>
                    Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil endringene ikke bli lagret.
                </BodyShort>
            </SlettLokaleEndringerDialog>
        </>
    );
};
