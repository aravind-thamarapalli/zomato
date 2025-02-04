import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Card sx={{ width: 300, margin: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div">{restaurant.name}</Typography>
        <Typography variant="body2" color="textSecondary">{restaurant.cuisines.join(', ')}</Typography>
        <Typography variant="body2" color="textSecondary">Rating: {restaurant.rating}</Typography>
        <Button component={Link} to={`/restaurant/${restaurant.id}`} color="primary" fullWidth>View Details</Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
