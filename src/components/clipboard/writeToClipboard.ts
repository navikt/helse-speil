'use client';

export const writeToClipboard = (data: string) => navigator.clipboard.writeText(data);
