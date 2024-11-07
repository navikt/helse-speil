import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

import styles from './EmojiButton.module.scss';

export interface EmojiButtonProps {
    feedback: number;
    children: ReactNode;
    text: string;
    className?: string;
    activeState: Maybe<number | string>;
    setThanksFeedback: (b: boolean) => void;
    setActiveState: (s: Maybe<number | string>) => void;
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
