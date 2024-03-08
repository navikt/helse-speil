import React, { useState } from 'react';

import { BeregnetPeriode } from '@io/graphql';
import { useActivePeriod } from '@state/periode';

import { FeedbackButton, FlexjarFelles } from './FlexjarFelles';

interface TilbakemeldingProps {
    feedbackId: string;
    tittel: string;
    sporsmal: string;
}

export const Tilbakemelding = ({ feedbackId, tittel, sporsmal }: TilbakemeldingProps) => {
    const [activeState, setActiveState] = useState<string | number | null>(null);
    const [thanksFeedback, setThanksFeedback] = useState<boolean>(false);
    const vedtaksperiodeId = (useActivePeriod() as BeregnetPeriode)?.vedtaksperiodeId;

    if (!vedtaksperiodeId) {
        return null;
    }

    const getPlaceholder = (): string => {
        switch (activeState) {
            case 'JA':
                return 'Er det noe du vil trekke frem? (valgfritt)';
            case 'NEI':
                return 'Hva er utfordringen din med dette spørsmålet?';
            case 'FORBEDRING':
                return 'Hva kan forbedres?';
            default:
                throw Error('Ugyldig tilbakemeldingstype');
        }
    };

    const feedbackButtonProps = {
        vedtaksperiodeId,
        activeState,
        setThanksFeedback,
        setActiveState,
    };

    return (
        <FlexjarFelles
            feedbackId={feedbackId}
            setActiveState={setActiveState}
            activeState={activeState}
            thanksFeedback={thanksFeedback}
            setThanksFeedback={setThanksFeedback}
            getPlaceholder={getPlaceholder}
            feedbackProps={{
                vedtaksperiodeId: vedtaksperiodeId,
            }}
            textRequired={activeState === 'FORBEDRING' || activeState === 'NEI'}
            flexjartittel={tittel}
            flexjarsporsmal={sporsmal}
        >
            <div>
                <FeedbackButton feedbackId={feedbackId} tekst="Ja" svar="JA" {...feedbackButtonProps} />
                <FeedbackButton feedbackId={feedbackId} tekst="Nei" svar="NEI" {...feedbackButtonProps} />
                <FeedbackButton
                    feedbackId={feedbackId}
                    tekst="Foreslå forbedring"
                    svar="FORBEDRING"
                    {...feedbackButtonProps}
                />
            </div>
        </FlexjarFelles>
    );
};
