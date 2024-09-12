import React, { useState } from 'react';

import { Maybe } from '@io/graphql';

import { FeedbackButton, FlexjarFelles } from './FlexjarFelles';

interface TilbakemeldingProps {
    feedbackId: string;
    tittel: string;
    sporsmal: string;
    vedtaksperiodeId: string;
}

export const Tilbakemelding = ({ feedbackId, tittel, sporsmal, vedtaksperiodeId }: TilbakemeldingProps) => {
    const [activeState, setActiveState] = useState<Maybe<number | string>>(null);
    const [thanksFeedback, setThanksFeedback] = useState<boolean>(false);

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
                <FeedbackButton tekst="Ja" svar="JA" {...feedbackButtonProps} />
                <FeedbackButton tekst="Nei" svar="NEI" {...feedbackButtonProps} />
                <FeedbackButton tekst="Foreslå forbedring" svar="FORBEDRING" {...feedbackButtonProps} />
            </div>
        </FlexjarFelles>
    );
};
