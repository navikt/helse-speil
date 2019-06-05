import React, {useState} from 'react'
import './MainContentWrapper.css'
import Search from '../Search/Search'
import JsonView from '../JsonView/JsonView'
import BehandlingerContext from '../../context/BehandlingerContext';

const MainContentWrapper = () => {

   const [behandlinger, setBehandlinger] = useState({behandlinger: []})

   return (
       <BehandlingerContext.Provider value={{state: behandlinger, setBehandlinger: setBehandlinger}}>
            <Search />
            <JsonView />
       </BehandlingerContext.Provider>
   )
}

export default MainContentWrapper

