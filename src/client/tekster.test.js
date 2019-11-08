import { tekster, oversikttekster } from './tekster';

test('kan slå opp "globale" tekster', () => {
    expect(tekster('neste')).toEqual('Neste');
});

test('kan slå opp tekster for sider', () => {
    expect(oversikttekster('tittel')).toContain('Neste saker');
});
