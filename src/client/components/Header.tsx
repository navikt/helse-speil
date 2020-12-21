import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../context/PersonContext';
import { Location, useNavigation } from '../hooks/useNavigation';
import { Person } from 'internal-types';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';
import { HeaderEnkel, Søk } from '@navikt/helse-frontend-header';
import '@navikt/helse-frontend-header/lib/main.css';
import { Link, useHistory } from 'react-router-dom';
import { speilV2 } from '../featureToggles';
import { tre, lue } from './julepakke';

const Container = styled.div`
    flex-shrink: 0;
    height: max-content;
    width: 100%;
    > header {
        max-width: unset;
        box-sizing: border-box;
        h1 {
            a {
                display: flex;
                align-items: center;
                position: relative;
                ::before {
                    content: '';
                    position: absolute;
                    background: no-repeat center/100% url(${lue});
                    height: 15px;
                    width: 15px;
                    left: -8.5px;
                    top: 13px;
                    transform: rotate(-18deg);
                }
            }
        }
        img {
            width: 50px;
        }
    }
`;

export const Header = () => {
    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    const { hentPerson } = useContext(PersonContext);
    const { navigateTo } = useNavigation();
    const history = useHistory();

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (value: string): Promise<void> =>
        hentPerson(value)
            .then((person: Person) => {
                speilV2
                    ? history.push(`/person/${person.aktørId}/utbetaling`)
                    : navigateTo(Location.Sykmeldingsperiode, person.aktørId);
            })
            .catch((_) => {
                /* Error håndtert i hentPerson i PersonContext */
            })
            .finally(() => {
                return Promise.resolve();
            });

    return (
        <Container>
            <HeaderEnkel
                tittel={
                    <Link to="/">
                        NAV <img src={tre} /> Sykepenger
                    </Link>
                }
                brukerinfo={brukerinfo}
            >
                <Søk onSøk={onSøk} />
            </HeaderEnkel>
        </Container>
    );
};
