import classNames from 'classnames';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { LinkButton } from '@components/LinkButton';
import { Simulering, Utbetaling } from '@io/graphql';

import { SimuleringView } from './SimuleringView';

import styles from './OpenSimuleringButton.module.css';

type CopyStyleAttributeOptions = {
    selector: string;
    from: WindowProxy;
    to: WindowProxy;
};

const copyStyleAttribute = ({ selector, from, to }: CopyStyleAttributeOptions): void => {
    const sourceStyle = from.document.querySelector(selector)?.getAttribute('style');

    if (sourceStyle) {
        to.document.querySelector(selector)?.setAttribute('style', sourceStyle);
    }
};

type CopyStylesheetsOptions = {
    from: WindowProxy;
    to: WindowProxy;
};

const isStylesheetLink = (node: Node): node is HTMLLinkElement => {
    return (node as HTMLLinkElement).rel === 'stylesheet';
};

// Dette funker ikke med vanlig dev-bygg fordi stilene ikke blir hentet som ressurser.
// Hvis man vil teste lokalt kan man bygge frontend med 'vite build' og åpne speil på port 3000.
const copyStylesheets = ({ from, to }: CopyStylesheetsOptions) => {
    const linkNodes = from.document.head.querySelectorAll('head link');

    for (const node of linkNodes) {
        if (isStylesheetLink(node)) {
            const copy = node.cloneNode() as HTMLLinkElement;
            const href = copy.getAttribute('href');

            if (!href?.startsWith('http')) {
                copy.setAttribute('href', from.document.location.origin + href);
            }

            to.document.head.appendChild(copy);
        }
    }
};

type OpenSimuleringParameters = {
    simulering: Simulering;
    utbetalingId: string;
};

const openSimulering = ({ simulering, utbetalingId }: OpenSimuleringParameters) => {
    const popup: WindowProxy = window.open('', '_blank', 'width=600, height=900') as WindowProxy;
    popup.document.title = 'Simulering';

    copyStyleAttribute({ from: window, to: popup, selector: 'html' });
    copyStylesheets({ from: window, to: popup });

    const rootContainer = popup.document.createElement('div');
    popup.document.body.appendChild(rootContainer);

    const root = createRoot(rootContainer);

    root.render(<SimuleringView simulering={simulering} utbetalingId={utbetalingId} />);
};

interface OpenSimuleringButtonProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'children'> {
    simulering: Simulering;
    utbetaling: Utbetaling;
}

export const OpenSimuleringButton: React.FC<OpenSimuleringButtonProps> = ({
    simulering,
    utbetaling,
    className,
    ...anchorProps
}) => {
    return (
        <LinkButton
            onClick={() =>
                openSimulering({
                    simulering: simulering,
                    utbetalingId: utbetaling.id,
                })
            }
            className={classNames(styles.OpenSimuleringButton, className)}
            {...anchorProps}
        >
            Simulering
        </LinkButton>
    );
};
