import React , { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Toolbar } from '@material-ui/core';
import  Typography from '@material-ui/core/Typography';
import { AuthContext } from '../../../firebaseConf/Auth';
import Button from '@material-ui/core/Button'; 
import defaultAvatarSrc from '../../../images/user/devaultAvatar.png';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ImageUploader from 'react-images-upload';
import {Link} from 'react-router-dom';
import fire, { db } from '../../../firebaseConf/Firebase';

import * as firebase from 'firebase/app';

const useStyles = makeStyles(theme=>({
  table: {
    //minWidth: 1200, 
    width: 1000
  },
  toolbar: theme.mixins.toolbar,
  title: {
    flex: '1 1 100%',
  },
  root: {
    padding: theme.spacing(3),
  },
  overlayContainer: { 
    position: "relative",
    maxWidth: "200px",
  },
  overlayTitle: {
    display: "block",
    position: "absolute",
    backgroundColor: "grey",
    opacity: "0.85",
    bottom: "5px",
    color: "white",
    textAlign: "center",
    fontSize: "12px",
    width: "100%",
    padding: "10px 0 10px 0", 
    cursor: "pointer",
  },
  overlayImage: {
    width: "200px",
    //maxWidth: "200px"
  },
  overlayHover: {
    display: "none",
  },
  showInformation: {
    display: "flex", 
  },  
  insideInformation: {
    display: "flex",  
    flexDirection: "column",
    marginLeft: "15px",
  },
  showName: {
    maxHeight: "50px", 
    marginBottom: "15px",
  }, 
  quote: {
    maxHeight: "130px", 
    maxWidth: "800px" 
  },
  helperText: {
    color: "red"
  }, 
  textField: {
    width:"400px",
  },
  errorMessage: {
    color:"red", 
    textAlign: "center",
  }, 
}));
 
