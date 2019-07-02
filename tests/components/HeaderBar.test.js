'use strict';

import React from 'react';
import { render, cleanup, waitForElement } from 'react-testing-library';
import HeaderBar from '../../src/components/HeaderBar/HeaderBar';
import 'jest-dom/extend-expect';

const clgOrig = console.log;

afterEach(cleanup);

beforeAll(() => {
    // reduce noise in log
    console.log = jest.fn();
});

afterAll(() => {
    console.log = clgOrig;
});

test('name of logged in user is retrieved from cookie', async () => {
    const { container } = render(<HeaderBar />);
    const name = 'Navn Med Æøå';

    Object.defineProperty(document, 'cookie', {
        get: jest.fn().mockImplementation(() => {
            return `name=whateverelse; speil=${createJWT(name)}`;
        }),
        set: jest.fn().mockImplementation(() => {})
    });
    const brukerTextNode = await waitForElement(() =>
        container.querySelector('#user')
    );
    expect(brukerTextNode).toHaveTextContent(name);
});

const createJWT = name => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '1234567890', name: name, iat: 1516239022 };
    return `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(payload)
    )}.signaturehere`;
};
