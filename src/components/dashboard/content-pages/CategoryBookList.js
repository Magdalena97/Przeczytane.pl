import React, { useContext,useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import Typography from '@material-ui/core/Typography'; 
import Rating from '@material-ui/lab/Rating';
import Grid from '@material-ui/core/Grid';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import NavigateNextTwoToneIcon from '@material-ui/icons/NavigateNextTwoTone';
import NavigateBeforeTwoToneIcon from '@material-ui/icons/NavigateBeforeTwoTone';
import IconButton from '@material-ui/core/IconButton';
import {Link,useHistory,useParams} from 'react-router-dom';
import { AuthContext } from '../../../firebaseConf/Auth';
import { db } from '../../../firebaseConf/Firebase'; 

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Categories } from '../../../constants/books';

//komponent odpowiadajacy za wyświetlenie listy książek

const useStyles = makeStyles(theme => ({
  root: {
   padding: theme.spacing(3),  
   backgroundColor: "#FAFAFA",
   position: 'relative',
  },
 
  toolbar: theme.mixins.toolbar, 
  image: { 
    display: 'block',
    width:'100%',
    height:'auto',
    maxWidth:'160px',
    minWidth: '50px',
    marginRight: 'auto', 
    marginLeft: 'auto',
  }, 
  img: {
    width: "230px", 
    marginRight: 16,
  },
  uploadCover: {
    backgroundColor: "lightgrey",
    width: "230px", 
    height: "310px",
    border: "2px dotted grey", 
    display: "flex",
    alignItems:"center",
    justifyContent: "center",
}, 
  div:{
    width: '100%'
  },  
  deleteItem: {
    alignSelf: 'end'
  },
  display: {
    display:'block',
  },
  delete: {
    display:'block',
    marginLeft: 'auto',
    cursor: 'poiner',
  },
  icons: {
    width:'350px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop:"1%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },  
  divider: {
    marginBottom: '10px;'
  }, 
  mainGrid: {
    flex: 1,
    [theme.breakpoints.up('md')]: {
      borderBottom: '1px solid black',
    } 
  },
  downGrid: {
    [theme.breakpoints.down('sm')]: {
      borderBottom: '1px solid black',
      marginBottom: '8px'
    } 
  }, 
  subtitle: {
    maxWidth:"30px",
  }, 
  menulist: {
    zIndex: "2"
  }
})); 

const options = ['Ranking rosnąco', 'Ranking malejąco'];

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}

