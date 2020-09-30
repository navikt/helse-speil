import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Input } from 'nav-frontend-skjema';
import { Feilmelding as NavFeilmelding, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { AnnulleringDTO } from '../../io/types';
import { Arbeidsgiver, Person, UferdigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import { useRecoilValue } from 'recoil';
import { authState } from '../../state/authentication';
import { postAnnullering } from '../../io/http';
import { FormProvider, useForm } from 'react-hook-form';
import { Annulleringsvarsel } from './Annulleringsvarsel';
import { Modal } from '../Modal';
import { organisasjonsnummerForPeriode } from '../../mapping/selectors';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '../../utils/date';
import { somPenger } from '../../utils/locale';
import dayjs from 'dayjs';

const ModalContainer = styled(Modal)`
    max-width: 48rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const Form = styled.form`
    padding: 0.5rem 2.5rem 2.5rem;
`;

const Tittel = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: #3e3832;
    margin-bottom: 1.5rem;
`;

const IdentInput = styled(Input)`
    margin-top: 1.3125rem;
    margin-bottom: 1.5rem;

    label {
        display: none;
    }

    input {
        font-size: 1rem;
        color: #3e3832;
    }
`;

const AnnullerKnapp = styled(Knapp)`
    margin-right: 1rem;
`;

const Feilmelding = styled(NavFeilmelding)`
    margin-top: 0.625rem;
`;

const TilAnnullering = styled.div`
    margin-bottom: 2rem;
`;

export const totaltTilUtbetaling = (vedtaksperioder: (Vedtaksperiode | UferdigVedtaksperiode)[]): number =>
    vedtaksperioder.reduce((total, periode: Vedtaksperiode) => {
        const totaltForPeriode = periode.utbetalingstidslinje?.reduce((total, dag) => total + (dag.utbetaling ?? 0), 0);
        return total + (totaltForPeriode ? totaltForPeriode : 0);
    }, 0);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

export const sisteDatoForArbeidsgiver = (arbeidsgiver: Arbeidsgiver): string =>
    [...arbeidsgiver.vedtaksperioder].sort(reversert)[0].tom.format(NORSK_DATOFORMAT);

interface Props {
    person: Person;
    vedtaksperiode: Vedtaksperiode;
    onClose: () => void;
}

export const Annulleringsmodal = ({ person, vedtaksperiode, onClose }: Props) => {
    const { ident } = useRecoilValue(authState);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();

    const form = useForm({ mode: 'onBlur' });
    const organisasjonsnummer = organisasjonsnummerForPeriode(vedtaksperiode, person);

    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT);

    const vedtaksperioderTilAnnullering = person.arbeidsgivere[0].vedtaksperioder.filter((periode) =>
        periode.fom.isSameOrAfter(vedtaksperiode.fom)
    ) as Vedtaksperiode[];

    const dager = vedtaksperioderTilAnnullering.flatMap(
        (periode: Vedtaksperiode) => periode.utbetalingstidslinje ?? []
    );

    const annullering = (): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        dager: dager.map((dag) => dag.dato.format(ISO_DATOFORMAT)),
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setPostAnnulleringFeil(undefined);
        postAnnullering(annullering)
            .then(onClose)
            .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
            .finally(() => setIsSending(false));
    };

    const submit = () => sendAnnullering(annullering());

    return (
        <FormProvider {...form}>
            <ModalContainer
                className="AnnulleringModal"
                isOpen={true}
                contentLabel="Feilmelding"
                onRequestClose={onClose}
            >
                <Form onSubmit={form.handleSubmit(submit)}>
                    <Annulleringsvarsel />
                    <Tittel>Annullering</Tittel>

                    <TilAnnullering>
                        <Normaltekst>{`Periode som annulleres: ${fom} - ${sisteDatoForArbeidsgiver(
                            person.arbeidsgivere[0]
                        )}`}</Normaltekst>
                        <Normaltekst>
                            Totalbeløp: {somPenger(totaltTilUtbetaling(vedtaksperioderTilAnnullering))}
                        </Normaltekst>
                    </TilAnnullering>

                    <Normaltekst>
                        For å gjennomføre annulleringen må du skrive inn din NAV brukerident i feltet under.
                    </Normaltekst>
                    <IdentInput
                        name="failsafe"
                        label={'NAV brukerident'}
                        aria-label={'NAV brukerident'}
                        placeholder={'NAV brukerident'}
                        inputRef={form.register({ required: true, validate: (value: string) => value === ident })}
                        feil={form.errors?.failsafe && 'Fyll inn din NAV brukerident'}
                    />
                    <AnnullerKnapp spinner={isSending} autoDisableVedSpinner onClick={submit}>
                        Annullér
                    </AnnullerKnapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
