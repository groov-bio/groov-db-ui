# Contributing to GroovDB

Thank you for your interest in contributing to GroovDB! This document provides guidelines and information for contributors.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive in all interactions
- Focus on constructive feedback and collaboration
- Respect differing viewpoints and experiences
- Show empathy towards other community members
- Use welcoming and inclusive language

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use a clear, descriptive title** that summarizes the problem
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected vs. actual behavior
   - Browser/environment details
   - Screenshots if applicable

### Types of Contributions

We welcome several types of contributions:

#### 🐛 Bug Reports

- UI/UX issues
- Data display problems
- Performance issues
- Browser compatibility problems

#### 💡 Feature Requests

- New visualization tools
- Enhanced search capabilities
- Data export features
- Accessibility improvements

#### 📊 Data Contributions

- New biosensor entries (via the web interface at [groov.bio](https://groov.bio))
- Corrections to existing data
- Additional literature references

#### 📚 Documentation

- README improvements
- Code comments
- User guides
- API documentation

#### 🔧 Code Contributions

- Bug fixes
- New features
- Performance optimizations
- Test improvements

## Development Workflow

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Setting Up Development Environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/groov-db-ui.git
cd groov-db-ui

# Add upstream remote
git remote add upstream https://github.com/original-org/groov-db-ui.git

# Install dependencies
npm install

# Start development server
npm start
```

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow the coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   # Run tests
   npm run cy:run

   # Check for linting issues
   npm run prettier:fix

   # Build to ensure no errors
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new biosensor visualization feature"
   ```

### Commit Message Guidelines

Use conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

```
feat: add protein structure zoom functionality
fix: resolve ligand structure rendering issue
docs: update installation instructions
test: add tests for search component
```

### Pull Request Process

1. **Update your branch with latest upstream changes**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**

   - Use a clear, descriptive title
   - Reference any related issues
   - Provide detailed description of changes
   - Include screenshots for UI changes

4. **Address feedback**
   - Respond to reviewer comments
   - Make requested changes
   - Push updates to your branch

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add PropTypes or TypeScript types where applicable

```jsx
// Good
const ProteinStructure = ({ structureId, height = '500px' }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Component logic
  }, [structureId]);

  return <div className="protein-structure">{/* Component JSX */}</div>;
};
```

### Styling

- Use Material-UI components and theming
- Follow responsive design principles
- Use semantic HTML elements
- Ensure accessibility compliance (WCAG 2.1)

### File Organization

- Place components in appropriate directories
- Use descriptive file names
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### Testing

- Write unit tests for utility functions
- Add component tests for complex interactions
- Include end-to-end tests for critical user flows
- Aim for meaningful test coverage, not just high percentages

## Data Contribution Guidelines

### Biosensor Data Quality Standards

When contributing biosensor data through the web interface:

1. **Literature Verification**

   - All interactions must be backed by peer-reviewed literature
   - Provide specific figure/table references
   - Use primary literature sources when possible

2. **Experimental Evidence**

   - Follow the accepted evidence criteria listed on the website
   - Include binding affinity values when available
   - Specify experimental conditions (pH, temperature, etc.)

3. **Data Accuracy**
   - Double-check protein sequences and accession IDs
   - Verify ligand structures and identifiers
   - Ensure DNA sequences are accurate

### Data Review Process

1. Community submissions are reviewed by maintainers
2. References are verified against original literature
3. Data quality is assessed using established criteria
4. Feedback is provided for any necessary corrections

## UI/UX Guidelines

### Design Principles

- **Clarity**: Information should be easy to find and understand
- **Consistency**: Use established patterns and components
- **Accessibility**: Ensure all users can access the interface
- **Performance**: Optimize for fast loading and smooth interactions

### Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers

### Mobile Responsiveness

- Design mobile-first
- Test on various screen sizes
- Ensure touch-friendly interaction areas
- Optimize performance for mobile devices

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Schedule

- Patch releases: As needed for critical fixes
- Minor releases: Monthly for new features
- Major releases: Annually or for significant changes

## Getting Help

### Documentation

- **User Guide**: Available at [groov.bio](https://groov.bio)
- **API Docs**: [api.groov.bio/swagger](https://api.groov.bio/swagger)
- **Code Comments**: Inline documentation in source code

### Communication

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Contact Form**: [groov.bio/contact](https://groov.bio/contact)

### Development Setup Issues

If you encounter problems setting up the development environment:

1. Check the troubleshooting section in README.md
2. Search existing issues for similar problems
3. Create a new issue with:
   - Your operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Steps you've already tried

## Recognition

Contributors will be recognized in several ways:

- **Contributors List**: Listed in repository contributors
- **Changelog**: Mentioned in release notes
- **Website**: Data contributors acknowledged on the platform
- **Publications**: Significant contributors may be included in academic publications

## Questions?

Don't hesitate to ask questions! We're here to help new contributors get started. The best ways to get help are:

1. Check existing documentation and issues
2. Create a GitHub issue for specific problems
3. Use the contact form for general questions

Thank you for contributing to GroovDB and advancing synthetic biology research! 🧬
