import React from 'react'
import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { Container, Grid, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';


function Attraction() {
  let params = useParams();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [attraction, setAttraction] = useState({});
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
      query: `
    query Attractions($attractionId: Int!) {
      attraction(id: $attractionId) {
        id
        name
        detail
        coverimage
        latitude
        longitude
      }
    }
  `,
      variables: {
        "attractionId": parseInt(params.id)
      }
    })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow'
    };

    fetch("http://localhost:4000/", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setAttraction(result.data.attraction);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [params.id])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container maxWidth='lg'>
        
              <Card >
                <CardMedia
                  component="img"
                  alt={attraction.name}
                  
                  image={attraction.coverimage}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {attraction.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" >
                    {attraction.detail}
                  </Typography>
                </CardContent>
                <CardActions>
                  {attraction.latitude} <br/>
                  {attraction.longitude}
                </CardActions>
               
              </Card>
            
      </Container>
    );
  }



}

export default Attraction