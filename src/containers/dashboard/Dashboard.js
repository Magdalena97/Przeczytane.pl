import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles'; 
import {Redirect, Route, Switch} from 'react-router-dom';

import AppBar from '../../components/dashboard/constant-components/Bar'; 
import MenuList from '../../components/dashboard/constant-components/MenuList'; 
import Category from '../../components/dashboard/content-pages/Category';
import MyProfile from '../../components/dashboard/content-pages/MyProfile'; 
import BooksList from '../../components/dashboard/content-pages/BooksList'; 
import CategoryBooksList from '../../components/dashboard/content-pages/CategoryBookList'; 
import AddBook from '../../components/dashboard/content-pages/AddBook'; 
import BookDetails from '../../components/dashboard/content-pages/BookDetails'; 
import BookModification from '../../components/dashboard/content-pages/BookModification';

//strona Dashboard 

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  }
}));

function Dashboard({match, history}) {
  const classes = useStyles();

  useEffect(() => {
    console.log(match)
  }, [match]);
  console.log(`${match.url}mybooks`, `${match.url}mybooks`);

  const handleLogout = () => history.push('/login');

  if (history.location.pathname === '/') {
    return (
      <Redirect to={`/mybooks/1`} />
    );
  }
  return (
    <div className={classes.root}>
      <CssBaseline /> 
      <AppBar/> 
      <MenuList onLogout={handleLogout} />
      <div style={{ width: '100%', 'min-height': '100vh' }}>
        <Switch>
          <Route exact path={`${match.url}mybooks/details/:id`} component={BookDetails} />
          <Route exact path={`${match.url}mybooks/modification/:id`} component={BookModification} />
          <Route exact path={`${match.url}mybooks/:id`} component={BooksList} />
          <Route exact path={`${match.url}addbook`} component={AddBook} />
          <Route exact path={`${match.url}myprofile`} component={MyProfile} />
          <Route exact path={`${match.url}category`} component={Category} /> 
          <Route exact path={`${match.url}category/:category/:page`} component={CategoryBooksList} />
          <Redirect to={`/404`} />
        </Switch>
      </div>
    </div>
  );
}

export default Dashboard; 





	 
	
