import React, { useContext } from 'react'
import BehandlingerContext from '../../context/BehandlingerContext'
import './JsonView.css'

const JsonView = () => {

   const behandlingerCtx = useContext(BehandlingerContext)

   return (
            <div>
                { JSON.stringify(behandlingerCtx.state) }
            </div>
   )
}

export default JsonView

