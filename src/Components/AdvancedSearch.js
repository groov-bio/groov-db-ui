import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSearchStore from '../zustand/search.store.js';
import {
  Box,
  TextField,
  Button,
  Slider,
  Typography,
  CircularProgress,
  Grid,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function AdvancedSearch() {
  const [smiles, setSmiles] = useState('');
  const [threshold, setThreshold] = useState(0.2);
  const [maxResults, setMaxResults] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [configExpanded, setConfigExpanded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const rawData = useSearchStore((state) => state.rawData);
  const isDataLoaded = useSearchStore((state) => state.data.length > 0);

  // For responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async () => {
    if (!smiles.trim()) {
      setError('Please enter a SMILES string');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults([]);
    setHasSearched(true);

    try {
      const response = await fetch('https://api.groov.bio/ligandSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smiles,
          threshold,
          maxResults,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();

      // Format results
      if (data.results && data.results.length > 0) {
        const formattedResults = data.results.map((result) => {
          const family = rawData[result.sensorId].family;
          const uniprot = rawData[result.sensorId].uniprot;

          return {
            sensorId: result.sensorId,
            ligandId: result.ligandId,
            name: result.name || result.ligandId,
            similarity: result.similarity,
            link: `/entry/${family}/${uniprot}`,
            label: `${result.name || result.ligandId}`,
          };
        });

        setSearchResults(formattedResults);

        // Auto-collapse config after search on mobile
        if (isMobile) {
          setConfigExpanded(false);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setError('Error searching: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fill with example SMILES
  const useExampleSmiles = () => {
    setSmiles('CC1=C(C(=CC(=C1)CCCC(C)C)O)C(C)');
  };

  const toggleConfig = () => {
    setConfigExpanded(!configExpanded);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box
        sx={{
          mb: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 1,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          position: 'relative',
          zIndex: 100,
        }}
      >
        <TextField
          fullWidth
          label="SMILES String"
          variant="outlined"
          value={smiles}
          onChange={(e) => setSmiles(e.target.value)}
          margin="normal"
          error={!!error}
          placeholder="Enter SMILES notation"
          disabled={!isDataLoaded}
          size={isMobile ? 'small' : 'small'}
          sx={{ my: 1 }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Button
            variant="text"
            size="small"
            onClick={useExampleSmiles}
            sx={{
              my: 1,
              padding: '4px 4px',
              fontSize: { xs: '0.65rem', sm: '0.9rem' },
            }}
            disabled={!isDataLoaded}
          >
            Use Example SMILES
          </Button>

          <Box
            onClick={toggleConfig}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'medium',
                mr: 1,
              }}
            >
              Advanced options
            </Typography>
            <IconButton size="small">
              {configExpanded ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={configExpanded}>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid size={{xs:12, sm:6}}>
              <Typography variant="body2">
                Similarity Threshold: {threshold}
              </Typography>
              <Tooltip title="Minimum structural similarity score (0.1-1.0)">
                <Slider
                  value={threshold}
                  onChange={(_, newValue) => setThreshold(newValue)}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 0.1, label: '0.1' },
                    { value: 0.5, label: '0.5' },
                    { value: 1.0, label: '1.0' },
                  ]}
                  disabled={!isDataLoaded}
                  size="small"
                />
              </Tooltip>
            </Grid>

            <Grid size={{xs:12, sm:6}}>
              <Typography variant="body2">Max Results: {maxResults}</Typography>
              <Tooltip title="Maximum number of results to return">
                <Slider
                  value={maxResults}
                  onChange={(_, newValue) => setMaxResults(newValue)}
                  min={1}
                  max={50}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 1, label: '1' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                  ]}
                  disabled={!isDataLoaded}
                  size="small"
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Collapse>

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !smiles.trim() || !isDataLoaded}
          sx={{ mt: 2 }}
          fullWidth
          size="small"
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : searchResults.length > 0 ? (
        <Box
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
            Results ({searchResults.length})
          </Typography>

          <List
            sx={{
              maxHeight: isMobile ? '180px' : '250px',
              overflow: 'auto',
            }}
          >
            {searchResults.map((result, index) => (
              <ListItem
                key={result.sensorId + result.ligandId}
                component={Link}
                to={result.link}
                sx={{
                  borderTop:
                    index > 0 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: isMobile ? '8px 16px' : '8px 16px',
                }}
              >
                <ListItemText
                  primary={result.label}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Uniprot ID: {result.sensorId}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="primary"
                        fontWeight="bold"
                      >
                        Similarity Score: {Math.round(result.similarity * 100)}%
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : hasSearched && !loading ? (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="body1">
            No matching results found. Try adjusting the threshold or using a
            different SMILES.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
