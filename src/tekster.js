const bokmål = {};

const ordbøker = {
    bokmål
};

const sider = {
    inngangsvilkår: 'inngangsvilkår'
};
Object.keys(sider).forEach(side => (bokmål[side] = {}));

bokmål.neste = 'Neste';

bokmål.inngangsvilkår.tittel = 'Beregning av sykepengegrunnlag og dagsats';
bokmål.inngangsvilkår.inngangsvilkår_oppfylt = 'Inngangsvilkår oppfylt';
bokmål.inngangsvilkår.medlemskap = 'Medlemskap';

const hardkodetBrukerspråk = 'bokmål';

export const tekster = nøkkel => ordbøker[hardkodetBrukerspråk][nøkkel];
export const inngangsvilkårtekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.inngangsvilkår][nøkkel];
