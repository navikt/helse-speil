import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';

import { BodyShort, Button, Checkbox, CheckboxGroup, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useArsaker } from '@external/sanity';
import { usePutPåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiPersonnavn, ApiTildeling } from '@io/rest/generated/spesialist.schemas';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOperationErrorHandler } from '@state/varsler';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

import { Frist } from './Frist';
import { Notat } from './Notat';
import { Årsaker } from './Årsaker';

import styles from './PåVentModaler.module.scss';

interface LeggPåVentModalProps {
    oppgaveId: string;
    behandlingId?: string;
    navn: ApiPersonnavn;
    utgangspunktTildeling: ApiTildeling | null;
    onClose: () => void;
    onLeggPåVentSuccess: () => void;
}

export const LeggPåVentModal = ({
    oppgaveId,
    navn,
    utgangspunktTildeling,
    onClose,
    onLeggPåVentSuccess,
}: LeggPåVentModalProps): ReactElement => {
    return (
        <FellesPåVentModal
            tittel="Legg på vent"
            navn={navn}
            utgangspunktÅrsaker={[]}
            utgangspunktNotattekst={null}
            utgangspunktFrist={null}
            utgangspunktTildeling={utgangspunktTildeling}
            closeModal={onClose}
            submitKnappTekst="Legg på vent"
            onLeggPåVentSuccess={onLeggPåVentSuccess}
            oppgaveId={oppgaveId}
        />
    );
};

interface EndrePåVentModalProps {
    oppgaveId: string;
    behandlingId?: string;
    navn: ApiPersonnavn;
    utgangspunktÅrsaker: string[];
    utgangspunktNotattekst: string | null;
    utgangspunktFrist: DateString;
    utgangspunktTildeling: ApiTildeling | null;
    onClose: () => void;
    onLeggPåVentSuccess: () => void;
}

export const EndrePåVentModal = ({
    oppgaveId,
    navn,
    utgangspunktÅrsaker,
    utgangspunktNotattekst,
    utgangspunktFrist,
    utgangspunktTildeling,
    onClose,
    onLeggPåVentSuccess,
}: EndrePåVentModalProps): ReactElement => {
    return (
        <FellesPåVentModal
            tittel="Legg på vent &ndash; endre"
            navn={navn}
            utgangspunktÅrsaker={utgangspunktÅrsaker}
            utgangspunktNotattekst={utgangspunktNotattekst}
            utgangspunktFrist={utgangspunktFrist}
            utgangspunktTildeling={utgangspunktTildeling}
            closeModal={onClose}
            submitKnappTekst="Endre"
            oppgaveId={oppgaveId}
            onLeggPåVentSuccess={onLeggPåVentSuccess}
        />
    );
};

interface FellesPåVentModalProps {
    tittel: string;
    navn: ApiPersonnavn;
    oppgaveId: string;
    utgangspunktÅrsaker: string[];
    utgangspunktNotattekst: string | null;
    utgangspunktFrist: DateString | null;
    utgangspunktTildeling: ApiTildeling | null;
    submitKnappTekst: string;
    closeModal: () => void;
    onLeggPåVentSuccess: () => void;
}

