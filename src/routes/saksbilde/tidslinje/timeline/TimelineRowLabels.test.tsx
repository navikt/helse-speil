import React from 'react';

import { RowLabel } from '@saksbilde/tidslinje/timeline/index';
import { ExpandedRowsContext, ToggleRowContext } from '@saksbilde/tidslinje/timeline/row/context';
import { render, screen } from '@test-utils';

import { TimelineRowLabels } from './TimelineRowLabels';

describe('TimelineRowLabels', () => {
    it('merker arbeidsgivernavn som sensitivt', () => {
        renderLabels([enLabel({ label: 'Hos Ola AS', organisasjonsnummer: '987654321', rowIndex: 0 })]);

        expect(screen.getByText('Hos Ola AS')).toHaveAttribute('data-sensitive');
    });

    it('sladder ikke Infotrygd-raden', () => {
        renderLabels([enLabel({ label: 'Infotrygd', rowIndex: 0 })]);

        expect(screen.getByText('Infotrygd')).not.toHaveAttribute('data-sensitive');
    });
});

function enLabel(overrides: Partial<RowLabel>): RowLabel {
    return {
        label: 'En label',
        icon: <span />,
        rowIndex: 0,
        generationLevels: 0,
        copyLabelButton: false,
        ...overrides,
    };
}

function renderLabels(labels: RowLabel[]) {
    return render(
        <ExpandedRowsContext.Provider value={new Set()}>
            <ToggleRowContext.Provider value={() => {}}>
                <TimelineRowLabels labels={labels} />
            </ToggleRowContext.Provider>
        </ExpandedRowsContext.Provider>,
    );
}
