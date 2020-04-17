import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'; 
import { AuthContext } from '../../../firebaseConf/Auth';

import {useParams, useHistory } from 'react-router-dom';
import { UserCategories } from '../../../constants/books';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }, 
    uploadCover: {
        backgroundColor: "lightgrey",
        // width: "230px", 
        // height: "310px",
        width: "340px", 
        height: "400px",
        border: "2px dotted grey", 
        display: "flex",
        alignItems:"center",
        justifyContent: "center",
    },  
    formControl: {
      margin: theme.spacing(1), 
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    nativeSelects: {
      width: "100%"
    }, 
    typography: {
      color: "#757575"
    },
}));

function BookDetails() {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext); 
  let { id } = useParams();  
  let history = useHistory();

  console.log("Konkretna ksiązka przesłana do komponetu")
  console.log( currentUser.extraData.books[id])  

  let book=currentUser.extraData.books[id];  
  
  const relocate=()=>{ 
    history.push(`/mybooks/modification/${id}`)
  }

  return ( 
    <>
      <div className={classes.content}>
          <div className={classes.toolbar}/> 
            <h2>Szczegółowe informacje o książce</h2> 
            <Grid container justify="flex-start" spacing={3} style={{ overflow: 'hidden' }}>
              <Grid item md={3} xs={12}>
                <div style={{ position: 'relative' }} className={classes.uploadCover}>
                  <img style={{ position: 'absolute', width: '100%',height: "100%" }} src={book.cover} alt="" /> 
                </div>
              </Grid>
              <Grid item md={9} xs={12}> 
              <Box  width={1/4}> 
                <Typography variant="caption" gutterBottom className={classes.typography}>Tytuł:</Typography> 
                <Typography variant="subtitle1" gutterBottom >{book.title}</Typography>
                <Typography variant="caption" gutterBottom className={classes.typography} >Autor książki:</Typography> 
                <Typography variant="subtitle1" gutterBottom align="left">{book.author}</Typography>
                <Box mx={0}px={0}>
                 <FormControl className={classes.formControl} fullWidth>
                 <Typography variant="caption" gutterBottom className={classes.typography} >Kategoria</Typography> 
                  <Select
                    value={book.category}
                    inputProps={{
                      name: 'category',
                      id: 'category',
                      readOnly: true 
                    }}
                  >
                    <option value="">Nie wybrano</option>
                    {UserCategories.map(({ id, title }, index) => (
                      <option key={id} value={id}>{title}</option>
                    ))}
                  </Select>
                </FormControl> 
                </Box> 
                </Box>
                <Box component="fieldset" px={0} mx={0} mt={1} borderColor="transparent"> 
                  <Typography variant="caption" component="legend" gutterBottom className={classes.typography}>Ocena książki</Typography> 
                  <Rating 
                    readOnly
                    name="simple-controlled"
                    value={book.rating} 
                    id="rating" 
                  />
                </Box>
              </Grid>
              <Typography variant="caption" component="legend" gutterBottom className={classes.typography}>Opis książki</Typography> 
              <Typography variant="subtitle1" gutterBottom align="left">{book.bookDescription}</Typography>
              <Box mx={0} mt={0}>
                <Typography variant="caption" component="legend" gutterBottom className={classes.typography}>Wydawnictwa</Typography> 
                <Typography variant="subtitle1" gutterBottom >{book.publishers || 'brak danych'}</Typography>
              </Box>
                <Grid container> 
                    <Grid item md={1} xs={6}>
                      <Box mx={0} mt={1}>
                          <Typography variant="caption" component="legend" gutterBottom className={classes.typography}>Data wydania</Typography> 
                          <Typography variant="subtitle1" gutterBottom align="left">{book.dateOfPublication || 'brak danych'}</Typography>
                      </Box> 
                  </Grid> 
                  <Grid item md={2} xs={6}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel shrink htmlFor="language-native-label-placeholder">
                        Język wydania
                      </InputLabel>
                      <Select
                         value={book.language}
                        inputProps={{ 
                          readOnly: true,
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
                      </Select>
                    </FormControl> 
                    <Grid item md={9}></Grid>
                  </Grid>
                </Grid>
                <Grid container> 
                  <Grid item sm={4} md={1}> 
                    <Box mr={2} > 
                      <Typography variant="caption" component="legend" gutterBottom className={classes.typography}>Liczba stron</Typography> 
                      <Typography variant="subtitle1" gutterBottom align="left">{book.amountOfPages || 'brak danych'}</Typography>
                    </Box>
                  </Grid> 
                  <Grid item sm={4} md={2}>
                    <Typography variant="caption" component="legend" gutterBottom className={classes.typography}>Numer (ISBN/ISSN)</Typography> 
                    <Typography variant="subtitle1" gutterBottom align="left">{book.identifier || 'brak danych'}</Typography>
                  </Grid>
                  <Grid item sm={4} md={2}>
                    <FormControl className={classes.formControl} fullWidth style={{ paddingLeft: 16, paddingRight: 16 }}>
                      <InputLabel style={{ 'marginLeft': 16 }} shrink htmlFor="format-native-label-placeholder">
                        Format
                      </InputLabel>
                      <Select
                        value={book.format}	 
                        inputProps={{ 
                          readOnly: true
                        }}
                      >
                        <option value="">Nie wybrano</option>
                        <option value={1}>audiobook</option>
                        <option value={2}>ebook</option>
                        <option value={3}>papier</option>
                      </Select>
                    </FormControl> 
                  </Grid>
                  <Grid item md={7}></Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item> 
                      <Box p={1}> 
                           <Button variant="contained" color="primary" onClick={relocate}>
                            Edytuj dane
                          </Button> 
                      </Box>
                    </Grid>
                </Grid>
            </Grid> 
      </div>
    </>
  );
} 

export default BookDetails