import { UnntattFraAutomatiskGodkjenning } from '../schemaTypes';

const getDefaultUnntattFraAutomatiskGodkjenning = (): UnntattFraAutomatiskGodkjenning => ({
    erUnntatt: false,
    arsaker: [],
});

export class OpphevStansMock {
    private static unntattFraAutomatisering: Map<string, UnntattFraAutomatiskGodkjenning> = new Map();

    static getUnntattFraAutomatiskGodkjenning = (fødselsnummer: string): UnntattFraAutomatiskGodkjenning | null => {
        return OpphevStansMock.unntattFraAutomatisering.get(fødselsnummer) ?? null;
    };

    static addUnntattFraAutomatiskGodkjenning = (
        fødselsnummer: string,
        unntattFraAutomatisering: Partial<UnntattFraAutomatiskGodkjenning>,
    ): void => {
        OpphevStansMock.unntattFraAutomatisering.set(fødselsnummer, {
            ...getDefaultUnntattFraAutomatiskGodkjenning(),
            ...OpphevStansMock.unntattFraAutomatisering.get(fødselsnummer),
            ...unntattFraAutomatisering,
        });
    };
}
