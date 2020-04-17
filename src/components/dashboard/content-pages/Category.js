import React from 'react';  
import { makeStyles} from '@material-ui/core/styles'; 
import CategoryCard from './category-cards/CategoryCards'; 
import Grid from '@material-ui/core/Grid';
import { Categories } from '../../../constants/books';
//komponent odpowiadajacy za wyswietlanie podstrony z odpowiednimi kategoriami dla książek

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));
function Category(props) {
    const classes = useStyles(); 

    return (
        <main className={classes.content} >
        <div className={classes.toolbar}/>
        <Grid container spacing={3}  >  
        {Categories.map(({ title, key },index)=>( 
            <Grid item xs={12} sm={6} md={3} >
            <CategoryCard title={title} id={key} />
            </Grid>
        ))} 
    </Grid>
    
      </main>
    );
}

export default Category;

