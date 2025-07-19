import React from 'react';

import { Box, Typography } from '@mui/material';

export default function Contact() {
  return (
    <Box
      sx={{
        marginLeft: { xs: '10vw', sm: '35vw', md: '30vw' },
        marginRight: { xs: '10vw', sm: '5vw', md: '15vw' },
      }}
    >
      <Typography
        sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
        fontWeight="300"
        gutterBottom
      >
        Citing groov<sup>DB</sup>
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        If you have used groov<sup>DB</sup> in a publication, please cite the
        following paper
      </Typography>

      <Typography
        component="div"
        sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}
        mt={2}
        ml={4}
      >
        d'Oelsnitz S, Love JD, Diaz DJ, Ellington AD. GroovDB: A Database of
        Ligand-Inducible Transcription Factors.<br></br>
        <i>ACS Synth Biol.</i> <b>11</b>, 10 (2022). doi:{' '}
        <a href="https://doi.org/10.1021/acssynbio.2c00382" target="__blank">
          10.1021/acssynbio.2c00382
        </a>
        <br />
      </Typography>

      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} mt={4}>
        When referencing individual biosensors, please cite the original
        publications provided in the "References" section on each biosensor
        page.
      </Typography>

      <Typography
        sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
        fontWeight="300"
        mt={5}
        gutterBottom
      >
        Citing other tools
      </Typography>

      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        If you have used the Snowprint or Ligify tools in a publication, please
        cite the corresponding papers.
      </Typography>

      <Typography
        component="div"
        sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}
        mt={2}
        ml={4}
      >
        d'Oelsnitz S, Stofel SK, Love JD, Ellington AD. Snowprint: a predictive
        tool for genetic biosensor discovery.<br></br>
        <i>Commun Biol. </i> <b> 7</b>, 163 (2024). doi:{' '}
        <a href="https://doi.org/10.1038/s42003-024-05849-8" target="__blank">
          10.1038/s42003-024-05849-8
        </a>
        <br />
      </Typography>

      <Typography
        component="div"
        sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}
        mt={2}
        ml={4}
      >
        d'Oelsnitz S, Love JD, Ellington AD, Ross D. Ligify: Automated genome
        mining for ligand-inducible transcription factors.<br></br>
        <i>ACS Synth Biol.</i> <b>13</b>, 8 (2024). doi:{' '}
        <a href="https://doi.org/10.1021/acssynbio.4c00372" target="__blank">
          10.1021/acssynbio.4c00372
        </a>
        <br />
      </Typography>
    </Box>
  );
}
