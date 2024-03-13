import styles from './EmojiTilbakemelding.module.scss';
import React, { useState } from 'react';

import { EmojiButton } from './EmojiButton';
import { FlexjarFelles } from './FlexjarFelles';
import { Glad, Lei, Noytral, Sinna, VeldigGlad } from './emojies';

interface EmojiTilbakemeldingProps {
    feedbackId: string;
    textRequired?: boolean;
    sporsmal: string;
    tittel: string;
}

export const EmojiTilbakemelding = ({ feedbackId, tittel, sporsmal }: EmojiTilbakemeldingProps) => {
    const [activeState, setActiveState] = useState<number | string | null>(null);
    const [thanksFeedback, setThanksFeedback] = useState<boolean>(false);
    const feedbackButtonProps = {
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
            getPlaceholder={() => 'Fortell oss om din opplevelse (valgfritt)'}
            flexjarsporsmal={sporsmal}
            flexjartittel={tittel}
            feedbackProps={{ erOppgaveOversikt: false }}
        >
            <div className={styles.container}>
                <div className={styles.content}>
                    <EmojiButton feedback={1} text="Veldig dårlig" className={styles.sinna} {...feedbackButtonProps}>
                        <Sinna fill={activeState === 1 ? 'var(--a-red-100)' : undefined} />
                    </EmojiButton>
                    <EmojiButton feedback={2} text="Dårlig" className={styles.lei} {...feedbackButtonProps}>
                        <Lei fill={activeState === 2 ? 'var(--a-orange-100)' : undefined} />
                    </EmojiButton>
                    <EmojiButton feedback={3} text="Nøytral" className={styles.nøytral} {...feedbackButtonProps}>
                        <Noytral fill={activeState === 3 ? 'var(--a-blue-100)' : undefined} />
                    </EmojiButton>
                    <EmojiButton feedback={4} text="Bra" className={styles.glad} {...feedbackButtonProps}>
                        <Glad fill={activeState === 4 ? 'var(--a-green-100)' : undefined} />
                    </EmojiButton>
                    <EmojiButton
                        feedback={5}
                        text="Veldig bra"
                        className={styles['veldig-glad']}
                        {...feedbackButtonProps}
                    >
                        <VeldigGlad fill={activeState === 5 ? 'var(--a-green-200)' : undefined} />
                    </EmojiButton>
                </div>
            </div>
        </FlexjarFelles>
    );
};
