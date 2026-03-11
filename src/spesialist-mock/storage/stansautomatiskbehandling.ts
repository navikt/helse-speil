export class StansAutomatiskBehandlingMock {
    private static automatiskBehandlingStanset: Map<string, boolean> = new Map();

    static getStansAutomatiskBehandling = (pseudoId: string): boolean => {
        return StansAutomatiskBehandlingMock.automatiskBehandlingStanset.get(pseudoId) ?? false;
    };

    static stansAutomatiskBehandling = (pseudoId: string, stans: boolean): void => {
        StansAutomatiskBehandlingMock.automatiskBehandlingStanset.set(pseudoId, stans);
    };
}
