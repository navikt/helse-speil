import {createContext} from 'react'

const ApplicantContext = createContext({
    name: "",
    fnr: "",
    phone: ""
})

export default ApplicantContext