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

//Strona do logowania

const styles= {
  root: {
    height: '100vh',
  },
  paper: {
    margin: "200px 32px",
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
  },
  helperText: {
    color: "red"
  },
}

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            email:'',  
            emailError: '',
            formError: false,
        } 
            
        this.reset = this.reset.bind(this); 
        this.handleChange = this.handleChange.bind(this); 
        this.emailRegex = this.emailRegex.bind(this);
    } 
    // sprawdzenie za pomocą wyrazenia regularnego czy podana wartość to email
    emailRegex =()=> RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  handleChange=(e)=>{
    const {id,value} = e.target;  
    let emailError = this.state.emailError;  
    console.log("TEst")
    if(id==='email'){
        emailError = this.emailRegex().test(value) 
        ? ''
        :'Niepoprawna struktura adresu email'; 
    }
    this.setState({emailError,[id]:value}, () => console.log(this.state));
  }  
 
  reset = (e) =>{  
     //zabezpieczenie przed przeładowaniem strony, gdy użytkownik nacisnie przycisk
    e.preventDefault();  
    console.log(this.state)
    if(this.state.emailError.length>0 || this.state.email===""){
        this.setState({formError: true})
    }else {  
        try{
            let auth = fire.auth(); 
            auth.sendPasswordResetEmail(this.state.email).then(function(){
                window.alert("Email został wysłany.");
            })
        } 
        catch(error){ 
            console.error("Bład bazy danych przy próbie zresetowania hasła") 
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)   
        } 
    }
  }
    render(){
      const error = this.state.formError; 
      let message;

      if(error){
        message =<div style={styles.errorMessage}> Błędnie uzupełniony formularz</div>;
      }
        return (
            <Grid container component="main" style={styles.root}>
            <CssBaseline /> 
            <Image/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div style={styles.paper}>
                <Typography component="h1" variant="h5">
                    Nie pamietasz hasła?
                </Typography>
                <Typography component="h1" variant="subtitle1">
                   Aby zresetować hasło należy wpisać poniżej swój email, na który zostanie wysłana informacja o tym jak odzyskać konto.
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
                        helperText={this.state.emailError.length>0 && (this.state.emailError)}
                        FormHelperTextProps={{
                        style: styles.helperText
                        }}
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={styles.submit}
                    onClick={this.reset}
                    >
                    Resetuj hasło
                    </Button>
                    {message}
                    <Grid container>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                            {"Wróć do strony logowania"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                </div>
            </Grid>
            </Grid>
        );
    }
}

export default withRouter(LoginPage);