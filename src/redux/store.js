import {createStore} from 'redux'; 
import setUpDashboard from './reducers/dashboardReducer'; 
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(setUpDashboard, composeWithDevTools());

export default store;