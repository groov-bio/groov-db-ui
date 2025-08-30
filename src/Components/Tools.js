import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function Tools() {
  return (
    <Box>
      <Grid
        container
        columns={12}
        mt={8}
        alignItems="center"
        justifyContent="center"
      >
        <Grid size={12} mb={5}>
          <Typography
            sx={{ fontSize: { xs: 32, sm: 32 } }}
            textAlign="center"
            fontWeight="300"
            gutterBottom
          >
            Tools
          </Typography>
        </Grid>

        <Grid size={{xs:0, md:2}} />
        <Grid size={{xs:12, sm:6, md:4}}>
          <a href="https://snowprint.groov.bio" target="__blank__">
            <img
              src="Snowprint_Logo.png"
              style={{ width: 300, margin: 'auto', display: 'block' }}
            />
          </a>
          <Typography
            sx={{ fontSize: { xs: 16, md: 18 } }}
            fontWeight="400"
            pl={10}
            pr={10}
            id="snowprint-desc"
          >
            Snowprint uses phylogenetic information to predict DNA sequences
            bound by an input transcription factor. Details of the method can be
            found in{' '}
            <a
              href="https://doi.org/10.1038/s42003-024-05849-8"
              target="__blank"
              style={{ textDecoration: 'None' }}
              id="snowprint-link"
            >
              this publication.
            </a>
          </Typography>
        </Grid>

        <Grid size={{xs:12, sm:6, md:4}} sx={{ mt: { xs: 7, sm: 0 } }}>
          <a href="https://ligify.groov.bio" target="__blank__">
            <img
              src="Ligify_Logo.png"
              style={{ width: 300, margin: 'auto', display: 'block' }}
            />
          </a>
          <Typography
            sx={{ fontSize: { xs: 16, md: 18 } }}
            fontWeight="400"
            pl={10}
            pr={10}
            id="ligify-desc"
          >
            Ligify uses enzyme reaction data to predict transcription factors
            responsive to an input chemical. Details of the method can be found
            in{' '}
            <a
              href="https://www.biorxiv.org/content/10.1101/2024.02.20.581298v1"
              target="__blank"
              style={{ textDecoration: 'None' }}
              id="ligify-link"
            >
              this publication.
            </a>
          </Typography>
        </Grid>
        <Grid size={{xs:0, md:2}} />
      </Grid>
    </Box>
  );
}
