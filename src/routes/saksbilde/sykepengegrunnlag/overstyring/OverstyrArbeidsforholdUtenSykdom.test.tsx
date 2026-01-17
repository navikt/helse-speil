import { PropsWithChildren } from 'react';

import { OverstyrArbeidsforholdMutationDocument, OverstyringArbeidsforholdInput } from '@io/graphql';
import { usePollEtterOpptegnelser } from '@io/rest/polling';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { OverstyrArbeidsforholdUtenSykdom } from '@saksbilde/sykepengegrunnlag/overstyring/OverstyrArbeidsforholdUtenSykdom';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { createMock, render, screen } from '@test-utils';
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

    it('skal ikke vise ikke bruk arbeidsforholdet knap om arbeidsforholdet ikke er deaktivert og arbeidsforholdet har blitt markert som ikke i bruk', async () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const personPseudoId = 'f4fa2a9d-c41f-4ec0-85ca-4550dcab0321';
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const mocks = [
            overstyrArbeidsforholdMutationMock(periode.skjaeringstidspunkt, periode.vedtaksperiodeId, {
                begrunnelse: 'Avbrudd mer enn 14 dager (generell)',
                deaktivert: true,
                forklaring: 'En begrunnelse',
                orgnummer: arbeidsgiver.organisasjonsnummer,
                lovhjemmel: { paragraf: '8-15', lovverk: 'folketrygdloven', lovverksversjon: '1998-12-18' },
            }),
        ];
        const PollingWrapper = ({ children }: PropsWithChildren) => {
            usePollEtterOpptegnelser(personPseudoId);
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
                orgnummer: arbeidsgiver.organisasjonsnummer,
            }),
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
