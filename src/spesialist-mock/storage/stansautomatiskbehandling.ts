export class StansAutomatiskBehandlingMock {
    private static automatiskBehandlingStanset: Map<string, boolean> = new Map();

    static getStansAutomatiskBehandling = (fødselsnummer: string): boolean => {
        return StansAutomatiskBehandlingMock.automatiskBehandlingStanset.get(fødselsnummer) ?? false;
    };

    static stansAutomatiskBehandling = (fødselsnummer: string, stans: boolean): void => {
        StansAutomatiskBehandlingMock.automatiskBehandlingStanset.set(fødselsnummer, stans);
    };
}
