import { Box, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function ProteinTabs({
  proteins,
  currentProteinIndex,
  onProteinChange,
  onAddProtein,
  onRemoveProtein,
}) {
  const getProteinLabel = (protein, index) => {
    if (protein.about?.alias && protein.about.alias.trim() !== '') {
      return protein.about.alias;
    }
    return `Protein ${index + 1}`;
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Tabs
        value={currentProteinIndex}
        onChange={(event, newValue) => onProteinChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ flexGrow: 1 }}
      >
        {proteins.map((protein, index) => (
          <Tab
            key={protein.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {getProteinLabel(protein, index)}
                {proteins.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveProtein(index);
                    }}
                    sx={{
                      ml: 0.5,
                      padding: '2px',
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            }
          />
        ))}
      </Tabs>

      <Tooltip title="Add Protein">
        <IconButton
          onClick={onAddProtein}
          color="primary"
          sx={{ mr: 2 }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
