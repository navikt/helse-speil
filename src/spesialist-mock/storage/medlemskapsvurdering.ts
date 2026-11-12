// Spleis bytter medlemskapsvurderingId i vilkårsgrunnlaget når sp-medlemskap sender endret_medlemskapsvurdering
export class MedlemskapsvurderingMock {
    private static gjeldende: Map<string, Map<string, string>> = new Map();

    static settGjeldende = (fødselsnummer: string, skjæringstidspunkt: string, medlemskapsvurderingId: string) => {
        const perSkjæringstidspunkt = MedlemskapsvurderingMock.gjeldende.get(fødselsnummer) ?? new Map();
        perSkjæringstidspunkt.set(skjæringstidspunkt, medlemskapsvurderingId);
        MedlemskapsvurderingMock.gjeldende.set(fødselsnummer, perSkjæringstidspunkt);
    };

    static hentGjeldende = (fødselsnummer: string, skjæringstidspunkt: string): string | undefined =>
        MedlemskapsvurderingMock.gjeldende.get(fødselsnummer)?.get(skjæringstidspunkt);

    static nullstill = (): void => {
        MedlemskapsvurderingMock.gjeldende.clear();
    };
}