export default function MyProfile() {
  const classes = useStyles(); 
  const {currentUser, updateExtraData} = useContext(AuthContext);

  //zmienna zarządzająca css-owymi klasami 
  const [hovered,setHovered] = useState(false);

  const toggleHover = () => setHovered(!hovered);  
  //zmienne sterujace componentem Dialog
  const [openName, setOpenName] = useState(false); 
  //const [openEmail,setOpenEmail] = useState(false); 
  const [openPassword,setOpenPassword] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [openQuote,setOpenQuote] = useState(false);  
  //zmienne zawierajace informacje o zmienionych danych

  const [newUserData, setNewUserData] = useState({
    newUserName: "", 
    oldUserPassword: "",
    newUserPassword:"",
    newUserRepeatPassword: "", 
    newUserQuote: "", 
    formErrors: {
      newUserName: "", 
      oldUserPassword: "", 
      newUserPassword:"",
      newUserRepeatPassword: "",
      newUserQuote: "", 
    },
    newAvatar: currentUser.extraData.avatar,
    FormError: false, //błednie wypełniony formularz
  })

  useEffect(()=>{ 
    console.log("Jestemy w useffect")
    console.log(newUserData)
  })

  const handleClickOpen = (props) => {
    switch (props){
      case "username":  
        setOpenName(true); 
        break;
      case "password":  
        setOpenPassword(true); 
        break;
      case "quote":  
        setOpenQuote(true); 
        break;
      case "avatar":  
        setOpenAvatar(true); 
        break;
      default:
        break;
    } 
  }; 

  const handleAvatarRemove = async () => {
    setNewUserData({ ...newUserData, newAvatar: '' });
    await db.ref(`users/${currentUser.uid}`).update({
      avatar: ''
    });
    setNewUserData({
      ...newUserData,
      newAvatar: ''
    });
    setOpenAvatar(false);
    updateExtraData({ avatar: '' });
  }

  const handleClose = () => {
    setOpenAvatar(false);
    setOpenName(false);
    setOpenPassword(false);
    setOpenQuote(false); 
    //jak uzytkownik naciśnie anuluj to usuwają sie błedy 
    setNewUserData({ 
      newUserName: "", 
      oldUserPassword: "", 
      newUserPassword:"",
      newUserRepeatPassword: "",
      newUserQuote: "",
      formErrors:{
        newUserName: "",
        oldUserPassword: "", 
        newUserPassword:"",
        newUserRepeatPassword: "",
        newUserQuote: "",
      },
      newAvatar: currentUser.extraData.avatar
    })
  };
  // sprawdzenie za pomocą wyrazenia regularnego czy podana wartość to username
  const usernameRegex = RegExp( 
    /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  );

  const handleChange=(e)=>{
    e.preventDefault(); 
    const {id,value} = e.target ;   
    console.log("Wartość modyfikowanego pola");
     console.log(value); 

    switch(id){
      case "newUserName": 
        console.log("Następuje zmiana pola User Name");  
        setNewUserData({...newUserData,newUserName: value, formErrors:{
          ...newUserData.formErrors,
          newUserName:  usernameRegex.test(value) 
          ? ""
          :"Minimum 3 znaki.Znaki alfanumeryczne, kropki, podkreśniki. Znak spacji niedozwolony"  
        }}, 
        )
        break;
      case "oldPassword": 
        console.log("Następuje zmiana pola Old Password"); 
        setNewUserData({...newUserData,oldUserPassword: value,formErrors:{
          ...newUserData.formErrors,
          oldUserPassword: value.length<6 
          ? 'minimum 6 znaków wymagane'
          :'' 
        }})   
        break;
      case "newPassword": 
        console.log("Następuje zmiana pola New Password"); 
        setNewUserData({...newUserData,newUserPassword: value,formErrors:{
          ...newUserData.formErrors,
          newUserPassword: value.length<6 
          ? 'minimum 6 znaków wymagane'
          :'' , 
          newUserRepeatPassword: newUserData.newUserRepeatPassword.length>0 && value.localeCompare(newUserData.newUserRepeatPassword)
          ? 'Hasło i powtórz hasło musza mieć równe wartości'
          : ''
        }})   
        break; 
      case "repeatedPassword": 
        console.log("Następuje zmiana pola repeated Password"); 
        setNewUserData({...newUserData,newUserRepeatPassword: value,formErrors:{
          ...newUserData.formErrors,
          newUserRepeatPassword: value.localeCompare(newUserData.newUserPassword)
            ? 'Hasło i powtórz hasło musza mieć równe wartości'
            : ''
        }})  
        break; 
      case "quote": 
        console.log("Następuje zmiana pola quote"); 
        setNewUserData({ ...newUserData, newUserQuote: value, formErrors:{
            ...newUserData.formErrors,
            newUserQuote: value.length>400 
              ? 'Maksimum 400 znaków dozwolonych' 
            : ''
        }}) 
        break;
      default:
        break;
    } 
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleAvatarDrop = async (picture) => {
    const avatar = await toBase64(picture[0]);
    setNewUserData({ ...newUserData, newAvatar: avatar });
  };

  const saveAvatar = async () => {
    await db.ref(`users/${currentUser.uid}`).update({
      avatar: newUserData.newAvatar
    });
    setNewUserData({ ...newUserData, newAvatar: newUserData.newAvatar })
    setOpenAvatar(false);
    updateExtraData({ avatar: newUserData.newAvatar });
  }

  const saveQuote = async (e) => {
    e.preventDefault();  
    if(newUserData.formErrors.newUserQuote.length>0){
      //niepoprawnie uzupełniony formularz 
      console.error("FORM INVALID - DISPLAY ERROR MESSAGES"); 
      setNewUserData({...newUserData,FormError: true}) 
    } else{ 
      try{
        await db.ref(`users/${currentUser.uid}`).update({
          quote: newUserData.newUserQuote
        });
        console.log('newUserData.newUserQuote', newUserData.newUserQuote)
        updateExtraData({ quote: newUserData.newUserQuote });
        }catch(error){
          console.error("Bład przy aktualizacji cytatu użytkownika") 
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
        }
        handleClose(false);
      }
  }

  const saveNewName = async (e)=> { 
    e.preventDefault();  
    //czy poprawnie uzupełniony formularz
    if(newUserData.formErrors.newUserName.length>0 || newUserData.newUserName===''){
      //niepoprawnie uzupełniony formularz 
      console.error("FORM INVALID - DISPLAY ERROR MESSAGES"); 
      setNewUserData({...newUserData,FormError: true}) 
    } else{
      //poprawnie uzupełniony formularz 
      try{
        const user = await fire.auth().currentUser;
        user.updateProfile({
          displayName: newUserData.newUserName,
        })
        console.log("Akualiacja nazwy uzytkownika się powiodła") 

      } catch(error) {
        console.error("Bład przy aktualizacji nazwy użytkownika") 
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage) 
      }
      setOpenName(false);
      window.location.reload();
    }
  }; 

  const savePassword = async (e) => {
    e.preventDefault(); 
    //poprawnie uzupełniony formularz
    if(newUserData.formErrors.newUserPassword.length>0 || newUserData.formErrors.newUserRepeatPassword.length>0 || newUserData.newUserPassword==="" || newUserData.newUserRepeatPassword===""){
      //niepoprawnie uzupełniony formularz
      console.error("FORM INVALID - DISPLAY ERROR MESSAGES"); 
      setNewUserData({...newUserData,FormError: true}) 
    }else { 
      //poprownie uzupełniony formularz 
      try{
        var user = fire.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email, 
          newUserData.oldUserPassword
        );

        // Prompt the user to re-provide their sign-in credentials
        user.reauthenticateWithCredential(credential).then(function() {
          // User re-authenticated.
          console.log("Podane jest prawidlowe haslo ")
        }).catch(function(error) {
          // An error happened.
          console.log("Podane jest nieprawidlowe haslo ")
        });

        user.updatePassword(newUserData.newUserPassword).then(function() {
          // Update successful.
          console.log("Hasło zostało zaktualizowane ")
          setOpenPassword(false);
        }).catch(function(error) {
          // An error happened.
          console.log(error)
          console.log("Hasło nie zostało zaktualizowane ")
          setNewUserData({...newUserData,FormError: true}) 
        }); 
        
      }catch(error) {
        console.log("Błąd przy próbie zmiany hasła")  
        console.log(error)
      }
    }
  }

  const {FormError} = newUserData; 
  const errorMessage = <div className={classes.errorMessage}>Niepoprawnie uzupełniony formularz</div>
 
  // console.log("currenrUser w MyProfile"); 
  // console.log(currentUser);
  
  return (
    <div className={classes.root}>
      <div className={classes.toolbar}/>  
      <div className={classes.showInformation}>
        <div className={classes.overlayContainer} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
          <img src={currentUser.extraData.avatar || defaultAvatarSrc} className={classes.overlayImage} alt="Zdjęcie użytkownika" />
        <div className={hovered ? classes.overlayTitle: classes.overlayHover} onClick={() => handleClickOpen('avatar')}>Aktualizuj</div>
        </div> 
        <div className={classes.insideInformation}>
          <div className={classes.showName}> 
            <h3>Witaj &nbsp;
            {currentUser.displayName || 'brak'} 
            !</h3>
          </div> 
          <div className={classes.quote}> 
            <p>Ulubiony cytat</p> 
            <p><i>{currentUser.extraData.quote || 'Tu jest miejsce na cytat z Twojej ulubionej książki'}</i></p>
          </div>
        </div>
      </div>
    {/*TABELA*/}
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle">Ogólne ustawienia konta i dane statystyczne</Typography>
    </Toolbar>
    <TableContainer component={Paper} className={classes.table}>
      <Table /*className={classes.table}*/ aria-label="simple table">
        <TableBody> 
          <TableRow >
            <TableCell component="th" scope="row">
              <b>Nazwa użytkownika</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i>{currentUser.displayName || 'brak'}</i>
            </TableCell>
            <TableCell component="th" scope="row">
              <Button size="small" variant="outlined" onClick={() => handleClickOpen("username")} > 
                Edytuj
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Email</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i>{currentUser.email}</i>
            </TableCell>
            <TableCell component="th" scope="row">
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Hasło</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i>********</i>
            </TableCell>
            <TableCell component="th" scope="row">
              <Button size="small" variant="outlined" onClick={() => handleClickOpen("password")} > 
                Zmień
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Cytat</b>
            </TableCell>
            <TableCell component="th" scope="row">
              {/* <i>{currentUser.extraData.quote.substr(0,80)|| 'Tu jest miejsce na cytat z Twojej ulubionej książki'}</i> */}
            </TableCell>
            <TableCell component="th" scope="row">
              <Button size="small" variant="outlined" onClick={() => handleClickOpen("quote")} > 
                Edytuj
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Ogólna ilość książek</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i>{currentUser.extraData.books.length}</i>
            </TableCell>
            <TableCell component="th" scope="row">
              <Link to= "/mybooks" style={{ textDecoration: 'none' }}>
                <Button size="small" variant="outlined" > 
                  Przejdź
                </Button>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Ogólna ilość kategorii</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i>15</i>
            </TableCell>
            <TableCell component="th" scope="row">
              <Link to= "/category" style={{ textDecoration: 'none' }} >
                <Button size="small" variant="outlined" > 
                  Przejdź
                </Button>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Data założenia konta</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i> { new Date(currentUser.metadata.creationTime).toLocaleDateString('pl-PL',{day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'numeric'})}</i>
            </TableCell>
            <TableCell component="th" scope="row">
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Data ostatniego logowania</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <i>{ new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('pl-PL',{day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'numeric'})}</i>
            </TableCell>
            <TableCell component="th" scope="row">
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    {/*-----------------------DIALOG COMPONENT ------------------------------------------*/} 
    <Dialog open={openName} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Ustawienia profilu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Zmiana nazwy użytkownika
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newUserName"
            label="Nowa nazwa użytkownika"
            //fullWidth 
            className={classes.textField}
            helperText={newUserData.formErrors.newUserName.length>0 && (newUserData.formErrors.newUserName)}
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
          <Button onClick={saveNewName} color="primary">
            Zapisz
          </Button> 
        </DialogActions>
        {FormError && (errorMessage)}
      </Dialog>

      <Dialog open={openAvatar} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edycja avatara</DialogTitle>
        <DialogContent>
          <img src={newUserData.newAvatar || defaultAvatarSrc} alt="Podgląd zdjęcia" className={classes.overlayImage} />
          <ImageUploader
            key={newUserData.newAvatar}
            withLabel={false}
            singleImage
            buttonText='Wybierz zdjęcie'
            onChange={handleAvatarDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={handleAvatarRemove} color="primary">
            Usuń
          </Button>
          <Button onClick={saveAvatar} color="primary">
            Zapisz
          </Button> 
        </DialogActions>
        {FormError && (errorMessage)}
      </Dialog>

      <Dialog open={openPassword} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Ustawienia profilu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Zmiana hasła
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="oldPassword"
            label="Stare hasło"
            type="password"
            fullWidth
            helperText={newUserData.formErrors.oldUserPassword.length>0 && (newUserData.formErrors.oldUserPassword)}
            FormHelperTextProps={{
              className:classes.helperText
            }}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="Nowe hasło"
            type="password"
            fullWidth
            helperText={newUserData.formErrors.newUserPassword.length>0 && (newUserData.formErrors.newUserPassword)}
            FormHelperTextProps={{
              className:classes.helperText
            }}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="repeatedPassword"
            label="Powtórz hasło"
            type="password"
            fullWidth
            helperText={newUserData.formErrors.newUserRepeatPassword.length>0 && (newUserData.formErrors.newUserRepeatPassword)}
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
          <Button onClick={savePassword} color="primary">
            Zapisz
          </Button>
        </DialogActions>
        {FormError && (errorMessage)}
      </Dialog>

      <Dialog open={openQuote} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Ustawiania profilu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Zmiana cytatu
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="quote"
            label="Nowy cytat"
            //fullWidth
            className={classes.textField}
            multiline 
            rows="4"
            rowsMax="6"
            helperText={newUserData.formErrors.newUserQuote.length>0 && (newUserData.formErrors.newUserQuote)}
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
          <Button onClick={saveQuote} color="primary">
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
