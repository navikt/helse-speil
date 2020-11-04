import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Vedtaksperiodeinfo from './Vedtaksperiodeinfo';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import { LoggHeader as EksternLoggheader } from '@navikt/helse-frontend-logg';
import { PersonContext } from '../../context/PersonContext';
import { Verktøylinje } from './Verktøylinje';
import { speilV2 } from '../../featureToggles';

const StyledSakslinje = styled(Sakslinje)`
    border: none;
    border-bottom: 1px solid #c6c2bf;
    > div:first-of-type {
        width: 250px;
    }
`;

const LoggHeader = speilV2
    ? EksternLoggheader
    : styled(EksternLoggheader)`
          height: 50px;
          justify-content: flex-start;
          box-sizing: border-box;
          width: 314px;
          background: #f8f8f8;

          > button {
              min-height: unset;
          }
      `;

export default () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    if (!personTilBehandling) return <Sakslinje />;

    return (
        <StyledSakslinje
            venstre={<Verktøylinje />}
            midt={<Vedtaksperiodeinfo periode={aktivVedtaksperiode} person={personTilBehandling} />}
            høyre={<LoggHeader />}
        />
    );
};
