import React, { useState, useEffect } from 'react';

import { Box, Grid, Typography, Paper, Link } from '@mui/material';

export default function ReferenceViewer(props) {
  //Hold state for all ref nodes & initial loading
  const [refs, setRefs] = useState('Loading ... ');

  const getAuthors = (authors) => {
    let authString = '';

    for (let i = 0; i < authors.length; i++) {
      if (i === authors.length - 1) {
        authString += `${authors[i].lastName} ${authors[i].firstName[0]}`;
      } else {
        authString += `${authors[i].lastName} ${authors[i].firstName[0]}, `;
      }
    }

    return authString;
  };

  useEffect(() => {
    //If there are references for this sensor
    if (props.references.length) {
      let refs = [];
      let counter = 1;

      //Loop the references and create each grid child node
      //Simple formatting is done to format for proper citations
      props.references.forEach((item, index) => {
        if (item.doi !== 'None') {
          if (item.doi !== null) {
            refs.push(
              <Grid
                key={index + 1}
                container
                columns={12}
                sx={{
                  ml: {
                    xs: 1,
                    sm: 2,
                  },
                }}
                mb={2}
              >
                <Grid size={12}>
                  <Typography
                    component="div"
                    sx={{ fontSize: { xs: 14, sm: 16 } }}
                    //This is required in order to render the embedded <i> tags in the titles
                    dangerouslySetInnerHTML={{
                      __html: item.title
                        ? `${String(counter)}. ${item.title}`
                        : `${String(counter)}. Title not found`,
                    }}
                  ></Typography>
                </Grid>
                <Grid size={12}>
                  <Typography
                    component="div"
                    ml={4}
                    sx={{ fontSize: { xs: 10, sm: 12 }, opacity: '40%' }}
                  >
                    {getAuthors(item.authors)}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography
                    component="div"
                    ml={4}
                    sx={{
                      fontSize: { xs: 10, sm: 12 },
                      display: 'inline-block',
                    }}
                  >
                    {`(${item.year}). `}
                    <i>{item.journal}</i>
                    {`. doi: ${item.doi}. `}&nbsp;
                  </Typography>
                  <Link
                    href={item.url}
                    target="_blank"
                    sx={{ fontSize: { xs: 10, sm: 12 } }}
                  >
                    Article
                  </Link>
                </Grid>
              </Grid>
            );
            //This counter keeps track of nodes created
            //Useful to skipping number when None ref is found
            counter++;
          }
        }
      });
      setRefs(refs);
    }
  }, [props.references]);

  return (
    <Box sx={{ flexGrow: 1 }} mb={5}>
      <Grid container style={{ width: '100%' }}>
        {/* Reference List */}

        <Grid size={12} mb={3}>
          <Paper 
          elevation={0} 
          sx={{ 
            padding: 3,
             }}>
            {refs}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
