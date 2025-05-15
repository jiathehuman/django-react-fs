// We must have access token before we access this route
import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants"
import {useState, useEffect} from "react"

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(()=>{
        auth().catch(()=>setIsAuthorized(false))
    },[])

    const refreshToken = async () => {
        // refresh token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try{
            // Send response to this route with payload of refresh token
            const res = await api.post("/api/token/refresh/",{
                refresh: refreshToken,
            })
            if(res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.acccess)
                setIsAuthorized(true)
            } else{
                setIsAuthorized(false)
            }
        }catch(error){
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async() => {
        // check if we have refresh token and if expired
        // if expired, login again
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token){
            setIsAuthorized(false)
            return
        }
        // give us value and expiration date
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000
        if (tokenExpiration < now){
            await refreshToken()
        } else{
            // Good to go
            setIsAuthorized(true)
        }

    }

    if(isAuthorized == null){
        return <div>Loading</div>
    }

    return isAuthorized ? children: <Navigate to="/login"/>
}

export default ProtectedRoute