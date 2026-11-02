import { twMerge } from 'tailwind-merge';

export type ClassValue = string | false | null | undefined | Record<string, boolean | undefined> | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
    return twMerge(joinClasses(inputs));
}

function joinClasses(inputs: ClassValue[]): string {
    return inputs
        .map((input) => {
            if (!input) return '';
            if (typeof input === 'string') return input;
            if (Array.isArray(input)) return joinClasses(input);
            return Object.keys(input)
                .filter((key) => input[key])
                .join(' ');
        })
        .filter(Boolean)
        .join(' ');
}
