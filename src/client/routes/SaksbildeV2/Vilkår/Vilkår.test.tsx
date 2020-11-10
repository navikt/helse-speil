import React from 'react';
import { mappetPerson } from 'test-data';
import { render, screen, within } from '@testing-library/react';
import { Vilkår } from './Vilkår';
import { defaultPersonContext, PersonContext } from '../../../context/PersonContext';
import { Periodetype, Person, Vedtaksperiode } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

const FontContainer = styled.div`
    * {
        font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif !important;
    }
`;

const enPerson = async (): Promise<Person> => {
    const person = await mappetPerson();
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
            },
            ...person.arbeidsgivere.slice(1),
        ],
    };
};

type MedEndretVedtaksperiodeOptions = {
    person: Person;
    vedtaksperiodeindeks: number;
    verdier: { [key: string]: any };
};

const medEndretVedtaksperiode = ({ person, vedtaksperiodeindeks, verdier }: MedEndretVedtaksperiodeOptions) => ({
    ...person,
    arbeidsgivere: [
        {
            ...person.arbeidsgivere[0],
            vedtaksperioder: person.arbeidsgivere[0].vedtaksperioder.map((periode, i) =>
                i === vedtaksperiodeindeks ? { ...periode, ...verdier } : periode
            ),
        },
    ],
});

const renderVilkår = (person: Person) =>
    render(
        <PersonContext.Provider
            value={{
                ...defaultPersonContext,
                personTilBehandling: person,
                aktivVedtaksperiode: person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode,
            }}
        >
            <FontContainer>
                <Vilkår />
            </FontContainer>
        </PersonContext.Provider>
    );

describe('Vilkår', () => {
    describe('førstegangsbehandling', () => {
        it('har alle vilkår oppfylt', async () => {
            const person = await enPerson();
            const personUtenInstitusjonsopphold = medEndretVedtaksperiode({
                person: person,
                vedtaksperiodeindeks: 0,
                verdier: { godkjenttidspunkt: dayjs('11-04-2020') },
            });
            await renderVilkår(personUtenInstitusjonsopphold);

            const oppfylteVilkår = screen.getByTestId('oppfylte-vilkår');
            expect(oppfylteVilkår).toBeVisible();

            expect(within(oppfylteVilkår).getByTestId('alder')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('søknadsfrist')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('opptjening')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('sykepengegrunnlag')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('dagerIgjen')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('medlemskap')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('arbeidsuførhet')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('institusjonsopphold')).toBeVisible();

            expect(screen.queryByTestId('vurdert-av-saksbehandler')).toBeNull();
            expect(screen.queryByTestId('vurdert-automatisk')).toBeNull();
            expect(screen.queryByTestId('vurdert-i-infotrygd')).toBeNull();
        });
        it('har noen vilkår ikke oppfylt', async () => {
            const person = await enPerson();
            const personMedIkkeOppfyltVilkår = {
                ...person,
                arbeidsgivere: [
                    {
                        ...person.arbeidsgivere[0],
                        vedtaksperioder: [
                            {
                                ...person.arbeidsgivere[0].vedtaksperioder[0],
                                vilkår: {
                                    ...(person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode).vilkår,
                                    opptjening: { oppfylt: false },
                                },
                            },
                        ],
                    },
                ],
            };
            await renderVilkår(personMedIkkeOppfyltVilkår);

            const oppfylteVilkår = screen.getByTestId('oppfylte-vilkår');
            expect(oppfylteVilkår).toBeVisible();

            expect(within(oppfylteVilkår).getByTestId('alder')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('søknadsfrist')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('sykepengegrunnlag')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('dagerIgjen')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('medlemskap')).toBeVisible();
            expect(within(oppfylteVilkår).getByTestId('arbeidsuførhet')).toBeVisible();

            const ikkeVurderteVilkår = screen.getByTestId('ikke-vurderte-vilkår');
            expect(ikkeVurderteVilkår).toBeVisible();
            expect(within(ikkeVurderteVilkår).getByTestId('institusjonsopphold')).toBeVisible();

            const ikkeOppfylteVilkår = screen.getByTestId('ikke-oppfylte-vilkår');
            expect(ikkeOppfylteVilkår).toBeVisible();
            expect(within(ikkeOppfylteVilkår).getByTestId('opptjening')).toBeVisible();

            expect(screen.queryByTestId('vurdert-av-saksbehandler')).toBeNull();
            expect(screen.queryByTestId('vurdert-automatisk')).toBeNull();
            expect(screen.queryByTestId('vurdert-i-infotrygd')).toBeNull();
        });
        it('er godkjent', async () => {
            const person = await enPerson();
            const personMedGodkjentPeriode = {
                ...person,
                arbeidsgivere: [
                    {
                        ...person.arbeidsgivere[0],
                        vedtaksperioder: [
                            {
                                ...person.arbeidsgivere[0].vedtaksperioder[0],
                                behandlet: true,
                            },
                        ],
                    },
                ],
            };
            await renderVilkår(personMedGodkjentPeriode);

            const vilkårVurdertAvSaksbehandler = screen.getByTestId('vurdert-av-saksbehandler');
            expect(vilkårVurdertAvSaksbehandler).toBeVisible();

            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('alder')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('søknadsfrist')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('sykepengegrunnlag')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('dagerIgjen')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('medlemskap')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('arbeidsuførhet')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('institusjonsopphold')).toBeVisible();
            expect(within(vilkårVurdertAvSaksbehandler).getByTestId('opptjening')).toBeVisible();

            expect(screen.queryByTestId('vurdert-automatisk')).toBeNull();
            expect(screen.queryByTestId('vurdert-i-infotrygd')).toBeNull();
        });
    });
});
