'use client';

import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PopupWindow = {
    popup: Window | null;
    erBlokkert: boolean;
    åpne: () => void;
};

type PopupWindowPortalProps = {
    popup: Window;
    children: ReactNode;
};

export function usePopupWindow(title: string, features?: string): PopupWindow {
    const vinduRef = useRef<Window | null>(null);
    const ryddRef = useRef<(() => void) | null>(null);
    const [popup, setPopup] = useState<Window | null>(null);
    const [erBlokkert, setErBlokkert] = useState(false);

    useEffect(() => {
        return () => {
            ryddRef.current?.();
            ryddRef.current = null;
            vinduRef.current = null;
        };
    }, []);

    function åpne() {
        if (vinduRef.current !== null) {
            vinduRef.current.focus();
            return;
        }

        const nyttVindu = window.open('', '_blank', features);

        if (nyttVindu === null) {
            setErBlokkert(true);
            return;
        }

        vinduRef.current = nyttVindu;
        ryddRef.current = klargjørVindu(nyttVindu, title, () => {
            ryddRef.current = null;
            vinduRef.current = null;
            setPopup(null);
        });

        setErBlokkert(false);
        setPopup(nyttVindu);
    }

    return { popup, erBlokkert, åpne };
}

/**
 * Rendrer children inn i popup-vinduet med createPortal.
 *
 * Portalen holder innholdet i hovedvinduets React-tre, så React-kontekst (Apollo, tema,
 * anonymisering) og oppdateringer følger med uten at vi trenger en egen React-rot.
 */
export function PopupWindowPortal({ popup, children }: PopupWindowPortalProps): ReactElement {
    return createPortal(children, popup.document.body) as ReactElement;
}

/**
 * Gjør i popup-dokumentet det React ikke tar med seg over dokumentgrensen: CSS og attributtene
 * på <html>. Returnerer en funksjon som rydder opp og lukker vinduet.
 */
function klargjørVindu(vindu: Window, tittel: string, påLukking: () => void): () => void {
    vindu.document.title = tittel;
    vindu.document.documentElement.lang = 'no';

    kopierStilark(window.document, vindu.document);
    const observatør = speilHtmlAttributter(window.document, vindu.document);

    let ryddet = false;

    function rydd(): void {
        if (ryddet) {
            return;
        }

        ryddet = true;
        vindu.removeEventListener('pagehide', håndterLukking);
        observatør.disconnect();
        vindu.close();
    }

    function håndterLukking(): void {
        rydd();
        påLukking();
    }

    vindu.addEventListener('pagehide', håndterLukking);

    return rydd;
}

// Popupen åpnes som about:blank og arver ingenting: CSS kaskaderer ikke over dokumentgrenser,
// og createPortal flytter DOM-noder, ikke stiler. Uten denne kopieringen står innholdet helt
// ustilt. Verifisert manuelt — ikke fjern den.
//
// Både <link rel="stylesheet"> og <style> må med: produksjonsbygget serverer CSS som lenker,
// mens Turbopack injiserer den som <style> i dev.
function kopierStilark(fra: Document, til: Document): void {
    for (const node of fra.head.querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style')) {
        const kopi = node.cloneNode(true);

        if (node instanceof HTMLLinkElement && kopi instanceof HTMLLinkElement) {
            kopi.setAttribute('href', node.href);
        }

        til.head.appendChild(kopi);
    }
}

// next-themes legger temaet som klasse på <html>, og color-scheme som style. Uten speiling
// blir popupen stående i lys modus mens resten av appen er i mørk.
function speilHtmlAttributter(fra: Document, til: Document): MutationObserver {
    function synkroniser() {
        for (const attributt of ['class', 'style']) {
            const verdi = fra.documentElement.getAttribute(attributt);

            if (verdi === null) {
                til.documentElement.removeAttribute(attributt);
            } else {
                til.documentElement.setAttribute(attributt, verdi);
            }
        }
    }

    synkroniser();

    const observatør = new MutationObserver(synkroniser);
    observatør.observe(fra.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    return observatør;
}
