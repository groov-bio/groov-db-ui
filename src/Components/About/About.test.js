import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '../../test-utils';
import About from './About.js';

// About.js is mounted at "/about/*" in the real app (see src/App.js), and its
// internal <Link to="contact" /> etc. rely on that nesting to resolve to
// "/about/contact". Replicate that nesting here per TESTING.md guidance for
// components that depend on route context.
function renderAbout(route) {
  return renderWithProviders(
    <Routes>
      <Route path="/about/*" element={<About />} />
    </Routes>,
    { route }
  );
}

describe('About', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the "About groovDB" content at /about/about-groovdb', () => {
    renderAbout('/about/about-groovdb');
    expect(screen.getByText('A genetic sensor database')).toBeInTheDocument();
  });

  test('renders the Contact page content at /about/contact', () => {
    renderAbout('/about/contact');
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders the Cite page content at /about/cite', () => {
    renderAbout('/about/cite');
    expect(screen.getByText('Citing other tools')).toBeInTheDocument();
  });

  test('has no route for "/about/v2" while the v2_sensor_page flag is off', () => {
    renderAbout('/about/v2');
    expect(
      screen.queryByText("What's new in groovDB")
    ).not.toBeInTheDocument();
  });

  function mockNotSmallScreen() {
    // The global matchMedia polyfill (setupTests.js) always reports
    // matches:false, which makes About's `isNotSmallScreen` false and hides
    // the permanent Drawer. Override matchMedia for these tests only to
    // simulate a >=sm viewport and exercise the sidebar.
    jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: true,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  }

  test('shows the sidebar navigation with a link to Contact when on the bare /about route', () => {
    mockNotSmallScreen();

    const { container } = renderAbout('/about');
    const contactLink = container.querySelector('#contact-about-route');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/about/contact');
    expect(contactLink).toHaveTextContent('Contact');
  });

  // SUSPECTED BUG: About.js's sidebar links use relative `<Link to={topic.path}>`
  // (e.g. to="contact"). About is mounted at "/about/*" (see src/App.js), a
  // splat route, and React Router resolves relative links against the *entire*
  // matched pathname for a splat route, not just its "/about" prefix. So the
  // links only resolve correctly ("/about/contact") from the bare "/about"
  // URL. From any topic subpage -- including "/about/about-groovdb", the
  // default landing page users reach via the main nav's "About" link -- every
  // sidebar link resolves to a broken, doubly-nested URL instead, e.g.
  // "/about/about-groovdb/contact". This test documents that CURRENT (buggy)
  // behavior rather than the presumably-intended "/about/contact".
  test('sidebar links resolve to a doubly-nested URL when navigated from a topic subpage (suspected bug)', () => {
    mockNotSmallScreen();

    const { container } = renderAbout('/about/about-groovdb');
    const contactLink = container.querySelector('#contact-about-route');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute(
      'href',
      '/about/about-groovdb/contact'
    );
  });
});
