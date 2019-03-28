import React from 'react'
import PropTypes from 'prop-types'
import './Summary.css'

const Summary = (props) => {

  const result = props.result;
  const originalSoknad = result.originalSøknad || result.uavklarteFakta.originalSøknad;

  return (
    <div className="applicant">
      <h3>Oppsummering</h3>
      <div className="labels">
      </div>
      <div id="testdiv">jauda2</div>
      <div id="aktorid">{originalSoknad.aktorId}</div>
    </div>
  )
}

const SoknadProps = PropTypes.shape({
  aktorId: PropTypes.string
});

const VerdierPropType = PropTypes.shape({
  medlemsskap: PropTypes.object,
  alder: PropTypes.object,
  maksdato: PropTypes.object,
  arbeidsforhold: PropTypes.object,
  opptjeningstid: PropTypes.object,
  sykepengegrunnlag: PropTypes.object
})

const ResultOkPropType = PropTypes.shape({
  originalSøknad: SoknadProps,
  avklarteVerdier: VerdierPropType
});

const ResultNotOkType = PropTypes.shape({
  feilmelding: PropTypes.string,
  uavklarteFakta : PropTypes.shape({
    originalSøknad: SoknadProps,
    faktagrunnlag : PropTypes.object,
    uavklarteVerdier: VerdierPropType
  })
});

Summary.propTypes = {
  result: PropTypes.oneOfType([ResultNotOkType, ResultOkPropType])
}

export default Summary