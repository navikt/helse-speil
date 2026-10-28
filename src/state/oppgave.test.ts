import { finnPeriodeIdMedAktivOppgave } from '@state/oppgave';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enAktivOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { generateId } from '@utils/generateId';

describe('finnPeriodeIdMedAktivOppgave', () => {
    const vedtaksperiodeId = generateId();
    const nyestePeriode = enBeregnetPeriode({ vedtaksperiodeId });
    const eldrePeriode = enBeregnetPeriode({ vedtaksperiodeId });
    const person = enPerson({
        arbeidsgivere: [
            enArbeidsgiver({
                behandlinger: [enBehandling({ perioder: [nyestePeriode] }), enBehandling({ perioder: [eldrePeriode] })],
            }),
        ],
    });
    const aktivOppgave = enAktivOppgave({ vedtaksperiodeId });

    it('gir perioden i nyeste behandling av vedtaksperioden, ikke en eldre behandling', () => {
        expect(finnPeriodeIdMedAktivOppgave(person, aktivOppgave)).toEqual(nyestePeriode.id);
    });

    it('gir null når oppgaven gjelder en annen vedtaksperiode', () => {
        const annenOppgave = enAktivOppgave({ vedtaksperiodeId: generateId() });
        expect(finnPeriodeIdMedAktivOppgave(person, annenOppgave)).toBeNull();
    });

    it('gir null for uberegnede perioder', () => {
        const personMedUberegnet = enPerson({
            arbeidsgivere: [
                enArbeidsgiver({
                    behandlinger: [enBehandling({ perioder: [enUberegnetPeriode({ vedtaksperiodeId })] })],
                }),
            ],
        });
        expect(finnPeriodeIdMedAktivOppgave(personMedUberegnet, aktivOppgave)).toBeNull();
    });

    it('gir null når personen ikke har aktiv oppgave', () => {
        expect(finnPeriodeIdMedAktivOppgave(person, null)).toBeNull();
    });
});
