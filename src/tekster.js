const bokmål = {};

const ordbøker = {
    bokmål
};

const sider = {
    inngangsvilkår: 'inngangsvilkår',
    sykdomsvilkår: 'sykdomsvilkår'
};
Object.keys(sider).forEach(side => (bokmål[side] = {}));

bokmål.neste = 'Neste';

bokmål.inngangsvilkår.tittel = 'Inngangsvilkår';
bokmål.inngangsvilkår.inngangsvilkår_oppfylt = 'Inngangsvilkår oppfylt';
bokmål.inngangsvilkår.medlemskap = 'Medlemskap';

bokmål.sykdomsvilkår['sykdomsvilkår_oppfylt'] = 'Sykdomsvilkår er oppfylt';
bokmål.sykdomsvilkår['sykdomsrelaterte_betingelser'] =
    'Sykdomsrelaterte betingelser for filter for automatisert behandling';
bokmål.sykdomsvilkår['mindre_enn_8_uker'] = 'Mindre enn 8 uker sammenhengende';
bokmål.sykdomsvilkår['første_sykdomsdag'] = 'Første sykdomsdag';
bokmål.sykdomsvilkår['ingen_yrkesskade'] = 'Ingen yrkesskade';

const hardkodetBrukerspråk = 'bokmål';

export const tekster = nøkkel => ordbøker[hardkodetBrukerspråk][nøkkel];
export const inngangsvilkårtekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.inngangsvilkår][nøkkel];
export const sykdomsvilkårtekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.sykdomsvilkår][nøkkel];
