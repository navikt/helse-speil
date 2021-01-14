import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Dropdown } from './Dropdown';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('Dropdown', () => {
    test('rendrer children', () => {
        //     const child = 'Noe tekst';
        //     render(
        //         <Dropdown>
        //             <span>{child}</span>
        //         </Dropdown>
        //     );
        //     const toggleOpenButton = screen.getByRole('button');
        //     expect(screen.queryByText(child)).toBeNull();
        //     userEvent.click(toggleOpenButton);
        //     expect(screen.queryByText(child)).toBeVisible();
        //     userEvent.click(toggleOpenButton);
        //     expect(screen.queryByText(child)).toBeNull();
        // });
        // test('lukkes når bruker klikker utenfor', () => {
        //     const child = 'Noe tekst';
        //     render(
        //         <>
        //             <Dropdown>
        //                 <span>{child}</span>
        //             </Dropdown>
        //             <button data-testid="close" />
        //         </>
        //     );
        //     const toggleOpenButton = screen.getAllByRole('button')[0];
        //     userEvent.click(toggleOpenButton);
        //     expect(screen.queryByText(child)).toBeVisible();
        //     act(() => {
        //         userEvent.click(screen.getByTestId('close'));
        //     });
        //     waitFor(() => {
        //         expect(screen.queryByText(child)).toBeNull();
        //     });
        // });
        // test('kaller callback-funksjon når den ekspanderes', () => {
        //     let clicked = false;
        //     render(<Dropdown onClick={() => (clicked = true)} />);
        //     userEvent.click(screen.getByRole('button'));
        //     expect(clicked).toBeTruthy();
    });
});
