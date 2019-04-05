import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './SingleSelectionList.css'

const SingleSelectionList = props => {
   const [selectedItem, setSelectedItem] = useState("")

   return (
      <nav>
         <h3>{props.heading}</h3>
         <ul>
            {props.items.map((element, index) => {
               const styleClass = element === selectedItem ? 'selected' : ''
               return (
                  <li
                     key={index}
                     className={styleClass}
                     onClick={() => {
                        setSelectedItem(element)
                     }}
                  >
                     {element}
                  </li>
               )
            })}
         </ul>
      </nav>
   )
}

SingleSelectionList.propTypes = {
   heading: PropTypes.string.isRequired,
   items: PropTypes.array.isRequired
}

export default SingleSelectionList
