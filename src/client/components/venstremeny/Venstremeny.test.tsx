import React from 'react';
import { render, screen } from '@testing-library/react';
import { Venstremeny } from './Venstremeny';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { mapVedtaksperiode } from '../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';

const enSpeilVedtaksperiode = async () => {
    const { vedtaksperiode } = await mapVedtaksperiode({
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        overstyringer: [],
    });
    return vedtaksperiode;
};

describe('Venstremeny', () => {
    test('inneholder bare inaktive lenker når den ikke har en vedtaksperiode', () => {
        render(
            <MemoryRouter>
                <Venstremeny />
            </MemoryRouter>
        );
        const nav = screen.getByRole('navigation');
        const inaktiveLenker = [].slice.call(nav.children);
        inaktiveLenker.forEach((lenke: HTMLAnchorElement) => expect(lenke.href).toEqual(''));
    });
    test('inneholder aktive lenker når den har en vedtaksperiode', async () => {
        render(
            <MemoryRouter>
                <Venstremeny vedtaksperiode={await enSpeilVedtaksperiode()} />
            </MemoryRouter>
        );
        const nav = screen.getByRole('navigation');
        const lenker = [].slice.call(nav.children);
        const aktiveLenker = lenker.filter((lenke: HTMLAnchorElement) => lenke.href.length > 0);
        expect(aktiveLenker.length).toEqual(6);

        const inaktiveLenker = lenker.filter((lenke: HTMLAnchorElement) => lenke.href.length === 0);
        expect(inaktiveLenker.pop()).toHaveTextContent('Fordeling');
    });
});
