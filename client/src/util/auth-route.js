import { useContext } from 'react'
import { Redirect, Route } from "react-router-dom"
import { AuthContext } from '../context/auth'

function AuthRoute({ component: Component, ...rest }) {
    const { user } = useContext(AuthContext)

    return <Route
        {...rest}
        // render={props=> user? <Component/> :<Redirect to='/login'/>}
        //this is the opposite of protected route
        render={props => user ? <Redirect to='/' /> : <Component />}
    />
}

export default AuthRoute