import { describe, expect, it } from 'vitest';

import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';
import { PersonMock } from '@spesialist-mock/storage/person';

const dialogAktorId = '2564094783926';
const annenAktorId = '2805594640665';

describe('DialogmeldingMock', () => {
    it('knytter dialogmelding-oppgaver til gyldig personPseudoId', () => {
        const oppgaver = DialogmeldingMock.getAllForOppgaver();

        expect(oppgaver.length).toBeGreaterThan(0);
        expect(oppgaver.every((oppgave) => oppgave.personPseudoId !== 'unknown')).toBe(true);
    });

    it('returnerer bare dialoger for valgt person', () => {
        const personPseudoId = PersonMock.findPersonPseudoId(dialogAktorId)!;
        const annenPersonPseudoId = PersonMock.findPersonPseudoId(annenAktorId)!;

        const dialogerForPerson = DialogmeldingMock.getAllForPerson(personPseudoId);
        expect(dialogerForPerson.length).toBeGreaterThan(0);

        const dialogId = dialogerForPerson[0]!.conversationRef;
        expect(DialogmeldingMock.getByIdForPerson(personPseudoId, dialogId)).not.toBeNull();
        expect(DialogmeldingMock.getByIdForPerson(annenPersonPseudoId, dialogId)).toBeNull();
    });
});
