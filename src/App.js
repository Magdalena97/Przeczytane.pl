import React from 'react';
import LoginPage from './containers/authorization/LoginPage'; 
import ResetPassword from './containers/authorization/ResetPassword';
import RegistrationPage from './containers/authorization/RejestrationPage'; 
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import Dashboard from './containers/dashboard/Dashboard'; 
import NotFound from './containers/NotFound'; 
import AuthProvider from './firebaseConf/Auth'; 
import PrivateRouteDashboard from "./router/PrivateRouteDashboard";

class App extends React.Component {  
  constructor(props){
    super(props); 
  } 
  render(){  
    return ( 
      <div>
        <AuthProvider>
          <Router>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/resetpassword" component={ResetPassword} />
              <Route exact path="/registration" component={RegistrationPage}/> 
              <Route exact path="/404" component={NotFound} />
              <PrivateRouteDashboard path="/" component={Dashboard}/>
            </Switch>
          </Router>
         </AuthProvider>
    </div>
    ); 
  }
}

export default App;
