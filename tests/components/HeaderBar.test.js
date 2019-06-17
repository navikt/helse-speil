import React from 'react';
import { render, cleanup, waitForElement } from 'react-testing-library';
import HeaderBar from '../../src/components/HeaderBar/HeaderBar';
import AuthContext from '../../src/context/AuthContext';
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('Missing brukernavn is replaced with a default', async () => {
    const { container } = render(<HeaderBar />);
    const brukerTextNode = await waitForElement(() =>
        container.querySelector('#user')
    );
    expect(brukerTextNode).toHaveTextContent('Ikke Pålogget');
});

test('Provided value from context is used as brukernavn', async () => {
    const { container } = render(
        <AuthContext.Provider value={{ state: { name: 'Bruker Brukersen' } }}>
            <HeaderBar displayname="Bruker Brukersen" />
        </AuthContext.Provider>
    );
    const brukerTextNode = await waitForElement(() =>
        container.querySelector('#user')
    );
    expect(brukerTextNode).toHaveTextContent('Bruker Brukersen');
});
