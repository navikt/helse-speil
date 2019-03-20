import React from 'react'
import PropTypes from 'prop-types'
import './LabelWithIcon.scss'

const LabelWithIcon = ({ label, iconSrc }) => (
   <div className='labelWithIcon'>
      <img className='labelWithIcon__icon' src={iconSrc} />
      <span className='labelWithIcon__label'>{label}</span>
   </div>
)

LabelWithIcon.propTypes = {
   label: PropTypes.string.isRequired,
   iconSrc: PropTypes.string.isRequired
}

export default LabelWithIcon
