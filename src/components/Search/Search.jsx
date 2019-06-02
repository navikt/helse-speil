import React, { createContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { behandlingerFor } from '../../io/http'
import './Search.css'

const BehandlingerProvider = createContext([]).Provider;

const Search = () => {
   return (
      <BehandlingerProvider>
         <div className="input-icon-wrap">
            <span className="input-icon">
               <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
               type="text"
               className="input-with-icon"
               placeholder="FNR eller aktør"
               onKeyPress={keyTyped}
            />
         </div>
      </BehandlingerProvider>
   )
}

const keyTyped = (event) => {
   if (event.target.value.trim().length === 0) {
      return
   }

   const isEnter = (event.charCode || event.keyCode) === 13
   if (isEnter) {
      behandlingerFor(event.target.value)
         .then(response => {
            console.log(response)
            BehandlingerProvider.value = response || null
         })
         .catch(err => {
            console.log(err)
         })
   }
}

export default Search

