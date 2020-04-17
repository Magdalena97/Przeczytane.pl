import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';  
import Image from '../../components/authorization/Image'; 
import fire from '../../firebaseConf/Firebase'; 
import {withRouter, Redirect} from "react-router"; 
import { AuthContext } from '../../firebaseConf/Auth';

//Strona do logowania

const styles= {
  root: {
    height: '100vh',
  },
  paper: {
    margin: "64px 32px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue. 
    marginTop: "8px",
  },
  submit: {
    margin: "24px 0px 16px",
  },  
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  }
}

class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      email:'', 
      password:'',
      error: false,
    } 
    this.signIn = this.signIn.bind(this); 
    this.handleChange = this.handleChange.bind(this);
  }

  

  redirectToDashboard = () =>{ 
    const {history} = this.props; 
    if(history) {
      console.log("przekierowywanie");
      history.push('/');
    }
  }

  handleChange=(e)=>{
    this.setState({
      [e.target.id]:e.target.value
    });
  }  

  signIn = (setCurrentUser, setIsPendingSigning) => (e) =>{  
    //zabezpieczenie przed przeładowaniem strony, gdy użytkownik nacisnie przycisk
    e.preventDefault();
    console.log("jestem w signIn i łacze sie z firebase");
    let states = this;

    async function login(email, password, redirect) {
      try {
        setIsPendingSigning(true);
        await fire.auth().setPersistence(fire.firebase_.auth.Auth.Persistence.SESSION);
        const response = await fire.auth().signInWithEmailAndPassword(email, password);
        setCurrentUser({
          ...response.user,
          logged: true,
          extraData: {
              books: []
          },
        });
        console.log('ok');
        redirect();
      } catch(error) {
        setIsPendingSigning(false);
        console.log(error)
        // An error happened
        console.log("Nieudane logowanie się");
        states.setState({error: true})
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode); 
        console.log(errorMessage);
      }
    }
    login(this.state.email, this.state.password, this.redirectToDashboard);
  }
    render(){
      const error = this.state.error; 
      let message;

      if(error){
        message =<div style={styles.errorMessage}> Niepoprawny e-mail lub hasło!</div>;
      }
        return (
          <AuthContext.Consumer>
            {({setCurrentUser, setIsPendingSigning}) => (
              <Grid container component="main" style={styles.root}>
                <CssBaseline /> 
                <Image/>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div style={styles.paper}>
                    <Typography component="h1" variant="h5">
                        Zaloguj się!
                    </Typography>
                    <form style={styles.form} noValidate>
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Twój adres e-mail"
                        name="email"
                        autoComplete="email"
                        autoFocus 
                        onChange={this.handleChange}
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Hasło"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={this.handleChange}
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          style={styles.submit}
                          onClick={this.signIn(setCurrentUser, setIsPendingSigning)}
                        >
                        Zaloguj
                        </Button>
                        {message}
                        <Grid container>
                        <Grid item xs>
                            <Link href="/resetpassword" variant="body2">
                            Zapomniałeś hasła?
                            </Link>
                        </Grid>
                        <Grid item>
                          <Link href="/registration" variant="body2">
                            {"Nie masz konta? Zarejestruj się"}
                          </Link>
                        </Grid>
                        </Grid>
                    </form>
                    </div>
                </Grid>
            </Grid>
            )}
          </AuthContext.Consumer>
        );
    }
}

export default withRouter(LoginPage);