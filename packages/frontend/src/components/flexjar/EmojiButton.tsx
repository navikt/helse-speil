import styles from './EmojiButton.module.scss';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

export interface EmojiButtonProps {
    feedback: number;
    children: ReactNode;
    text: string;
    className: string;
    activeState: number | string | null;
    setThanksFeedback: (b: boolean) => void;
    setActiveState: (s: number | string | null) => void;
}

export const EmojiButton = (props: EmojiButtonProps) => {
    const isActive = props.activeState === props.feedback;

    const handleOnClick = () => {
        props.setThanksFeedback(false);
        if (isActive) {
            props.setActiveState(null);
        } else {
            props.setActiveState(props.feedback);
        }
    };

    return (
        <button
            type="button"
            aria-pressed={isActive}
            className={classNames(styles.button, props.className)}
            onClick={handleOnClick}
        >
            {props.children}
            <BodyShort className="cursor-pointer">{props.text}</BodyShort>
        </button>
    );
};
