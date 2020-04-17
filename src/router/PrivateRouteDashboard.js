import React, {useContext} from "react"; 
import {Route, Redirect} from "react-router-dom" ;
import {AuthContext} from '../firebaseConf/Auth'; 

//jako argument podawany jest komponent który ma zostać 
//wyrederowany jak user nie będzie zalogowany
const PrivateRoute = ({component: RouteComponent, ...rest}) =>{
    //mamy dostep do informacji czy użytkownik jest zalogowany czy nie
    const {currentUser} = useContext(AuthContext);

    console.log("Stan currentUser sprawdzany w PrivateRouteDashboard")
    console.log('currentUser', currentUser)

    return (    
        <Route 
            {...rest}
            render={routeProps =>
                !!currentUser ? (
                     <RouteComponent {...routeProps}/>
                ) : (
                     <Redirect to={"/login"}/> 
                  
                )
            }
        />
    );
};

export default PrivateRoute;