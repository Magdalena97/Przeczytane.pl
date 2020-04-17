import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {useHistory} from 'react-router'
 
//komponent obsługujący kategorie
const useStyles = makeStyles({
  card: {  
    backgroundColor: 'lightgrey', 
  }, 
  title: {
    fontFamily: "Modern",
  }
});

function CategoryCard(props) {
  const classes = useStyles();
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/category/${props.id}/1`);
  }

  return (
    <Card className={classes.card} onClick={handleCardClick}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
            {props.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 

export default CategoryCard;
