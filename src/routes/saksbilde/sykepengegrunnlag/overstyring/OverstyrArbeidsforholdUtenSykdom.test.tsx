import { PropsWithChildren } from 'react';

import { opprettAbonnementMock } from '@apollo-mocks';
import {
    OpptegnelserDocument,
    OverstyrArbeidsforholdMutationDocument,
    OverstyringArbeidsforholdInput,
} from '@io/graphql';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { OverstyrArbeidsforholdUtenSykdom } from '@saksbilde/sykepengegrunnlag/overstyring/OverstyrArbeidsforholdUtenSykdom';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { createMock, render, screen } from '@test-utils';
import { waitForElementToBeRemoved } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('OverstyrArbeidsforholdUtenSykdom Tests', () => {
    it('skal vise ikke bruk arbeidsforholdet knap om arbeidsforholdet ikke er deaktivert og knappen ikke er trykket', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        render(
            <OverstyrArbeidsforholdUtenSykdom
                organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                arbeidsforholdErDeaktivert={false}
                person={person}
            />,
        );
        expect(screen.getByText('Ikke bruk arbeidsforholdet i beregningen')).toBeInTheDocument();
    });

    // Denne er litt vrien. Sliter med komboen av submitting av overstyring og lytting og mottak av opptegnelse.
    // Forventer at <OverstyrArbeidsforholdUtenSykdon /> skal forsvinne etter man har sendt inn overstyring,
    // men det er noe feil som gjør at komponentet ikke forstår at overstyring er sendt og resultat mottat og dermed
    // skulle vært skjult.
    it.skip('skal ikke vise ikke bruk arbeidsforholdet knap om arbeidsforholdet ikke er deaktivert og arbeidsforholdet har blitt markert som ikke i bruk', async () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const mocks = [
            overstyrArbeidsforholdMutationMock(periode.skjaeringstidspunkt, periode.vedtaksperiodeId, {
                begrunnelse: 'Avbrudd mer enn 14 dager (generell)',
                deaktivert: true,
                forklaring: 'En begrunnelse',
                orgnummer: '987654321',
                lovhjemmel: { paragraf: '8-15', lovverk: 'folketrygdloven', lovverksversjon: '1998-12-18' },
            }),
            opprettAbonnementMock(person.aktorId),
            createMock({
                request: { query: OpptegnelserDocument, variables: { sekvensId: undefined } },
                result: {
                    data: {
                        __typename: 'Query',
                        opptegnelser: [],
                    },
                },
            }),
            createMock({
                request: { query: OpptegnelserDocument, variables: { sekvensId: undefined } },
                result: {
                    data: {
                        __typename: 'Query',
                        opptegnelser: [
                            {
                                aktorId: person.aktorId,
                                type: 'UTBETALING_ANNULLERING_OK',
                                sekvensnummer: 1,
                                payload: 'payload1',
                                __typename: 'Opptegnelse',
                            },
                            {
                                aktorId: person.aktorId,
                                type: 'PERSONDATA_OPPDATERT',
                                sekvensnummer: 2,
                                payload: 'payload2',
                                __typename: 'Opptegnelse',
                            },
                        ],
                    },
                },
            }),
            createMock({
                request: { query: OpptegnelserDocument, variables: { sekvensId: 2 } },
                result: {
                    data: {
                        __typename: 'Query',
                        opptegnelser: [
                            {
                                aktorId: person.aktorId,
                                type: 'NY_SAKSBEHANDLEROPPGAVE',
                                sekvensnummer: 3,
                                payload: 'payload3',
                                __typename: 'Opptegnelse',
                            },
                        ],
                    },
                },
            }),
            createMock({
                request: { query: OpptegnelserDocument, variables: { sekvensId: 3 } },
                result: {
                    data: {
                        __typename: 'Query',
                        opptegnelser: [],
                    },
                },
            }),
        ];
        const PollingWrapper = ({ children }: PropsWithChildren) => {
            usePollEtterOpptegnelser();
            return <>{children}</>;
        };

        render(
            <PollingWrapper>
                <VenterPåEndringProvider>
                    <OverstyrArbeidsforholdUtenSykdom
                        organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                        skjæringstidspunkt={periode.skjaeringstidspunkt}
                        arbeidsforholdErDeaktivert={false}
                        person={person}
                    />
                </VenterPåEndringProvider>
            </PollingWrapper>,
            { mocks },
        );
        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getAllByRole('radio')[0]!);
        await userEvent.type(screen.getByRole('textbox'), 'En begrunnelse');
        await userEvent.click(screen.getByRole('button', { name: 'Ferdig' }));
        await waitForElementToBeRemoved(screen.queryByRole('button', { name: 'Ferdig' }));
        expect(
            screen.queryByRole('button', { name: 'Ikke bruk arbeidsforholdet i beregningen' }),
        ).not.toBeInTheDocument();
    });

    it('skal vise angreknap om arbeidsforholdet er deaktivert og knappen ikke er trykket', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        render(
            <OverstyrArbeidsforholdUtenSykdom
                organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                arbeidsforholdErDeaktivert={true}
                person={person}
            />,
        );
        expect(screen.getByText('Bruk arbeidsforholdet i beregningen likevel')).toBeInTheDocument();
    });

    it('skal vise ikke vise angreknap om arbeidsforholdet er deaktivert og knappen allerede er trykket', async () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        const mocks = [
            overstyrArbeidsforholdMutationMock(periode.skjaeringstidspunkt, periode.vedtaksperiodeId, {
                begrunnelse: 'Angret å ikke bruke det i beregningen',
                deaktivert: false,
                forklaring: 'Saksbehandler angret å deaktivere arbeidsforholdet i beregningen',
                orgnummer: '987654321',
            }),
            opprettAbonnementMock(person.aktorId),
        ];
        render(
            <VenterPåEndringProvider>
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                    arbeidsforholdErDeaktivert={true}
                    person={person}
                />
            </VenterPåEndringProvider>,
            { mocks },
        );

        await userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText('Bruk arbeidsforholdet i beregningen likevel')).not.toBeInTheDocument();
    });
});

const overstyrArbeidsforholdMutationMock = (
    skjæringstidspunkt: string,
    vedtaksperiodeId: string,
    overstyrtArbeidsforhold: OverstyringArbeidsforholdInput,
) =>
    createMock({
        request: {
            query: OverstyrArbeidsforholdMutationDocument,
            variables: {
                overstyring: {
                    aktorId: '1234567890',
                    overstyrteArbeidsforhold: [overstyrtArbeidsforhold],
                    fodselsnummer: '12345678910',
                    skjaringstidspunkt: skjæringstidspunkt,
                    vedtaksperiodeId: vedtaksperiodeId,
                },
            },
        },
        result: {
            data: {
                __typename: 'Mutation',
                overstyrArbeidsforhold: true,
            },
        },
    });
