import { tekster, inngangsvilkårtekster } from './tekster';

test('kan slå opp "globale" tekster', () => {
    expect(tekster('neste')).toEqual('Neste');
});

test('kan slå opp tekster for sider', () => {
    expect(inngangsvilkårtekster('tittel')).toContain('Inngangsvilkår');
});
