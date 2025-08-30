import { Box, Typography, Button, Link } from '@mui/material';

export default function ChangeLog() {
  /**
   * Pass in an array of strings to return those strings as <li> inside <ul>
   * @param {array} arrOfStrings
   */
  const createList = (arrOfStrings) => {
    return (
      <ul>
        {arrOfStrings.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  /**
   * Creates the header for each entry. Currently supports Feature -> green or anything else -> orange
   * @param {string} date
   * @param {string} version
   * @param {string} type
   * @returns
   */
  const getHeader = (date, version, type) => {
    return (
      <>
        <Typography sx={{ fontSize: { xs: 16, sm: 20 }, display: 'inline' }}>
          {date} - V{version}
        </Typography>

        <Button
          size="small"
          sx={{
            display: 'inline',
            backgroundColor: type === 'Feature' ? '#02ab43' : '#2185ff',
            '&:disabled': {
              color: 'white',
              ml: 3,
              pl: 1,
              pr: 1,
            },
          }}
          disabled
        >
          {type}
        </Button>
      </>
    );
  };

  return (
    <Box
      sx={{
        marginLeft: { xs: '10vw', sm: '35vw', md: '30vw' },
        marginRight: { xs: '0vw', sm: '5vw', md: '15vw' },
        display: 'grid',
        gridTemplateRows: 'auto',
      }}
    >
      <Box
        sx={{
          gridColumn: '1 / 12',
          display: 'grid',
          gridTemplateRows: 'repeat(12, 1fr)',
          fontSize: { xs: 14, sm: 16 },
        }}
      >
        {/* <Box sx={{ gridColumn: 'span 12' }}>
          <Typography pt={5} sx={{fontSize: { xs: 16, sm: 18 }}}>
            We are always looking for ways to improve groov.
            If you have any suggestions, please <a href="contact">contact us</a>. 
          </Typography>
        </Box> */}

        <Box
          mb={5}
          sx={{ gridColumn: 'span 12', borderBottom: '1px solid black' }}
          // sx={{
          //   marginLeft: { xs: '10vw', sm: '35vw', md: '30vw' },
          //   marginRight: { xs: '10vw', sm: '5vw', md: '15vw' },
          // }}
        >
          <Typography
            sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
            fontWeight="300"
            gutterBottom
          >
            Change Log
          </Typography>
          <Typography sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
            We are always looking for ways to improve groov<sup>DB</sup>. If you
            have any suggestions, please <Link href="contact">contact us</Link>.
          </Typography>
        </Box>

        <Box id="v1.16" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('13 August, 2025', '1.16', 'Feature')}
            {createList([
              `All-in-one browsing ... like having a buffet of sensors at your fingertips`,
              `New all-sensors table lets you browse the entire database in one place. Plus a mobile-friendly sidebar layout and faster downloads via smart caching.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.15" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('13 July, 2025', '1.15', 'Feature')}
            {createList([
              `Edit this database like ... Edward Scissorhands at a barbershop`,
              `Now you can edit attributes of individual sensors. Also, data now loads much faster.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.14" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('18 May, 2025', '1.14', 'Feature')}
            {createList([
              `Tanimoto ... We have such great chemistry`,
              `You can now search the database via chemical similarity to an input ligand.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.13" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('01 May, 2025', '1.13', 'Feature')}
            {createList([
              `Gotta catch 'em all!`,
              `We added a new feature to download and programmatically access all sensors in the database.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.12" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('19 April, 2025', '1.12', 'Enhancement')}
            {createList([
              `Airplane mode is no match for our connection`,
              `We created a new contact form, so you can reach out to us directly from this site.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.11" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('15 March, 2025', '1.11', 'Enhancement')}
            {createList([
              `Sign me up!`,
              `You can now sign in or create an account on groovDB with one click using Google credentials.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.10" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('19 January, 2025', '1.10', 'Enhancement')}
            {createList([
              `Gosh! You don't need to be a know-it-all!`,
              `Partial data is now supported.`,
              `We've updated the sensor input page and UI to accept for partial entries with only Ligand or DNA info.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.9" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('17 October, 2024', '1.9', 'Enhancement')}
            {createList([
              `Double the sensors, double the fun!`,
              `We doubled the number of transcription factors in groov (>200).`,
            ])}
          </Box>
        </Box>
        <Box id="v1.8" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('27 June, 2024', '1.8', 'Enhancement')}
            {createList([
              `So fresh and so clean!!!`,
              `We took inspiration from Uniprot and FPbase to make Sensor components look cleaner.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.7" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('12 June, 2024', '1.7', 'Enhancement')}
            {createList([
              `Mobile friendly! (how kind of you)`,
              `The Navigation bar is now more intuitive and user friendly in both mobile and desktop formats.`,
              `The About subsections look cleaner and are more informative.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.6" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('19 May, 2024', '1.6', 'Enhancement')}
            {createList([
              `You want tools? We got all the tools`,
              `We've incorporated a new Tools tab in the navigation bar.`,
              `This tab links to bioinformatic tools for operator prediction (Snowprint) and genome mining (Ligify).`,
            ])}
          </Box>
        </Box>
        <Box id="v1.5" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('14 Sept, 2023', '1.5', 'Enhancement')}
            {createList([
              `Mo sensors, less bugs!`,
              `We've added ~15 new regulators to groov.`,
              `We also fixed a bug in the New Sensor Entry Form.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.4" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('31 May, 2023', '1.4', 'Enhancement')}
            {createList([
              `So stylish. Get this webpage a runway!`,
              `Account management is sleeker.`,
              `We've reconstructed the account management interface for sign ins, sign ups, and password changes.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.3" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('27 May, 2023', '1.3', 'Enhancement')}
            {createList([
              `Our pages load faster than ... cheetahs`,
              `We've improved state management to make the UI more responsive. Repeat page loading is now super quick.`,
            ])}
          </Box>
        </Box>
        <Box id="v1.2" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('21 March, 2023', '1.2', 'Enhancement')}
            {createList([
              `Picasso designed our home page. No, I'm serious.`,
              `We've restyled the Home page with a protein structure and new logo for a sleeker, cleaner look.`,
            ])}
          </Box>
        </Box>

        <Box id="v1.1" sx={{ gridColumn: 'span 12' }}>
          <Box>
            {getHeader('20 Feb, 2023', '1.1', 'Feature')}
            {createList([
              `Now YOU can groov with us!`,
              `We've added an account feature so you can contribute.`,
              `Once you have an account, you can navigate to About -> Add New Sensor to deposit your sensor into our database.`,
              `We also fixed a few bugs, added some new styling and created new backend features to support those listed above.`,
            ])}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