const FellesPåVentModal = ({
    tittel,
    navn,
    oppgaveId,
    utgangspunktÅrsaker,
    utgangspunktNotattekst,
    utgangspunktFrist,
    utgangspunktTildeling,
    submitKnappTekst,
    closeModal,
    onLeggPåVentSuccess,
}: FellesPåVentModalProps): ReactElement => {
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const saksbehandler = useInnloggetSaksbehandler();
    const { arsaker: årsaker, loading: årsakerLoading } = useArsaker('paventarsaker');

    const [valgteÅrsaker, setValgteÅrsaker] = useState<string[]>(utgangspunktÅrsaker);
    const [valgteÅrsakerError, setValgteÅrsakerError] = useState<string | null>(null);
    const [notattekst, setNotattekst] = useState<string | null>(utgangspunktNotattekst);
    const [notatError, setNotatError] = useState<string | null>(null);
    const [fristDato, setFristDato] = useState<Date | null>(
        utgangspunktFrist ? dayjs(utgangspunktFrist, ISO_DATOFORMAT).toDate() : null,
    );
    const [fristError, setFristError] = useState<string | null>(null);
    const [tildelSaksbehandler, setTildelSaksbehandler] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const opprinneligTildeltSaksbehandler = utgangspunktTildeling
        ? utgangspunktTildeling.oid === saksbehandler.oid
        : false;

    const { mutate: leggPåVent, isPending: leggPåVentLoading } = usePutPåVent();
    const leggPåVentErrorHandler = useOperationErrorHandler('Legg/endre på vent');

    const onSubmit = async () => {
        const error = validate();
        if (error) {
            return;
        }
        const filteredÅrsaker = årsaker[0]!.arsaker!.filter((it) => valgteÅrsaker.includes(it.arsak));
        leggPåVent(
            {
                oppgaveId: Number.parseInt(oppgaveId),
                data: {
                    frist: dayjs(fristDato).format(ISO_DATOFORMAT),
                    skalTildeles: tildelSaksbehandler,
                    notattekst,
                    årsaker: filteredÅrsaker.map((arsak) => ({ key: arsak._key, årsak: arsak.arsak })),
                },
            },
            {
                onSuccess: () => {
                    onLeggPåVentSuccess();
                    closeModal();
                },
                onError: (error) => {
                    setErrorMessage(error.status === 401 ? 'Du har blitt logget ut' : 'Kunne ikke legge på vent');
                    leggPåVentErrorHandler(new Error(error.message));
                    return;
                },
            },
        );
    };

    const validateNotat = (notattekst: string | null, valgteÅrsaker: string[]) => {
        let error = false;
        if (årsakAnnetErValgt(valgteÅrsaker) && (notattekst === null || notattekst?.length == 0)) {
            setNotatError('Notat må fylles ut');
            error = true;
        }
        if (notattekst && notattekst.length > 2000) {
            setNotatError('Det er kun tillatt med 2000 tegn');
            error = true;
        }
        if (!error) {
            setNotatError(null);
        }
        return error;
    };

    const validateÅrsaker = (valgteÅrsaker: string[]) => {
        let error = false;
        if (!årsaker?.[0]?.arsaker?.some((it) => valgteÅrsaker.includes(it.arsak))) {
            setValgteÅrsakerError('Velg minst én årsak');
            error = true;
        }
        if (!error) {
            setValgteÅrsakerError(null);
        }
        return error;
    };

    const validateFrist = () => {
        let error = false;
        if (!fristDato) {
            setFristError('Frist må være satt');
            error = true;
        }
        return error;
    };

    const validate = () => {
        const årsakerInvalid = validateÅrsaker(valgteÅrsaker);
        const notatInvalid = validateNotat(notattekst, valgteÅrsaker);
        const fristInvalid = validateFrist();
        return årsakerInvalid || notatInvalid || fristInvalid;
    };

    const årsakAnnetErValgt = (valgteÅrsaker: string[]) => valgteÅrsaker.includes('Annet');

    return (
        <Modal aria-label="På vent-modal" closeOnBackdropClick open={true} onClose={closeModal}>
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    {tittel}
                </Heading>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
            </Modal.Header>
            <Modal.Body>
                <div className={styles.påventårsak}>
                    <Årsaker
                        årsaker={årsaker?.[0]?.arsaker}
                        årsakerLoading={årsakerLoading}
                        valgteÅrsaker={valgteÅrsaker}
                        setValgteÅrsaker={(valgteÅrsaker) => {
                            setValgteÅrsaker(valgteÅrsaker);
                            if (valgteÅrsakerError) validateÅrsaker(valgteÅrsaker);
                            if (notatError) validateNotat(notattekst, valgteÅrsaker);
                        }}
                        error={valgteÅrsakerError}
                    />
                    <Notat
                        notattekst={notattekst}
                        setNotattekst={(notattekst) => {
                            setNotattekst(notattekst);
                            if (notatError) validateNotat(notattekst, valgteÅrsaker);
                        }}
                        valgfri={!årsakAnnetErValgt(valgteÅrsaker)}
                        error={notatError}
                    />
                </div>
                <Frist
                    fristDato={fristDato}
                    setFristDato={(fristDato) => {
                        setFristDato(fristDato);
                        if (fristError) validateFrist();
                    }}
                    error={fristError}
                    setError={setFristError}
                />
                <CheckboxGroup
                    legend="Tildeling"
                    hideLegend
                    onChange={(values) => setTildelSaksbehandler(values.length > 0)}
                    value={tildelSaksbehandler ? ['tildel_saksbehandler'] : []}
                >
                    <Checkbox className={styles.tildeling} value="tildel_saksbehandler">
                        {opprinneligTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                    </Checkbox>
                </CheckboxGroup>
                {!tildelSaksbehandler && <BodyShort>Uten tildeling vil oppgaven kunne bli automatisert</BodyShort>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="button" loading={leggPåVentLoading} onClick={onSubmit}>
                    {submitKnappTekst}
                </Button>
                <Button variant="tertiary" type="button" onClick={closeModal}>
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.errormessage}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
