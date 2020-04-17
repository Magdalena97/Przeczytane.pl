import React from 'react'; 

//komponent wyświtlający strone NotFound
const styles = { 
  roofdiv: {
      position: "fixed",
      top: "50%",
      left: "50%",
      width:"30em",
      height:"18em",
      marginTop: "-9em", /*set to a negative number 1/2 of your height*/
      marginLeft: "-15em", /*set to a negative number 1/2 of your width*/
  }, 
  text404:{
    fontFamily: "Monospace", 
    fontSize:"110px", 
    fontWeight: "900", 
    color: "grey",
    textAlign:"center",
  }, 
  text: {
    fontFamily: "Verdana", 
    fontSize:"18px", 
    fontWeight: "600", 
    margin: "auto auto",
    textAlign:"center",
  } 
}
class NotFound extends React.Component{
    render(){
        return( 
            <div style={styles.roofdiv}>
                <div style={styles.text404}>404</div> 
                <div style={styles.text}>Oops! Nie ma takiej strony</div>
            </div>
        );
    }
} 

export default NotFound;