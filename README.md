# GroovDB Web Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The web interface for [GroovDB](https://groov.bio) - a comprehensive database of genetic biosensors for synthetic biology applications.

> **Local development:** this UI runs as part of the single-command, fully-offline
> Floci emulation stack. See **`groov-db-api/LOCAL_DEV.md`** (the sibling repo) for
> setup — the compose file, provisioning, and env contract all live there.

## About GroovDB

GroovDB is a free, open-source, and community-editable database for transcription factor biosensors and their properties. Genetic biosensors are integral to synthetic biology, particularly ligand-inducible prokaryotic transcription factors used in high-throughput screening, dynamic feedback regulation, multilayer logic gates, and diagnostic applications.

### Key Features

- **Comprehensive Data**: Contains all information necessary to build chemically responsive genetic circuits
- **Verified Interactions**: Ligand and DNA interaction data verified against peer-reviewed literature
- **Rich Visualization**: 3D protein structures, sequence viewers, and ligand visualizations
- **Genetic Context**: Custom tool to visualize natural genetic context of biosensor entries
- **Search & Filter**: Advanced search capabilities across multiple data types
- **Community Driven**: Open source with contribution guidelines for community involvement

## Live Demo

Visit the live application at [https://groov.bio](https://groov.bio)

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/groov-db-ui.git
cd groov-db-ui

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Technology Stack

### Frontend Framework

- **React 18** - Modern React with hooks and functional components
- **Material-UI v5** - Comprehensive React UI component library
- **React Router v6** - Client-side routing

### Data Visualization

- **Nightingale Structure** - 3D protein structure visualization using Mol\*
- **SMILES Drawer** - Chemical structure visualization
- **Biomsa** - Multiple sequence alignment viewer
- **Konva/React-Konva** - 2D canvas library for custom visualizations

### State Management

- **Zustand** - Lightweight state management
- **React Hook Form** - Performant form handling
- **Formik** - Form library with validation

### Development Tools

- **Webpack 5** - Module bundler
- **Babel** - JavaScript compiler
- **Cypress** - End-to-end testing
- **Prettier** - Code formatting

## Project Structure

```
src/
├── Components/           # React components
│   ├── About/           # About pages and documentation
│   ├── Auth/            # Authentication components
│   ├── Sensor_Components/ # Biosensor data visualization
│   ├── addSensor/       # Sensor submission workflow
│   └── form-inputs/     # Reusable form components
├── lib/                 # Utility libraries and validation
├── utils/               # Helper functions
├── zustand/             # State stores
└── css/                 # Stylesheets
```

## Key Components

### Biosensor Visualization

- **ProteinStructure.js** - 3D protein structure viewer using Nightingale
- **LigandViewer.js** - Chemical structure visualization
- **SeqViewer.js** - Protein sequence display
- **DNAbinding.js** - DNA-binding site visualization
- **GenomeContext.js** - Genetic context visualization

### Data Management

- **Search.js** - Main search interface
- **SensorTable.js** - Biosensor data table with filtering
- **AddSensor.js** - Community sensor submission

## API Integration

The frontend integrates with the GroovDB API endpoints:

- `https://api.groov.bio/` - Main API for sensor data
- `https://groov-api.com/` - Static data files and indexes

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards
- Submitting pull requests

## Security

If you discover a security vulnerability, please see our [Security Policy](SECURITY.md) for reporting guidelines.

## Testing

### End-to-End Tests

```bash
# Run Cypress tests
npm run cy:run

# Open Cypress interactive mode
npm run cy:open
```

### Component Tests

Cypress component tests are located in `cypress/component/`

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:fast` - Fast build without source maps or ESLint
- `npm run cy:open` - Open Cypress test runner
- `npm run cy:run` - Run Cypress tests in headless mode
- `npm run prettier:fix` - Format code with Prettier

## Deployment

The application is designed to be deployed as a static site. Build artifacts are generated in the `build/` directory.

### Environment Variables

Create a `.env` file for local development:

```bash
# Optional: Custom API endpoints
REACT_APP_API_BASE_URL=https://api.groov.bio
```

## Citation

If you use GroovDB in your research, please cite:

> Love, J.D., et al. "groovDB in 2026: a community-editable database of small molecule biosensors" _Nucleic Acids Research_ (2025). DOI: [10.1093/nar/gkaf1074](https://doi.org/10.1093/nar/gkaf1074)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Simon d'Oelsnitz** - _Project lead_ - [simondoelsnitz.com](https://simondoelsnitz.com)
- **Joshua D. Love** - _Software lead_

## Biocurators

- **Brady M Rafferty**
- **Michael Thomas**
- **Nicole N Zhao**
- **Pranay Talla**


## Acknowledgments

- The synthetic biology community for providing biosensor data
- Contributors who have submitted sensors and improvements
- The open source libraries that make this project possible

## Support

- 📖 Documentation: [groov.bio/about](https://groov.bio/about/about-groovdb)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/your-org/groov-db-ui/issues)
- 💬 Contact: Use the contact form at [groov.bio/contact](https://groov.bio/contact)
- 🔬 API Documentation: [api.groov.bio/swagger](https://api.groov.bio/swagger)

---

Made with ❤️ for the synthetic biology community
