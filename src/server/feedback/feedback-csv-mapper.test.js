const { csvMapper } = require('./feedback-csv-mapper');

const submittedDate = '2019-08-29T16:59:04+02:00';
const submittedDateFormatted = submittedDate.replace('+02:00', '');
const feedbackDate = '2019-08-29T16:39:04+02:00';

const headerLine =
    'uenighet-label;uenighet-value;uenighet-items;uenighet-id;uenighet-userId;submittedDate;kommentarer;behandlingsId';
test('csv mapper should map feedback from json to csv', () => {
    const feedbacks = [
        {
            key: '123',
            value: {
                uenigheter: [
                    {
                        id: 'id for uenighet 1',
                        label: 'label for uenighet 1',
                        items: [
                            {
                                label: 'underlabel-1.1',
                                value: 'undervalue-1.1'
                            },
                            {
                                label: 'underlabel-1.2',
                                value: 'undervalue-1.2'
                            }
                        ],
                        value: 'inntastet verdi for uenighet 1',
                        userId: { email: 'hei1@nav.no' },
                        date: feedbackDate
                    }
                ],
                kommentarer: 'ser bra ut 👍',
                submittedDate
            }
        },
        {
            key: '456',
            value: {
                uenigheter: [
                    {
                        id: 'id for uenighet 2',
                        label: 'label for uenighet 2',
                        items: [
                            {
                                label: 'underlabel-2.1',
                                value: 'undervalue-2.1'
                            },
                            {
                                label: 'underlabel-2.2',
                                value: 'undervalue-2.2'
                            }
                        ],
                        value: 'inntastet verdi for uenighet 2',
                        userId: {},
                        date: feedbackDate
                    },
                    {
                        id: 'id for uenighet 3',
                        label: 'label for uenighet 3',
                        items: [
                            {
                                label: 'underlabel-3.1',
                                value: 'undervalue-3.1'
                            },
                            {
                                label: 'underlabel-3.2',
                                value: 'undervalue-3.2'
                            }
                        ],
                        value: 'inntastet verdi for uenighet 3',
                        userId: { email: 'hei3@nav.no' },
                        date: feedbackDate
                    }
                ],
                kommentarer: 'ser veldig bra ut 👍',
                submittedDate
            }
        }
    ];

    const result = csvMapper(feedbacks);

    expect(result).toBe(
        `
${headerLine}
label for uenighet 1;inntastet verdi for uenighet 1;underlabel-1.1, undervalue-1.1 - underlabel-1.2, undervalue-1.2;id for uenighet 1;hei1@nav.no;${submittedDateFormatted};ser bra ut 👍;123

label for uenighet 2;inntastet verdi for uenighet 2;underlabel-2.1, undervalue-2.1 - underlabel-2.2, undervalue-2.2;id for uenighet 2;ukjent bruker;${submittedDateFormatted};ser veldig bra ut 👍;456
label for uenighet 3;inntastet verdi for uenighet 3;underlabel-3.1, undervalue-3.1 - underlabel-3.2, undervalue-3.2;id for uenighet 3;hei3@nav.no;${submittedDateFormatted};ser veldig bra ut 👍;456
`.trim()
    );
});

test('should handle uenigheter without the items field', () => {
    const feedbacks = [
        {
            key: '789',
            value: {
                uenigheter: [
                    {
                        id: 'id for uenighet 4',
                        label: 'label for uenighet 4',
                        value: 'inntastet verdi for uenighet 4',
                        userId: {},
                        date: feedbackDate
                    }
                ],
                kommentarer: 'silky 👍 smooth',
                submittedDate
            }
        }
    ];

    expect(csvMapper(feedbacks)).toBe(
        `
${headerLine}
label for uenighet 4;inntastet verdi for uenighet 4;;id for uenighet 4;ukjent bruker;${submittedDateFormatted};silky 👍 smooth;789
`.trim()
    );
});

test('should output N/A for empty fields', () => {
    const feedbacks = [
        {
            key: '135',
            value: {
                uenigheter: [
                    {
                        id: 'id for uenighet 5',
                        label: 'label for uenighet 5',
                        value: 'inntastet verdi for uenighet 5',
                        userId: {},
                        date: feedbackDate
                    }
                ],
                kommentarer: undefined,
                submittedDate: undefined
            }
        }
    ];

    expect(csvMapper(feedbacks)).toBe(
        `
${headerLine}
label for uenighet 5;inntastet verdi for uenighet 5;;id for uenighet 5;ukjent bruker;N/A;N/A;135
`.trim()
    );
});
