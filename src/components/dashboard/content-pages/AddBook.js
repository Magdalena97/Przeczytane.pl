import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import ImageUploader from 'react-images-upload';

import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect'; 
import { AuthContext } from '../../../firebaseConf/Auth';
import { db } from '../../../firebaseConf/Firebase';
import { UserCategories } from '../../../constants/books';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    }, 
    uploadCover: {
      backgroundColor: "lightgrey",
      maxWidth: "340px", 
      height: "400px",
      border: "2px dotted grey", 
      display: "flex",
      alignItems:"center",
      justifyContent: "center",
    },  
    formControl: {
      margin: theme.spacing(1), 
      marginLeft: 0,
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    nativeSelects: {
      width: "100%"
    },
    helperText: {
      color: "red"
    },
    errorMessage: {
      color:"red", 
      marginBottom: "10px",
      textAlign: "center",
    }
}));

const formInitialState = {
  cover: "",
  title: "", 
  author: "", 
  category: "", 
  bookDescription: "", 
  publishers: "", 
  dateOfPublication: "",
  language: "",
  amountOfPages: "",
  identifier: "",
  format: "", 
  formErrors: {
    title: "", 
    author: "", 
    category: "", 
    bookDescription: "",
    identifier: "", 
  }, 
  formError: false, //czy poprawnie wypełniony formularz
};

