import React, { useState } from 'react';

import { EmojiButton } from './EmojiButton';
import { FlexjarFelles } from './FlexjarFelles';
import { Glad, Lei, Noytral, Sinna, VeldigGlad } from './emojies';

import styles from './EmojiTilbakemelding.module.scss';

interface EmojiTilbakemeldingProps {
    feedbackId: string;
    textRequired?: boolean;
    tittel: string;
    feedbackProps: Record<string, string | string[] | boolean>;
}

export const EmojiTilbakemelding = ({ feedbackId, tittel, feedbackProps }: EmojiTilbakemeldingProps) => {
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
            getPlaceholder={() => 'Fortell oss om opplevelsen din (valgfritt)'}
            flexjartittel={tittel}
            feedbackProps={feedbackProps}
        >
            <div className={styles.container}>
                <div className={styles.content}>
                    <EmojiButton feedback={1} text="Veldig dårlig" className={styles.sinna} {...feedbackButtonProps}>
                        <Sinna fill={activeState === 1 ? 'var(--ax-danger-200)' : undefined} />
                    </EmojiButton>
                    <EmojiButton feedback={2} text="Dårlig" className={styles.lei} {...feedbackButtonProps}>
                        <Lei fill={activeState === 2 ? 'var(--ax-warning-200)' : undefined} />
                    </EmojiButton>
                    <EmojiButton feedback={3} text="Nøytral" className={styles.nøytral} {...feedbackButtonProps}>
                        <Noytral fill={activeState === 3 ? 'var(--ax-accent-200)' : undefined} />
                    </EmojiButton>
                    <EmojiButton feedback={4} text="Bra" className={styles.glad} {...feedbackButtonProps}>
                        <Glad fill={activeState === 4 ? 'var(--ax-success-200)' : undefined} />
                    </EmojiButton>
                    <EmojiButton
                        feedback={5}
                        text="Veldig bra"
                        className={styles['veldig-glad']}
                        {...feedbackButtonProps}
                    >
                        <VeldigGlad fill={activeState === 5 ? 'var(--ax-success-300)' : undefined} />
                    </EmojiButton>
                </div>
            </div>
        </FlexjarFelles>
    );
};
