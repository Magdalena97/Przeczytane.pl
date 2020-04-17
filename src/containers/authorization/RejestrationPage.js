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

import {withRouter} from "react-router-dom"; 
import { AuthContext } from '../../firebaseConf/Auth';


//Strona do rejestracji

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
    border: "solid black 1px"
  },
  helperText: {
    color: "red"
  },
  errorMessage: {
    color:"red", 
    marginBottom: "10px",
    textAlign: "center",
  }
}  
// sprawdzenie za pomocą wyrazenia regularnego czy podana wartość to email
const emailRegex = RegExp(
 /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
 );
 // sprawdzenie za pomocą wyrazenia regularnego czy podana wartość to username
const usernameRegex = RegExp( 
  /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
);
const formValid = ({formErrors, ...rest}) =>{
  let valid = true; 
  //sprawdzanie czy pojawiły sie bledy przy walidacji formularza
  Object.values(formErrors).forEach(val=> {
    val.length>0 &&(valid = false)
  });
  //sprawdzanie czy pola w formularzu nie sa puste
  Object.values(rest).forEach(val=> {
    val==='' && (valid=false);
  });

  return valid;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


class RegistrationPage extends React.Component { 
  constructor(props) { 
    super(props); 
    //dane uzytkownika podawane przy rejestracji. 
    this.state={
      username: "", 
      email:"", 
      password:"",  
      //obiekt zapisujący błędu pojawiajace sie przy rejestracji użytkownika
      formErrors: {
        username: "", 
        email: "", 
        password: "", 
        repeatedPassword: ""
      },
      FormError: false, 
      EmailError: false,
    } 
  }  

  redirectToDashboard = () =>{ 
    console.log("Redirect to Dashboard. We are in PristarionPage")
    const {history} = this.props; 
    if(history) history.push("/");
  } 

  handleChange=(e)=>{
    e.preventDefault();
    const {id,value} = e.target;  
    let formErrors = this.state.formErrors;

    switch (id) {
      case 'username':  
        formErrors.username= usernameRegex.test(value) 
          ? ''
          :'Minimum 3 znaki.Znaki alfanumeryczne, kropki,podkreśniki.'; 
        break;
      case 'email':  
        formErrors.email= emailRegex.test(value) 
          ? ''
          :'Niepoprawna struktura adresu email'; 
        break;
      case 'password':  
        formErrors.password= value.length<6 
          ? 'minimum 6 znaków wymagane'
          :'' ; 
        formErrors.repeatedPassword = value.localeCompare(this.state.repeatedPassword)
        ? 'Hasło i powtórz hasło musza mieć równe wartości'
        : '';
        break;
      case 'repeatedPassword':  
        formErrors.repeatedPassword= value.localeCompare(this.state.password)
          ?'Hasło i powtórz hasło musza mieć równe wartości'
          :''; 
        break;
      default: 
        break;
    }
    this.setState({formErrors,[id]:value}, () => console.log(this.state));
  }

  handlePreSubmit = (setCurrentUser, setIsPendingSigning) => {
    return async (e) => await this.handleSubmit(e, setCurrentUser, setIsPendingSigning);
  }

  handleSubmit = async(e, setCurrentUser, setIsPendingSigning)=>{ 
    e.preventDefault(); 
    //poprawnie uzupelniony formularz
    if(formValid(this.state)){
      console.log(`
        --SUBMITING--
        User Name: ${this.state.username}
        Email: ${this.state.email}
        Password: ${this.state.password}
        RepeatedPasword: ${this.state.repeatedPassword}
      `)
      try {
        const result = await fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
        await result.user.updateProfile({
          displayName: this.state.username,
          quote: "Miejsce na Twoj cytat....Lorem ipsum dolor sit amet justo. Maecenas facilisis, wisi nunc, lobortis eu, posuere cubilia Curae, Mauris mattis vel, orci. Etiam vulputate, odio consequat ipsum primis in enim ut ante. Vestibulum vulputate. Donec faucibus, dolor urna felis, interdum ipsum primis in nunc. Fusce venenatis nulla pulvinar interdum, tortor libero, consectetuer massa."
        });

        await fire.auth().setPersistence(fire.firebase_.auth.Auth.Persistence.SESSION);
        setIsPendingSigning(true);
        await sleep(1000);
        const response = await  fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        setCurrentUser({
          ...response.user,
          logged: true,
          extraData: {
              books: []
          },
        });
        console.log("Rejestracja uzytkownika udała się")
        this.redirectToDashboard();
      } catch(error) {
        setIsPendingSigning(false);
        console.error("Bład przy rejestracji uzytkownika") 
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage) 
        this.setState({EmailError: true})
      }
    } //blednie uzupelniony formularz
    else {  
      console.error("FORM INVALID - DISPLAY ERROR MESSAGES"); 
      console.log(this.state) 
      this.setState({FormError: true})
    }
  } 
    render(){   
      const {formErrors}=this.state;  
      const {FormError}=this.state;  
      const {EmailError}=this.state;
      const errorMessage = <div style={styles.errorMessage}>Niepoprawnie uzupełniony formularz</div>
      const emailAlreadyExist = <div style={styles.errorMessage}>Użytkownik o podanym emailu został już zarejestrowany</div>
        return (
          <AuthContext.Consumer>
            {({setCurrentUser, setIsPendingSigning}) => (
              <Grid container component="main" style={styles.root}>
              <CssBaseline/> 
              <Image/>
              <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                  <div style={styles.paper}>
                  <Typography component="h1" variant="h5">
                      Zarejestruj się!
                  </Typography>
                  <form style={styles.form} onSubmit={this.handlePreSubmit(setCurrentUser, setIsPendingSigning)} noValidate>
                      <TextField
                      helperText={formErrors.username.length>0 && (formErrors.username)}
                      FormHelperTextProps={{
                        style: styles.helperText
                      }}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Użytkownik"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      onChange={this.handleChange}
                      />
                      <TextField
                      helperText={formErrors.email.length>0 && (formErrors.email)}
                      FormHelperTextProps={{
                        style: styles.helperText
                      }}
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
                      helperText={formErrors.password.length>0 && (formErrors.password)}
                      FormHelperTextProps={{
                        style: styles.helperText
                      }}
                      onChange={this.handleChange}
                      />
                      <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="repeatedPassword"
                      label="Powtórz hasło"
                      type="password"
                      id="repeatedPassword"
                      autoComplete="repeated-password"
                      helperText={formErrors.repeatedPassword.length>0 && (formErrors.repeatedPassword)}
                      FormHelperTextProps={{
                        style: styles.helperText
                      }}
                      onChange={this.handleChange}
                      />
                      
                      <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={styles.submit}
                      >
                      Zarejestruj 
                      </Button>
                      {formValid(this.state)===false && FormError && (errorMessage)}  
                      {EmailError ===true &&(emailAlreadyExist)}
                      <Grid container>
                      <Grid item>
                          <Link href="/login" variant="body2">
                          {"Masz już konto? Zaloguj się"}
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

export default withRouter (RegistrationPage);