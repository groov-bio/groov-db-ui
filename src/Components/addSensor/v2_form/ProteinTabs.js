import { Box, Tabs, Tab, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ProteinTabs({
  proteins,
  currentProteinIndex,
  onProteinChange,
  onAddProtein,
  onRemoveProtein,
  errors = [],
}) {
  const getProteinLabel = (protein, index) => {
    if (protein.alias && protein.alias.trim() !== '') {
      return protein.alias;
    }
    return `Protein ${index + 1}`;
  };

  const isSingleProtein = proteins.length === 1;

  const hasErrors = (index) => {
    if (!errors || !Array.isArray(errors)) return false;
    const proteinError = errors[index];
    if (!proteinError) return false;
    if (typeof proteinError === 'string') return true;
    return Object.keys(proteinError).length > 0;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Tabs
        value={currentProteinIndex}
        onChange={(_event, newValue) => onProteinChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          flexGrow: 1,
          minHeight: 52,
          '& .MuiTab-root': {
            minHeight: 52,
            px: 3,
            py: 1.5,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'text.disabled',
            transition: 'color 0.2s',
            '&.Mui-selected': {
              color: 'text.primary',
            },
            '&:hover:not(.Mui-selected)': {
              color: 'text.secondary',
            },
          },
          '& .MuiTabs-indicator': {
            height: 2,
          },
        }}
      >
        {proteins.map((protein, index) => (
          <Tab
            key={protein.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {hasErrors(index) && (
                  <WarningAmberIcon
                    sx={{ fontSize: 15, color: 'warning.main', flexShrink: 0 }}
                  />
                )}
                {getProteinLabel(protein, index)}
                {proteins.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveProtein(index);
                    }}
                    sx={{
                      ml: 0.25,
                      p: '2px',
                      opacity: 0.4,
                      '&:hover': {
                        opacity: 1,
                        color: 'error.main',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                )}
              </Box>
            }
          />
        ))}
      </Tabs>

      <Button
        onClick={onAddProtein}
        startIcon={<AddIcon />}
        variant={isSingleProtein ? 'contained' : 'outlined'}
        color="primary"
        size="small"
        sx={{ mx: 1.5, my: 1, whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        {isSingleProtein ? 'Add second protein (two-component)' : 'Add protein'}
      </Button>
    </Box>
  );
}
