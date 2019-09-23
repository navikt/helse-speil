import { useEffect } from 'react';

/* Sjekker om et DOm-element har et målelement som forelder.
 * @param {HTMLElement} child   elementet som søket tar utgangspunkt fra
 * @param {HTMLElement} target  elementet som det søkes etter
 * @param {number} maxDepth     maksimalt antall nivåer søket skal foretas gjennom
 * @returns {boolean}           true dersom child har target som foreldreelement innen maxDepth-nivåer
 */
const hasParent = (child, target, maxDepth = 3) => {
    let current = child;
    let depth = 0;

    while (current && depth < maxDepth) {
        if (current === target) {
            return true;
        }
        current = current.parentElement;
        depth++;
    }

    return false;
};

export const useClickOutside = (ref, isActive, callback) => {
    useEffect(() => {
        const handleClick = e => {
            if (!hasParent(e.target, ref.current)) {
                callback();
            }
        };
        if (isActive && ref.current) {
            window.addEventListener('click', handleClick);
            return () => window.removeEventListener('click', handleClick);
        }
    }, [isActive, ref.current]);
};
