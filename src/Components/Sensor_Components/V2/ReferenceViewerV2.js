import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Link } from '@mui/material';

/**
 * Reference viewer for v2 data format.
 * v2 authors use last_name / first_name (snake_case) instead of lastName / firstName.
 */
export default function ReferenceViewerV2({ references }) {
  const [refs, setRefs] = useState('Loading ...');

  const getAuthors = (authors) => {
    if (!Array.isArray(authors) || !authors.length) return '';
    return authors
      .map((a, i) => {
        const last = a.last_name || '';
        const firstInitial = a.first_name?.[0] || '';
        return i === authors.length - 1
          ? `${last} ${firstInitial}`
          : `${last} ${firstInitial}, `;
      })
      .join('');
  };

  useEffect(() => {
    if (!references?.length) {
      setRefs(
        <Typography color="text.secondary" textAlign="center" py={4}>
          No references submitted
        </Typography>
      );
      return;
    }

    const nodes = [];
    let counter = 1;

    references.forEach((item, index) => {
      if (item.doi && item.doi !== 'None') {
        nodes.push(
          <Grid
            key={index}
            container
            columns={12}
            sx={{ ml: { xs: 0, sm: 2 } }}
            mb={2}
          >
            <Grid size={12}>
              <Typography
                component="div"
                sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}
                dangerouslySetInnerHTML={{
                  __html: item.title
                    ? `${counter}. ${item.title}`
                    : `${counter}. Title not found`,
                }}
              />
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
                sx={{ fontSize: { xs: 10, sm: 12 }, display: 'inline-block' }}
              >
                {`(${item.year}). `}
                <i>{item.journal}</i>
                {`. doi: ${item.doi}. `}&nbsp;
              </Typography>
              {item.url && (
                <Link href={item.url} target="_blank" sx={{ fontSize: { xs: 10, sm: 12 } }}>
                  Article
                </Link>
              )}
              {!item.url && item.doi && (
                <Link
                  href={`https://doi.org/${item.doi}`}
                  target="_blank"
                  sx={{ fontSize: { xs: 10, sm: 12 } }}
                >
                  Article
                </Link>
              )}
            </Grid>
          </Grid>
        );
        counter++;
      }
    });

    setRefs(nodes.length ? nodes : (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No references with DOIs found
      </Typography>
    ));
  }, [references]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>
        <Grid size={12} mb={3}>
          <Paper elevation={0} sx={{ padding: 3 }}>
            {refs}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
