import React from 'react' ;
import Grid from '@material-ui/core/Grid';

import auth1 from '../../images/authorization/auth1.jpg'; 
import auth2 from '../../images/authorization/auth2.jpg';
import auth3 from '../../images/authorization/auth3.png';
import auth4 from '../../images/authorization/auth4.jpg';
import auth5 from '../../images/authorization/auth5.jpg';
import auth6 from '../../images/authorization/auth6.jpg';
import auth7 from '../../images/authorization/auth7poz.jpg';

//funkcja odpowiedzialna za generowanie losowego obrazka na stronie do logowania
function RandomImage(){
    let images=[auth1,auth2,auth3,auth4,auth5,auth6,auth7];
    let rand=Math.floor(Math.random() * 7);  
    return images[rand];  
  }

const styles={
    image: {
        backgroundImage: "url(" + RandomImage()  +")",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', 
        backgroundPosition: 'center center',
      },
}
class Image extends React.Component{
    render(){
        return( 
            <Grid item xs={false} sm={4} md={7} style={styles.image} />  
        ); 
    }
} 

export default Image;