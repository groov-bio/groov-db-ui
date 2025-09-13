import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';



export default function Tools() {



  const ToolCard = ({ link, icon, title, description}) => {
    return (


      <Grid size={{xs:10, sm:6, md:4}}
      m={4}
      sx={{border: "1px solid #c5c6fc", borderRadius: 2, p:3,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "scale(1.03)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      },
      cursor: "pointer",}}>

    <a href={link} target="__blank__"   style={{ textDecoration: "none", color: "inherit"  }}>
      <Grid container alignItems={"center"}>
        <Grid>
          <Box
            component="img"
            src={icon}
            sx={{ width: {xs:50, sm:75, ms:100}, margin: 'auto', display: 'block' }}
          />
        </Grid>
        <Grid>
          <Typography
              fontWeight={"300"}
              ml={3}
              sx={{ fontSize: { xs: 30, sm:36, md: 44 }, textAlign:"left" }}
              >
            {title}
          </Typography>
        </Grid>
      </Grid>

      <Grid container
                  pt={2}
                  pl={2}
                  pr={2}
                  >
        <Grid>
          <Typography fontWeight="400" sx={{ fontSize: { xs: 12, sm:16, md: 18 } }}>
            {description}
          </Typography>
        </Grid>
      </Grid>
    </a>
  </Grid>

    );
  };



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
            fontWeight="400"
            gutterBottom
          >
            Tools
          </Typography>
        </Grid>



        <ToolCard 
          link="https://snowprint.groov.bio"
          icon="Snowprint_Logo2.png"
          title="Snowprint"
          description="Uses phylogenetic information to predict what DNA sequence an input transcription factor binds to."
        />

        <ToolCard 
          link="https://ligify.groov.bio"
          icon="Ligify_Logo2.png"
          title="Ligify"
          description="Uses Rhea enzyme reaction data to predict transcription factors responsive to an input chemical."
        />

        <ToolCard 
          link="https://jonathan-tellechea-sensbio-app-sensbio-f6bjn1.streamlit.app/"
          icon="GenericTool_Logo.png"
          title="SensBio"
          description="Searches a TF-ligand reference database to identify putative transcription factors for an input ligand."
        />

        <ToolCard 
          link="https://github.com/UoMMIB/TFBMiner"
          icon="GenericTool_Logo.png"
          title="TFBMiner"
          description="Uses KEGG enzyme reaction data to predict transcription factors responsive to an input chemical."
        />



      </Grid>
    </Box>
  );
}
