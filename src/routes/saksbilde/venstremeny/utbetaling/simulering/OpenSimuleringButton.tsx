import React, { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

import { Link } from '@navikt/ds-react';

import { AnonymizationProvider, AnonymizationRoot } from '@components/anonymization/context';
import { Simulering, Utbetaling } from '@io/graphql';
import { cn } from '@utils/tw';

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

// Popupen kopierer <link rel="stylesheet"> fra hovedvinduets head. Får du et ustilt vindu lokalt,
// er det fordi dev-serveren ikke serverer CSS-en som slike lenker. Bygg da med
// 'pnpm build && pnpm start'.
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

    // Popupen er et eget dokument med egen React-rot, så den trenger sin egen provider og
    // .anonymized-forelder for at CSS-regelen skal treffe. localStorage og window tilhører
    // hovedvinduet, så sladdingen følger med når man skrur den av og på der.
    root.render(
        <AnonymizationProvider>
            <AnonymizationRoot>
                <SimuleringView simulering={simulering} utbetalingId={utbetalingId} />
            </AnonymizationRoot>
        </AnonymizationProvider>,
    );
};

interface OpenSimuleringButtonProps {
    simulering: Simulering;
    utbetaling: Utbetaling;
    className?: string;
}

export const OpenSimuleringButton = ({
    simulering,
    utbetaling,
    className,
}: OpenSimuleringButtonProps): ReactElement => {
    return (
        <Link
            href="#"
            onClick={() =>
                openSimulering({
                    simulering: simulering,
                    utbetalingId: utbetaling.id,
                })
            }
            className={cn(styles.OpenSimuleringButton, className)}
        >
            Simulering
        </Link>
    );
};
