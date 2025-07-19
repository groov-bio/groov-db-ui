import React from 'react';

import { Box, Typography } from '@mui/material';

export default function AboutGroovDB() {
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
        A genetic sensor database
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        groov<sup>DB</sup> is a free, open-source, and community-editable
        database for transcription factor biosensors and their properties. The
        objective of groov<sup>DB</sup> is to organize the world's genetic
        sensors to better guide and inform research conducted by
        biotechnologists and molecular biologists. While several other databases
        document information on genetic sensors from specific organsims, or only
        include DNA-binding interactions, groov<sup>DB</sup> uniquely contains
        both protein-ligand and protein-DNA interactions for genetic sensors and
        is organism-agnostic. Each protein in the database has a dedicated page
        showing amino acid sequence, accession IDs, structural data, ligand
        structures, DNA binding seqeunces, local genetic context, and more. All
        DNA and ligand binding data is referenced to specific figures from
        peer-reviewed literature sources.
        <br />
        <br />
        groov<sup>DB</sup> was designed and created in 2022 by{' '}
        <a href="https://simondoelsnitz.com" target="__blank__">
          Simon d'Oelsnitz
        </a>{' '}
        and Joshua D. Love.
      </Typography>

      <Typography
        sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
        mt={5}
        fontWeight="300"
        gutterBottom
      >
        Criteria for interaction evidence
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        Two primary types of biosensor interactions are referenced to
        experimental data in peer-reviewed literature: biosensor-DNA
        interactions and biosensor-ligand interactions. The interpretation of
        these interactions should be made with caution, especially when being
        used to inform experimental design. For example, a binding interaction
        documented within an <i>in vitro</i> context might not translate to a
        functional interaction within an <i>in vivo</i> context. Conversely,{' '}
        <i>in vivo</i> binding evidence may not be sufficient to describe a true
        biophysical interaction.
        <br />
        <br />
        Below we list the types of experimental evidence we accept for inclusion
        into groov<sup>DB</sup>, as well as our guidance to avoid
        overinterpretation. If you suggest that we accept another form of
        experimental evidence, please <a href="contact"> contact us</a>.
      </Typography>
      <Typography
        sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }}
        mt={3}
        fontWeight="300"
        gutterBottom
      >
        Accepted experimental evidence
      </Typography>
      <Typography
        sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
        component="span"
      >
        <ol>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Electrophoretic_mobility_shift_assay"
              target="__blank__"
            >
              Electrophoretic Mobility Shift Assay (EMSA)
            </a>
          </li>
          <ul>
            <li>
              Qualitative <i>in vitro</i> evidence for both DNA and ligand
              interactions. Lower resolution than DNase footprinting.
            </li>
          </ul>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/DNase_footprinting_assay"
              target="__blank__"
            >
              DNase Footprinting
            </a>
          </li>
          <ul>
            <li>
              Qualitative <i>in vitro</i> evidence for both DNA and ligand
              interactions. Higher resolution than EMSA.
            </li>
          </ul>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Isothermal_titration_calorimetry"
              target="__blank__"
            >
              Isothermal Titration Calorimetry (ITC)
            </a>
          </li>
          <ul>
            <li>
              Quantitative <i>in vitro</i> evidence for both DNA and ligand
              interactions.
            </li>
          </ul>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/X-ray_crystallography"
              target="__blank__"
            >
              Co-Crystal Structure
            </a>
          </li>
          <ul>
            <li>
              Qualitative <i>in vitro</i> evidence for DNA interactions.
            </li>
            <li>
              <b>Note:</b> Due to reported artifacts, we do not consider
              co-crystals as sufficient evidence for ligand binding
            </li>
          </ul>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Surface_plasmon_resonance"
              target="__blank__"
            >
              Surface Plasmon Resonance (SPR)
            </a>
            <ul>
              <li>
                Quantitative <i>in vitro</i> evidence for both DNA and ligand
                interactions.
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Fluorescence_anisotropy"
              target="__blank__"
            >
              Fluorescence Polarization
            </a>
          </li>
          <ul>
            <li>
              Quantitative <i>in vitro</i> evidence for both DNA and ligand
              interactions.
            </li>
            <li>Only applicable if the ligand is intrinsically fluorescent.</li>
          </ul>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Synthetic_biological_circuit"
              target="__blank__"
            >
              Synthetic Regulation
            </a>
          </li>
          <ul>
            <li>
              Quantitative <i>in vivo</i> evidence for both DNA and ligand
              interactions.
            </li>
            <li>
              <b>Caution should be taken to avoid overinterpretation!</b> The
              host's endogenous enzymes may interact with the input ligand.
            </li>
          </ul>
        </ol>
      </Typography>
    </Box>
  );
}
