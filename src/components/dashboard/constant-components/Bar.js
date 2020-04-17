import React from 'react'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';  

import {connect} from 'react-redux';
import {changeMobileOpen} from '../../../redux/actions/dashboardAction';

//funkcja odpowiedzialna za stworzenie nagłówka u góry strony 
//za sterowanie pracą wysuwanego menu odpowiada redux poprzez ustawienie odpowiedniej wartości mobileOpen

const useStyles = makeStyles(theme => ({
    appBar: {
      
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${240}px)`,
        marginLeft: 240,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    }
}));

function Bar(props){
    const classes = useStyles();   

    const handleDrawerToggle = () => { 
      console.log("przed naciśnieciem hamburgera")
      console.log(props.mobileOpen)
      props.changeMobileOpen()
    };
    return(
        <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Przeczytane.pl
          </Typography>
        </Toolbar>
      </AppBar>
    );
} 
const mapStateToProps = state => ({
  mobileOpen:state
});

export default connect(mapStateToProps,{changeMobileOpen})(Bar);