function CategoryBooksList() {
  const classes = useStyles();
  const {currentUser, setBooks} = useContext(AuthContext);   //obecnie zalogowany user 
  let { page, category } = useParams();
  const filterBooks = (Categories.find(({ key }) => key === category) || { filterBy: (b) => b }).filterBy; 
  const itemsPerPage = 5; //ilość ksiązke na strone
  let books = currentUser.extraData.books.filter((b) => filterBooks(b, filterBooks))
  let minPage=1;//minimalna wartośc strony do przypisania do url 
  let maxPage= Math.ceil(books.length/itemsPerPage);//maksymalna wartość liczby stron do przypisania w url
  const [currentPage,setCurrentPage] = useState(value_limit(page, minPage, maxPage)) 
  let history = useHistory(); 
  const [booksPerPage, setBooksPerPage]= useState();  
  const [sortUp,setSortUp]= useState(false)
  const [sortDown,setSortDown]= useState(false)

  //DANE PRZYCISKU 
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    
    switch(options[index]){
      case 'Ranking rosnąco':
        // sortUp=true; 
        setSortUp(true)
        setSortDown(false)
        console.log("sortUp powinien byc true")
        console.log(sortUp)  
        books.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
        setBooksPerPage(getItems())
        break;
      case 'Ranking malejąco': 
        //sortDown=true; 
        setSortDown(true)
        setSortUp(false)
        console.log("sortDown powinien byc true")
        console.log(sortDown)
        books.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating)).reverse();
        setBooksPerPage(getItems())

        break;
    }
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }; 
  //KONIEC DANYCH PRZYCISKU 


  const deletebook = async (book,arrayOfBooks) => {  
    const books =  arrayOfBooks.filter(({ author, title}) => book.title !== title && book.author !== author);
    await db.ref(`books/${currentUser.uid}`).set(books);
    setBooks(books);
  };

  Array.prototype.max = function(mx) {
    return this.filter(function(e,i){return i < mx;}); 
  };
 
  Array.prototype.offset=function(os){
    return this.filter(function(e,i){return i> os-1 });
  };

  const getItems =() =>{ 
    const startAt = parseInt(currentPage, 10) * itemsPerPage - itemsPerPage;
    
    return books.offset(startAt).max(itemsPerPage); 
  };

  useEffect(() => {
    if (page !== undefined || currentPage !== 1) {
      history.push(`/category/${category}/${currentPage || 1}`)
    }
    setBooksPerPage(getItems())
  },[currentPage, currentUser]);  

  const previousPage=()=>{  
    if(parseInt(currentPage, 10)>=minPage+1){ 
      setCurrentPage(parseInt(currentPage, 10)-1)  
    } 
  } 

  const nextPage=()=>{ 
    if(parseInt(currentPage, 10)<=maxPage-1){
      setCurrentPage(parseInt(currentPage, 10)+1)  
    } 
  } 

   console.log("currentUser w booklist")
   console.log(currentUser)
  return ( 
    <div className={classes.root}> 
    <div className={classes.toolbar}/>  
    {console.log("booksPerPage"),console.log(booksPerPage)}
    {booksPerPage!=undefined && booksPerPage.length!=0 ? (
      <div>
        <Grid container direction="column" alignItems="flex-end">
          <Grid item xs={12}>
            <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
              <Button
                color="primary"
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >{options[selectedIndex]}
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal className={classes.menulist}>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" >
                        {options.map((option, index) => (
                          <MenuItem
                            key={option} 
                            selected={index === selectedIndex}
                            onClick={event => handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
    </Grid>
        
      {/*wyświetlenie listy książek*/}
      {booksPerPage.map((book,index)=>(
      <div key={index}>
        <Grid
          container
          direction="row" 
          spacing={1}   
        >
          <Grid item className={classes.img}>  
            <div style={{ position: 'relative' }} className={classes.uploadCover}>
              <img style={{ position: 'absolute', width: '100%',height: "100%" }} src={ book.cover} alt={book.title} /*className={classes.image}*/ /> 
            </div>
          </Grid>
          <Grid item className={classes.mainGrid} >
            <Grid container direction="row">
              <Grid item xs={12}>
                <Grid container justify="space-between" wrap="nowrap">
                  <Grid item >
                    <Typography
                      component="div"
                      variant="h5"
                      color="textPrimary"
                    >
                      {book.title}
                    </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {book.author}
                      </Typography>
                  </Grid>
                  <Grid item >
                    <div className={classes.display}>
                      <Rating value={book.rating} precision={0.5} readOnly/>
                    </div>
                    <Hidden only={["md","lg","xl"]} implementation="css"> 
                      <DeleteTwoToneIcon className={classes.delete} onClick={()=>deletebook(book,currentUser.extraData.books)}/>
                    </Hidden>
                  </Grid>
                </Grid>
              </Grid> 
              <Grid item xs={12}>
                <Hidden smDown implementation="css"> 
                  <div className={classes.div}>{(book.bookDescription || '').substr(0,1370)}</div>
                </Hidden>
              </Grid>
              <Grid item xs={12} className={classes.deleteItem}>
                <Hidden  only={["xs","sm"]} implementation="css"> 
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item> 
                      <Link to={`/mybooks/details/${currentUser.extraData.books.indexOf(book)}`}>
                        <p><i>Zobacz więcej...</i></p>
                      </Link>
                    </Grid>
                    <Grid item> 
                      <DeleteTwoToneIcon onClick={()=>deletebook(book,currentUser.extraData.books)}/>
                    </Grid>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.downGrid}>
            <Hidden only={["md","lg","xl"]} implementation="css"> 
              <div className={classes.div}>{(book.bookDescription || '').substr(0,400)}</div>
              <Link to={`/mybooks/details/${currentUser.extraData.books.indexOf(book)}`}>
                <p><i>Zobacz więcej...</i></p> 
              </Link>
            </Hidden>
          </Grid>
          </Grid>
          </div>
          ))}
          <div className={classes.icons}>
            <IconButton aria-label="delete" size="medium" onClick={previousPage}>
              <NavigateBeforeTwoToneIcon /> 
            </IconButton>
            {currentPage}/{maxPage}
            <IconButton aria-label="delete"  size="medium" onClick={nextPage}>
              <NavigateNextTwoToneIcon />
            </IconButton>
        </div>
      </div>
        
      ) : ( 
        <p style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, textAlign: 'center'}}>Tu Pojawią sie Twoje książki. Aby jej dodac przejśc do zakładki dodaj książke </p>
      )}
    </div>
  );
} 

export default CategoryBooksList;