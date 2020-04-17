import {CHANGE_MOBILE_OPEN} from '../actionTypes'; 
//Initial state
const initialState = {
    mobileOpen: false ,
}; 
//Dashboard reducer
const setUpDashboard = (state=initialState.mobileOpen,action) => {
    console.log("Jetsem w reducerze dashboard")
    console.log("--------------------------") 
    console.log(state)
    switch(action.type) {
        case CHANGE_MOBILE_OPEN: 
            return !state 
        default: 
            return state
    }
}

export default setUpDashboard; 
