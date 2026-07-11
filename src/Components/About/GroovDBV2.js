import React from 'react';

import { Box, Typography, Link, Chip, Paper, Divider, Stack } from '@mui/material';

/**
 * "What's new in groovDB V2" — an end-user-facing overview of the V2 refresh
 * that shipped across the 2026 development cycle. Lives under /about and is
 * gated by a V2 feature flag (see About.js / NavigationBar.js).
 */

const Section = ({ title, children, id }) => (
  <Box mt={5}>
    <Typography
      sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }}
      fontWeight="300"
      gutterBottom
      id={id}
    >
      {title}
    </Typography>
    <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} component="div">
      {children}
    </Typography>
  </Box>
);

export default function GroovDBV2() {
  return (
    <Box
      sx={{
        marginLeft: { xs: '10vw', sm: '35vw', md: '30vw' },
        marginRight: { xs: '10vw', sm: '5vw', md: '15vw' },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
        <Typography
          sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
          fontWeight="300"
          id="about-groovdb-v2-header"
        >
          What&apos;s new in groov<sup>DB</sup>
        </Typography>
        <Chip label="V2" color="primary" size="small" sx={{ fontWeight: 600 }} />
      </Stack>

      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        Over 2026 we've introduced substantial updates to groov<sup>DB</sup>. 
        The focus of V2 was to expand the types of data groov<sup>DB</sup> is able to accept, with the overall goal of
        accurately documenting important features of all prokaryotic genetic sensors.
        Here&apos;s a tour of what changed.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
          📄 groov<sup>DB</sup> is now published in{' '}
          <Link
            href="https://doi.org/10.1093/nar/gkaf1074"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            <i>Nucleic Acids Research</i>
          </Link>
          . If groov<sup>DB</sup> supports your work, please{' '}
          <Link href="cite" underline="hover">
            cite us
          </Link>
          .
        </Typography>
      </Paper>

      <Section title="We now accept Two Component Systems" id="v2-sensor-model">
        The biggest change is conceptual. V1 organized the database around a
        single protein and its interactions. V2 is organized around the{' '}
        <b>sensor</b>, which can contain <b>one or more proteins</b> working
        together. That shift lets us accomodate multi-protein or RNA systems
        and sets the foundation for sensor types beyond single transcription
        factors — sensors are now typed as <i>One Component</i>,{' '}
        <i>Two Component</i>, or <i>Riboswitch</i>.
      </Section>

      <Section title="You can suggest edits for any sensor" id="v2-edit">
        Catch something wrong with a sensor entry? You can now suggest edits to 
        any ligand interaction, DNA interaction, or reference. Click the "Edit Sensor"
        box at the top right of any sensor page. This also allows 
        users to add additional references to any sensor. To submit edits, users
        must be logged in.
      </Section>

      <Section title="More precise data" id="v2-richer-data">
        Each sensor now carries more detail:
        <ul>
          <li>
            <b>New stimulus types.</b> Alongside small-molecule ligands, sensors
            can now record <b>light</b> (wavelength) and <b>temperature</b>{' '}
            stimuli.
          </li>
          <li>
            <b>Quantitative binding data.</b> Ligand and operator interactions
            can include a regulatory effect and a binding constant (K
            <sub>d</sub>) where reported.
          </li>
          <li>
            <b>Mutant sensors</b> are
            now accepted.
          </li>
        </ul>
      </Section>

      <Section title="Redesigned sensor pages and tables" id="v2-pages">
        The individual sensor page and the browse/all-sensors tables were rebuilt
        to present the multi-protein model clearly, with per-protein stimuli,
        operators, structures, and genetic context.
      </Section>

      <Section title="A rebuilt submission experience" id="v2-contribute">
        Contributing is smoother end to end. The <b>add-sensor form</b> was
        rebuilt around the new sensor-with-proteins shape. Behind the
        scenes, submissions are automatically enriched (sequence, structures,
        operon context) from the UniProt ID you provide.
      </Section>

      <Divider sx={{ my: 4 }} />

      <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
        Want the version-by-version details? See the{' '}
        <Link href="change-log" underline="hover">
          change log
        </Link>
        . Spotted something off or have a suggestion?{' '}
        <Link href="contact" underline="hover">
          Contact us
        </Link>
        .
      </Typography>
    </Box>
  );
}
