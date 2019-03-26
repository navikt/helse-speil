import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './Search.css'

const Search = () => {
   return (
      <div className="input-icon-wrap">
         <span className="input-icon">
            <FontAwesomeIcon icon={faSearch} />
         </span>
         <input
            type="text"
            className="input-with-icon"
            placeholder="FNR eller aktør"
            onKeyPress={typed}
         />
      </div>
   )
}

const typed = (event) => {
   if (event.charCode === 13) {
      console.log(`should fire search for ${event.target.value}`)
   }
}

export default Search

