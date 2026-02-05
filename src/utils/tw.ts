import classNames, { type ArgumentArray } from 'classnames';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ArgumentArray): string {
    return twMerge(classNames(...inputs));
}
