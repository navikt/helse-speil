import { ApiGraderteAndreYtelseType, ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { useTidslinjeRader } from '@saksbilde/tidslinje/groupTidslinjedata';
import { renderHook, waitFor } from '@test-utils';

const pleiepenger: ApiGraderteAndreYtelser = {
    andreYtelserId: 'pleiepenger-1',
    andreYtelseType: ApiGraderteAndreYtelseType.PLEIEPENGER,
    perioder: [{ fom: '2022-08-02', tom: '2022-08-13', grad: 50 }],
};

const foreldrepenger: ApiGraderteAndreYtelser = {
    andreYtelserId: 'foreldrepenger-1',
    andreYtelseType: ApiGraderteAndreYtelseType.FORELDREPENGER,
    perioder: [{ fom: '2022-09-01', tom: '2022-09-10', grad: 100 }],
};

const foreldrepengerTidligere: ApiGraderteAndreYtelser = {
    andreYtelserId: 'foreldrepenger-2',
    andreYtelseType: ApiGraderteAndreYtelseType.FORELDREPENGER,
    perioder: [{ fom: '2022-01-01', tom: '2022-01-10', grad: 80 }],
};

describe('useTidslinjeRader', () => {
    it('grupperer graderte andre ytelser per ytelsestype', async () => {
        const { result } = renderHook(() =>
            useTidslinjeRader([], [], [pleiepenger, foreldrepenger, foreldrepengerTidligere]),
        );

        await waitFor(() => expect(result.current.andreYtelserRader).toHaveLength(2));

        const [pleiepengerRad, foreldrepengerRad] = result.current.andreYtelserRader;

        expect(pleiepengerRad?.navn).toBe('Pleiepenger');
        expect(pleiepengerRad?.tidslinjeElementer).toHaveLength(1);
        expect(foreldrepengerRad?.navn).toBe('Foreldrepenger');
        expect(foreldrepengerRad?.tidslinjeElementer).toHaveLength(2);
    });

    it('sorterer periodene i en rad stigende på fom', async () => {
        const { result } = renderHook(() => useTidslinjeRader([], [], [foreldrepenger, foreldrepengerTidligere]));

        await waitFor(() => expect(result.current.andreYtelserRader).toHaveLength(1));

        expect(result.current.andreYtelserRader[0]?.tidslinjeElementer.map((it) => it.fom)).toEqual([
            '2022-01-01',
            '2022-09-01',
        ]);
    });

    it('mapper periodefelter og ytelsesdata til tidslinjeelement', async () => {
        const { result } = renderHook(() => useTidslinjeRader([], [], [pleiepenger]));

        await waitFor(() => expect(result.current.andreYtelserRader).toHaveLength(1));

        expect(result.current.andreYtelserRader[0]?.tidslinjeElementer[0]).toEqual({
            fom: '2022-08-02',
            tom: '2022-08-13',
            status: 'tilkommen',
            generasjonIndex: 0,
            gradertAndreYtelser: {
                andreYtelserId: 'pleiepenger-1',
                andreYtelseType: ApiGraderteAndreYtelseType.PLEIEPENGER,
                grad: 50,
            },
        });
    });
});
