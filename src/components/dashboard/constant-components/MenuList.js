import React, { useContext,useState } from 'react';  
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles'; 
import Avatar from '@material-ui/core/Avatar';

import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';
import ViewListIcon from '@material-ui/icons/ViewList'; 
import ExitToAppIcon from '@material-ui/icons/ExitToApp'; 
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'; 

import {Link,BrowserRouter as Router} from 'react-router-dom';

import fire from '../../../firebaseConf/Firebase'; 
import * as firebase from 'firebase/app'; 
import {connect} from 'react-redux';
import {CHANGE_MOBILE_OPEN} from '../../../redux/actionTypes';
import { AuthContext } from '../../../firebaseConf/Auth';
import { Grid } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import defaultAvatarSrc from '../../../images/user/devaultAvatar.png';

//komponent tworzy liste menu na stronie dashboard 
// po wybraniu opcji z menu użytkownik powienien zostac przekierowany na odpowiednia podstronę

let iconTable = [<MenuBookTwoToneIcon/>,<AddCircleOutlineIcon/>,<AccountBoxTwoToneIcon/>,<ViewListIcon/>,<ExitToAppIcon/>,<HighlightOffOutlinedIcon/>];

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: 240,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: 240,
    },
    helperText: {
      color: "red"
    },
    errorMessage: {
      color:"red", 
      textAlign: "center",
    } 
  }));

function MenuList(props){
    const classes = useStyles();
    const {currentUser, logout} = useContext(AuthContext);
    const { container } = props;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [userData,setUserData] = useState({
      userPassword: "",
      formErrors: {
        userPassword: "", 
      },
      FormError: false, //błednie wypełniony formularz
    })
    const {FormError} = userData; 
    const errorMessage = <div className={classes.errorMessage}>Niepoprawnie uzupełniony formularz</div>
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setUserData({ 
        userPassword: "", 
        formErrors:{
        userPassword: "",
      }}, 
      )
    };

    const handleChange=(e)=>{
      e.preventDefault(); 
      const {id,value} = e.target ;   
      console.log("Wartość modyfikowanego pola");
       console.log(value); 
      // console.log(id);   
      switch(id){
        case "password": 
          console.log("Następuje zmiana pola password");  
          setUserData({...userData,userPassword: value, formErrors:{
            ...userData.formErrors,
            userPassword:  value.length<6 
            ? 'minimum 6 znaków wymagane'
            :'' 
          }}, 
          )
          break;
        default:
          break;
      } 
    }; 

    const handleClick = () =>logout(); 

    const handleLinkClick = () => {
      if (props.mobileOpen) {
        props.changeMobileOpen();
      }
    }

    const deleteAccount= async(e)=>{  
      e.preventDefault(); 
      if(userData.formErrors.userPassword.length>0 || userData.userPassword===''){
        //niepoprawnie wypełniony formularz
        console.error("FORM INVALID - DISPLAY ERROR MESSAGES");  
        setUserData({...userData,FormError: true}) 
      }else {
        try{
          //poprawnie wypełniony formularz 
          var user = fire.auth().currentUser;
          console.log("Sprawdznie hasła") 
          console.log(userData.userPassword) 
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            userData.userPassword
          );

          user.reauthenticateWithCredential(credential).then(function() {
            // Powtórna audentykacja
            console.log("Podane jest prawidlowe haslo ")
            user.delete().then(function() {
              // Usunięcie uzytkownika
              console.log("Uzytkownik został prawidłowo usuniety") 
              window.location.reload();
            }).catch(function(error) {
              // Złapanie błedu
              console.log("Uzytkownik nie został prawidłowo usuniety")
              console.log(error);
            });
          }).catch(function(error) {
            // Złapanie błedu
            console.log("Podane jest nieprawidlowe haslo ") 
            console.log(error)
            setUserData({...userData,FormError: true}) 
          }); 
      } catch(error){
          console.log("Błąd przy próbie usunięcia uzytkownika")  
          console.log(error)
      }
      }
    }

    const drawer = (
        <div>
          <div className={classes.toolbar}>
            <ListItem>
              <Grid container direction="row" justify="flex-start" alignItems="flex-end" spacing={2}>
                <Grid item>
                  <Avatar alt="Zdjęcie użytkownika" src={currentUser.extraData.avatar || defaultAvatarSrc} />
                </Grid> 
                <Grid item>
                  <ListItemText primary={currentUser.displayName || 'brak'} /> 
                </Grid>
              </Grid>
            </ListItem>
          </div>
          <Divider />
          <List>
            {[
              {
                name: "Moje książki",
                url: '/mybooks/1'
              },
              {
                name: "Dodaj książkę", 
                url: '/addbook'
              },
              {
                name: "Mój profil",
                url: '/myprofile'
              },
              {
                name: "Kategorie",
                url: '/category'
              },
            ].map((object, index) => (
              <Link onClick={handleLinkClick} to={object.url} key={index} style={{ textDecoration: 'none' }}> 
                <ListItem button>
                <ListItemIcon>
                  {iconTable[index]} 
                </ListItemIcon> 
                <ListItemText primary={object.name} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>{iconTable[4]}</ListItemIcon>
              <ListItemText primary={'Wyloguj się'}/>
            </ListItem>
            <ListItem button onClick={handleClickOpen}>
              <ListItemIcon>{iconTable[5]}</ListItemIcon>
              <ListItemText primary={'Usuń konto'}/>
            </ListItem>
          </List>
        </div>
      );

    const handleDrawerToggle = () => { 
      console.log("Zmienna wartości zmiennej changeOpen")
      props.changeMobileOpen();
    };
    console.log("props.mobileOpen w menu list ") 
    console.log(props.mobileOpen)
    return( 
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={props.mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, 
                }}
            >
                {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
                {drawer}
            </Drawer>
          </Hidden>

          <div>
      
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Trawałe usuwanie konta"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Czy jesteś pewnien, że chcesz trwale usunąć konto wraz ze wszystkimi zgromadzonymi w nim danymi? By usunąć konto podaj swoje hasło.
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Hasło"
                type="password"
                fullWidth
                helperText={userData.formErrors.userPassword.length>0 && (userData.formErrors.userPassword)}
                FormHelperTextProps={{
                  className:classes.helperText
                }}
                onChange={handleChange}
              />
            </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Anuluj
            </Button>
            <Button onClick={deleteAccount} color="primary" autoFocus>
              Usuń
            </Button>
          </DialogActions>
          {FormError && (errorMessage)}
        </Dialog>
      </div>
    </nav>  
    );  
}  
//Zamplementowana obsluga przez technologie redux  zmiennej mobileOpen
const mapStateToProps = state => ({
  mobileOpen: state
}); 

function matchDispatchToProps(dispatch){
  console.log("jestem tu" )
  return {
    changeMobileOpen: ()=>dispatch({type: CHANGE_MOBILE_OPEN})
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(MenuList);