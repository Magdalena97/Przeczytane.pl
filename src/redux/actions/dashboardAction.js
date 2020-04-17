import {CHANGE_MOBILE_OPEN} from '../actionTypes'; 

//Dashboard action
export function changeMobileOpen(){ 
    console.log("Akcja changeMobileOpen")
    return { 
        type: CHANGE_MOBILE_OPEN
    };
}
export default changeMobileOpen;

