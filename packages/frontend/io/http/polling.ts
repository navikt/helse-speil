import { useQuery } from '@apollo/client';
import { OpptegnelserDocument, Opptegnelsetype } from '@io/graphql';
import { useMottaOpptegnelser, useNyesteOpptegnelseSekvens, useOpptegnelserPollingRate } from '@state/opptegnelser';

export const usePollEtterOpptegnelser = () => {
    const mottaOpptegnelser = useMottaOpptegnelser();
    const sekvensId = useNyesteOpptegnelseSekvens();
    const pollInterval = useOpptegnelserPollingRate();
    useQuery(OpptegnelserDocument, {
        variables: {
            sekvensId,
        },
        pollInterval,
        onCompleted: (data) => {
            mottaOpptegnelser(
                data.opptegnelser.map((opptegnelse) => ({
                    sekvensnummer: opptegnelse.sekvensnummer,
                    type: tilOpptegnelsetype(opptegnelse.type),
                    aktørId: Number.parseInt(opptegnelse.aktorId),
                    payload: opptegnelse.payload,
                })),
            );
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

const tilOpptegnelsetype = (opptegnelsetype: Opptegnelsetype): OpptegnelseType => {
    switch (opptegnelsetype) {
        case Opptegnelsetype.FerdigbehandletGodkjenningsbehov:
            return Opptegnelsetype.FerdigbehandletGodkjenningsbehov;
        case Opptegnelsetype.NySaksbehandleroppgave:
            return Opptegnelsetype.NySaksbehandleroppgave;
        case Opptegnelsetype.PersondataOppdatert:
            return Opptegnelsetype.PersondataOppdatert;
        case Opptegnelsetype.RevurderingAvvist:
            return Opptegnelsetype.RevurderingAvvist;
        case Opptegnelsetype.RevurderingFerdigbehandlet:
            return Opptegnelsetype.RevurderingFerdigbehandlet;
        case Opptegnelsetype.UtbetalingAnnulleringFeilet:
            return Opptegnelsetype.UtbetalingAnnulleringFeilet;
        case Opptegnelsetype.UtbetalingAnnulleringOk:
            return Opptegnelsetype.UtbetalingAnnulleringOk;
    }
};
