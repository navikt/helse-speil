import React from 'react';
import { render, screen } from '@testing-library/react';
import { Clipboard } from './Clipboard';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

let copiedText = '';

jest.mock('./writeToClipboard', () => ({
    __esModule: true,
    writeToClipboard: (data: string) => {
        copiedText = data;
        return Promise.resolve();
    },
}));

describe('Clipboard', () => {
    test('kopierer tekstinnhold i children-propen', async () => {
        render(<Clipboard>Denne skal kopieres</Clipboard>);
        await act(async () => {
            const button = screen.getByRole('button');
            await userEvent.click(button);
            expect(copiedText).toEqual('Denne skal kopieres');
        });
    });
    test('kopierer tekstinnhold i elementer i children-propen', async () => {
        render(
            <Clipboard>
                <p>Denne skal kopieres</p>
            </Clipboard>
        );
        await act(async () => {
            const button = screen.getByRole('button');
            await userEvent.click(button);
            expect(copiedText).toEqual('Denne skal kopieres');
        });
    });
});
