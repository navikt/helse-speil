const { csvMapper } = require('./feedback-csv-mapper');

test('csv mapper should map feedback from json to csv', () => {
    const submittedDate = '2019-08-29T16:59:04+02:00';
    const feedbackDate = '2019-08-29T16:39:04+02:00';
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
                submittedDate: submittedDate
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
                submittedDate: submittedDate
            }
        }
    ];

    const result = csvMapper(feedbacks);

    expect(result).toBe(
        `
uenighet-label;uenighet-value;uenighet-items;uenighet-id;uenighet-userId;submittedDate;kommentarer;behandlingsId
label for uenighet 1;inntastet verdi for uenighet 1;underlabel-1.1, undervalue-1.1 - underlabel-1.2, undervalue-1.2;id for uenighet 1;hei1@nav.no;${submittedDate};ser bra ut 👍;123

label for uenighet 2;inntastet verdi for uenighet 2;underlabel-2.1, undervalue-2.1 - underlabel-2.2, undervalue-2.2;id for uenighet 2;ukjent bruker;${submittedDate};ser veldig bra ut 👍;456
label for uenighet 3;inntastet verdi for uenighet 3;underlabel-3.1, undervalue-3.1 - underlabel-3.2, undervalue-3.2;id for uenighet 3;hei3@nav.no;${submittedDate};ser veldig bra ut 👍;456
`.trim()
    );
});