function AddBook() {
  const classes = useStyles();
  const { currentUser, addBook } = useContext(AuthContext);
  const [showUpload, setShowUpload] = useState(false);
  const [newCover, setNewCover] = useState('');
  
  const [addBookData,setAddBookData] = useState({ ...formInitialState });

  const identifierRegex = RegExp(
    /^\d{8}(?:\d{2}|\d{5})?$/
  );

  useEffect(()=>{ 
    console.log("Jestemy w useffect AddBook")
    console.log(addBookData)
    console.log("Wartość zmiennej rating")
    console.log(rating)
  })

  //zmienna przechowujaca wartość rating
  const [rating, setRating] = React.useState(0); 

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  //zmiana okładki
  const handleCoverChange = async (picture) => {
    console.log("Następuje zmiana okładki");
    const cover = await toBase64(picture[0]);
    setNewCover(cover)
  }
 //usunięcie okładki
  const handleRemoveCover = () => {
    setAddBookData({ ...addBookData, cover: '' }); 
    setShowUpload(false);//zamyka okno dialogowe
    setNewCover('');
  }
  //dodatnie okładki
  const handleCoverPresave = () => {
    setAddBookData({ ...addBookData, cover: newCover }); 
    setShowUpload(false);
  };

  const handleChange=(e)=>{
    e.preventDefault(); 
    const {id,value} = e.target; 
    console.log("Wartość modyfikowanego pola");
    console.log(value); 
    console.log("Id modyfikowanego pola");
    console.log(id); 

    switch(id) {
      case "bookTitle": 
        console.log("Następuje zmiana pola booktitle");
        setAddBookData({...addBookData,title: value,formErrors:{
          ...addBookData.formErrors,
          title: value.length<3 
          ? 'minimum 3 znaki wymagane'
          :'',  
        }})   
        break; 
      case "author":
        console.log("Następuje zmiana pola author");
        setAddBookData({...addBookData,author: value,formErrors:{
          ...addBookData.formErrors,
          author: value.length<3 
          ? 'minimum 3 znaki wymagane'
          :'',  
        }})    
        break; 
      case "category": 
        console.log("Następuje zmiana pola category"); 
        setAddBookData({...addBookData,category: value, formErrors:{
          ...addBookData.formErrors,
          category: value<1 
          ? 'Proszę wybrać kategorię'
          :'',  
        }
        })  
        break; 
      case "bookDescription": 
        console.log("Następuje zmiana pola bookDescription"); 
        setAddBookData({...addBookData,bookDescription: value,formErrors:{
          ...addBookData.formErrors,
          bookDescription: value.length<10 
          ? 'minimum 10 znaków wymaganych'
          :'',  
        }})    
        break;
      case "publishers": 
        console.log("Następuje zmiana pola publishers"); 
        setAddBookData({...addBookData,publishers: value})    
        break;
      case "dateOfPublication": 
        console.log("Następuje zmiana pola dateOfPublication"); 
        setAddBookData({...addBookData,dateOfPublication: value})    
        break;
      case "language": 
        console.log("Następuje zmiana pola language"); 
        setAddBookData({...addBookData,language: value})  
        break; 
      case "amountOfPages": 
        console.log("Następuje zmiana pola amountOfPages"); 
        setAddBookData({...addBookData,amountOfPages: value})  
        break; 
      case "identifier": 
        console.log("Następuje zmiana pola identifier"); 
        setAddBookData({...addBookData,identifier: value, formErrors:{
          ...addBookData.formErrors,
          identifier: identifierRegex.test(value) 
          ? ""
          : " Niepoprawny numer (SBN/ISSN)"
        }})  
      break; 
      case "format": 
        console.log("Następuje zmiana pola format"); 
        setAddBookData({...addBookData,format: value})  
      break; 
      default:
        break;
    }
  }; 
  //funkcja sprawdzajaca poprawność pół
  const formValid = ({formErrors, ...rest}) =>{
    let valid = true; 
    //sprawdzanie czy pojawiły się błędy przy walidacji formularza
    Object.values(formErrors).forEach(val=> {
      val.length>0 &&(valid = false)
    });  

    //sprawdzanie czy pola w formularzu nie sa puste
    const hasEmptyRequiredFields = Object.keys(rest).some(val=> { 
      if (["title", "author", "category", "bookDescription", "identifier"].includes(val)) {
        console.log(val, rest[val])
      }
      return false;
    });
    if (hasEmptyRequiredFields) {
      valid = false;
    }
    return valid;
  };

  const handleSave = async (e) => {
    e.preventDefault(); 
    //czy wymagane dane zostały wpisane 
    if(formValid(addBookData)){
      //poprawnie uzupełnione dane  
      console.log( 
        ` 
        -----NEW BOOK DATA------ 
        Cover: ${addBookData.cover} 
        Title: ${addBookData.title} 
        Author: ${addBookData.author} 
        Category: ${addBookData.category} 
        Rating: ${rating} 
        BookDescription: ${addBookData.bookDescription} 
        Identifier: ${addBookData.identifier}
        Publishers: ${addBookData.publishers}
        DateOfPublication: ${addBookData.dateOfPublication}
        Language: ${addBookData.dateOfPublication}
        AmountOfPages: ${addBookData.amountOfPages}
        Identifier: ${addBookData.identifier}
        Format: ${addBookData.format}
        `
      )
      const book = {
        ...addBookData,
        rating,
        created: Date.now(),
      };
      delete book.formError;
      delete book.formErrors;

      const books = currentUser.extraData.books.concat([book]);
      await db.ref(`books/${currentUser.uid}`).update(books);
      addBook(book); 
      setAddBookData({ ...formInitialState });
      window.location.reload();
    } else {
      //niepoprawnie uzupełniony formularz  
      console.error("FORM INVALID - DISPLAY ERROR MESSAGES"); 
      setAddBookData({...addBookData,formError: true})
    }
  }

 const {formError}=addBookData 
 const errorMessage = <div className={classes.errorMessage}>Niepoprawnie uzupełniony formularz</div>
  return ( 
    <>
      <div className={classes.content}>
          <div className={classes.toolbar}/> 
            <h2>Podstawowe informacje o książce</h2> 
            <Grid container justify="flex-start" spacing={3} style={{ overflow: 'hidden', width: 'calc(100% + 18px)' }}>
              <Grid item md={5} xs={12}>
                <div style={{ position: 'relative' }} className={classes.uploadCover}>
                  <img style={{ position: 'absolute', width: '100%',height: "100%" }} src={addBookData.cover} alt="" /> 
                  <Button onClick={() => setShowUpload(true)} variant="contained" color="secondary">
                    Dodaj okładkę
                  </Button>
                </div>
              </Grid>
              <Grid item md={7} xs={12}> 
              <Box width={1}>
                <TextField
                  required 
                  id="bookTitle"
                  label="Tytuł książki"
                  style={{ margin: 8, marginLeft: 0 }}
                  placeholder="Wpisz przynajmniej 3 znaki..."
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  helperText={addBookData.formErrors.title.length>0 && (addBookData.formErrors.title)}
                  FormHelperTextProps={{
                    className:classes.helperText
                  }}
                  onChange={handleChange}
                />
                <TextField
                  required 
                  id="author"
                  label="Autor książki"
                  style={{ margin: 8, marginLeft: 0 }}
                  placeholder="Wpisz przynajmniej 3 znaki"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  helperText={addBookData.formErrors.author.length>0 && (addBookData.formErrors.author)}
                  FormHelperTextProps={{
                    className:classes.helperText
                  }}
                  onChange={handleChange}
                /> 
                
                 <FormControl className={classes.formControl} required  fullWidth>
                  <InputLabel shrink htmlFor="category-native-label-placeholder">
                    Kategoria
                  </InputLabel>
                  <NativeSelect
                    value={addBookData.category}
                    onChange={handleChange}
                    inputProps={{
                      name: 'category',
                      id: 'category',
                    }}
                  >
                    <option value="">Nie wybrano</option>
                    {UserCategories.map(({ id, title }, index) => (
                      <option key={id} value={id}>{title}</option>
                    ))}
                  </NativeSelect>
                </FormControl> 
                </Box>
                <Box component="fieldset" px={0.5} mx={0} mt={1} borderColor="transparent">
                  <Typography component="legend">Ocena książki </Typography>
                  <Rating 
                    name="simple-controlled"
                    value={rating} 
                    id="rating" 
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                  />
                </Box>
              </Grid>
                <TextField
                    required 
                    id="bookDescription"
                    label="Opis książki"
                    style={{ margin: 8 }}
                    placeholder="Wpisz przynajmniej 10 znaków"
                    fullWidth
                    multiline
                    rows="4"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    helperText={addBookData.formErrors.bookDescription.length>0 && (addBookData.formErrors.bookDescription)}
                    FormHelperTextProps={{
                      className:classes.helperText
                    }}
                    onChange={handleChange}
                /> 
                <TextField
                    id="publishers"
                    label="Wydawnictwa"
                    style={{ margin: 8 }}
                    placeholder="Wpisz przynajmniej 3 znaki"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleChange}
                />   
                <Grid container> 
                    <Grid item md={4} xs={6}>
                      <Box mx={1} mt={1}>
                        <form className={classes.container} noValidate>
                          <TextField
                            id="dateOfPublication"
                            label="Data wydania"
                            type="date" 
                            fullWidth
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={handleChange}
                          />
                        </form>
                      </Box> 
                  </Grid> 
                  <Grid item sm={4} xs={6}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel shrink htmlFor="language-native-label-placeholder">
                        Język wydania
                      </InputLabel>
                      <NativeSelect
                        value={addBookData.language}
                        onChange={handleChange}
                        inputProps={{
                          name: 'language',
                          id: 'language',
                        }}
                      >
                        <option value="">Nie wybrano</option>
                        <option value={1}>angielski</option>
                        <option value={2}>białoruski</option>
                        <option value={3}>bośniacki</option>
                        <option value={4}>bułgarski</option>
                        <option value={5}>bośniacki</option> 
                        <option value={6}>chiński</option>
                        <option value={7}>chorwacki</option>
                        <option value={8}>czeski</option>
                        <option value={9}>duński</option>
                        <option value={10}>fiński</option>
                        <option value={11}>francuski</option>
                        <option value={12}>hiszpański</option>
                        <option value={13}>japoński</option>
                        <option value={14}>litewski</option>
                        <option value={15}>łaciński</option>
                        <option value={16}>łotewski</option>
                        <option value={17}>niderlandzki</option>
                        <option value={18}>niemiecki</option>
                        <option value={19}>niderlandzki</option> 
                        <option value={20}>norweski</option>
                        <option value={21}>polski</option>
                        <option value={22}>rosyjski</option>
                        <option value={23}>serbski</option>
                        <option value={24}>słowacki</option>
                        <option value={25}>szwedzki</option>
                        <option value={26}>turecki</option>
                        <option value={27}>ukraiński</option>
                        <option value={28}>węgierski</option>
                        <option value={29}>włoski</option>
                        <option value={30}>inny</option>
                      </NativeSelect>
                    </FormControl> 
                    <Grid item md={4}></Grid>
                  </Grid>
                </Grid>
                <Grid container> 
                  <Grid item sm={4}> 
                    <Box mx={1} mt={3}> 
                      <Input 
                        id="amountOfPages"
                        placeholder="Ilość stron"
                        type="number" 
                        fullWidth
                        onChange={handleChange}
                      >
                      </Input>
                    </Box>
                  </Grid> 
                  <Grid item sm={4}>
                    <TextField
                      id="identifier"
                      label="Numer (ISBN/ISSN)"
                      style={{ margin: 8 }}
                      placeholder="Wpisz przynajmniej 3 znaki"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                          shrink: true,
                      }}
                      helperText={addBookData.formErrors.identifier.length>0 && (addBookData.formErrors.identifier)}
                      FormHelperTextProps={{
                        className:classes.helperText
                      }}
                      onChange={handleChange}
                    /> 
                  </Grid>
                  <Grid item sm={4}>
                    <FormControl className={classes.formControl} fullWidth style={{ paddingLeft: 16, paddingRight: 16 }}>
                      <InputLabel style={{ 'marginLeft': 16 }} shrink htmlFor="format-native-label-placeholder">
                        Format
                      </InputLabel>
                      <Select
                        value={addBookData.format}	 
                        native
                        onChange={handleChange}
                        inputProps={{
                          name: 'format',
                          id: 'format',
                        }}
                      >
                        <option value="">Nie wybrano</option>
                        <option value={1}>audiobook</option>
                        <option value={2}>ebook</option>
                        <option value={3}>papier</option>
                      </Select>
                    </FormControl> 
                  </Grid>
                  <Grid item md={3}></Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item> 
                      <Box  p={1}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                          Dodaj książkę
                        </Button>
                        {formError && (errorMessage)}
                      </Box>
                    </Grid>
                </Grid>
            </Grid> 
      </div>
      <Dialog open={showUpload} onClose={() => setShowUpload(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edycja okładki</DialogTitle>
        <DialogContent>
          {newCover && <img src={newCover} alt="Podgląd zdjęcia" style={{width: '200px' }}  />}
          <ImageUploader
            key={newCover}
            withLabel={false}
            singleImage
            buttonText='Wybierz zdjęcie'
            onChange={handleCoverChange}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpload(false)} color="primary">
            Anuluj
          </Button>
          <Button onClick={handleRemoveCover} color="primary">
            Usuń
          </Button>
          <Button onClick={handleCoverPresave} color="primary">
            Zapisz
          </Button> 
        </DialogActions>
      </Dialog>
    </>
  );
} 

export default AddBook