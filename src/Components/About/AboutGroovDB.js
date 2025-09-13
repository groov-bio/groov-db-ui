import React from 'react';

import { Box, Typography, Link } from '@mui/material';

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
        id={"about-header"}
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
        <Link href="https://simondoelsnitz.com" target="_blank" id="simon-url">
          Simon d'Oelsnitz
        </Link>{' '}
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
        experimental evidence, please <Link href="contact"> contact us</Link>.
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
            <Link
              href="https://doi.org/10.1093/nar/9.13.3047"
              target="_blank"
            >
              Electrophoretic Mobility Shift Assay (EMSA)
            </Link>
          </li>
          <ul>
            <li>
              Qualitative <i>in vitro</i> evidence for both DNA and ligand
              interactions. Lower resolution than DNase footprinting.
            </li>
          </ul>
          <li>
            <Link
              href="https://doi.org/10.1016/0076-6879(86)30011-9"
              target="_blank"
            >
              DNase Footprinting
            </Link>
          </li>
          <ul>
            <li>
              Qualitative <i>in vitro</i> evidence for both DNA and ligand
              interactions. Higher resolution than EMSA.
            </li>
          </ul>
          <li>
            <Link
              href="https://doi.org/10.1038/s43586-023-00199-x"
              target="_blank"
            >
              Isothermal Titration Calorimetry (ITC)
            </Link>
          </li>
          <ul>
            <li>
              Quantitative <i>in vitro</i> evidence for both DNA and ligand
              interactions.
            </li>
          </ul>
          <li>
            <Link
              href="https://doi.org/10.1038/505602a"
              target="_blank"
            >
              Co-Crystal Structure
            </Link>
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
            <Link
              href="https://doi.org/10.1007/978-1-4939-2877-4_20"
              target="_blank"
            >
              Surface Plasmon Resonance (SPR)
            </Link>
            <ul>
              <li>
                Quantitative <i>in vitro</i> evidence for both DNA and ligand
                interactions.
              </li>
            </ul>
          </li>
          <li>
            <Link
              href="https://doi.org/10.1007/978-1-60327-015-1_35"
              target="_blank"
            >
              Fluorescence Polarization
            </Link>
          </li>
          <ul>
            <li>
              Quantitative <i>in vitro</i> evidence for both DNA and ligand
              interactions.
            </li>
            <li>Only applicable if the ligand is intrinsically fluorescent.</li>
          </ul>
          <li>
            <Link
              href="https://doi.org/10.1073/pnas.95.23.13670"
              target="_blank"
            >
              Synthetic Regulation
            </Link>
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
