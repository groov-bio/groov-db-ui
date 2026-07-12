// NavigationBar.js imports '@aws-amplify/ui-react/styles.css' directly. The
// project's jest moduleNameMapper only maps the bare '@aws-amplify/ui-react'
// package specifier (see package.json), not this CSS subpath, and there's no
// CSS transform configured, so Jest can't resolve it. No other existing test
// imports NavigationBar.js, so this gap wasn't previously hit. Stub it here
// (virtual module, since the "file" isn't otherwise resolvable) rather than
// touching the shared jest config.
jest.mock('@aws-amplify/ui-react/styles.css', () => ({}), { virtual: true });

import { Auth } from 'aws-amplify';
import { renderWithProviders, screen } from '../../test-utils';
import useFeatureFlagsStore from '../../zustand/featureFlags.store';
import NavigationBar from '../../Components/NavigationBar.js';

function getHamburgerIcon(container) {
  return container.querySelector('[aria-label="open drawer"] svg');
}

describe('NavigationBar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    useFeatureFlagsStore.setState({ flags: {} });
    jest.clearAllMocks();
  });

  test('renders the primary desktop nav links with correct hrefs', () => {
    const { container } = renderWithProviders(<NavigationBar />);
    expect(container.querySelector('#Browse')).toHaveAttribute('href', '/database');
    expect(container.querySelector('#Tools')).toHaveAttribute('href', '/tools');
    expect(container.querySelector('#About')).toHaveAttribute(
      'href',
      '/about/about-groovdb'
    );
  });

  test('renders the groovDB logo linking to /home', () => {
    renderWithProviders(<NavigationBar />);
    const logos = screen.getAllByAltText('groovDB_icon');
    expect(logos.length).toBeGreaterThan(0);
    logos.forEach((logo) => {
      expect(logo.closest('a')).toHaveAttribute('href', '/home');
    });
  });

  test('toggles between light and dark mode when the theme button is clicked', async () => {
    const { user } = renderWithProviders(<NavigationBar />);

    const toggle = screen.getByTitle('Switch to dark mode');
    await user.click(toggle);

    expect(screen.getByTitle('Switch to light mode')).toBeInTheDocument();
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });

  test('shows a "Sign In" option in the avatar menu when logged out, and triggers federated sign-in', async () => {
    const { container, user } = renderWithProviders(<NavigationBar />);

    const avatarButton = container.querySelector('.MuiAvatar-root').closest('button');
    await user.click(avatarButton);

    const signIn = await screen.findByText('Sign In');
    await user.click(signIn);

    expect(Auth.federatedSignIn).toHaveBeenCalled();
  });

  test('opens the mobile navigation drawer revealing Browse/Tools links and an About toggle', async () => {
    const { container, user } = renderWithProviders(<NavigationBar />);

    // Only the desktop "Browse" link exists before the drawer opens.
    expect(screen.getAllByText('Browse')).toHaveLength(1);

    await user.click(getHamburgerIcon(container));

    // The mobile drawer adds a second "Browse" entry (desktop link + mobile list item).
    expect(screen.getAllByText('Browse')).toHaveLength(2);
    expect(screen.getAllByText('Tools')).toHaveLength(2);
    expect(screen.getAllByText('About')).toHaveLength(2);
  });

  test('expanding the mobile About toggle reveals sub-navigation links', async () => {
    const { container, user } = renderWithProviders(<NavigationBar />);

    await user.click(getHamburgerIcon(container));

    const aboutToggles = screen.getAllByText('About');
    // Index 0 is the always-present desktop link; index 1 is the mobile toggle.
    await user.click(aboutToggles[1]);

    const citingLink = screen.getByText('Citing').closest('a');
    expect(citingLink).toHaveAttribute('href', '/about/cite');
  });

  test('mobile About submenu excludes "What\'s new in V2" by default, and includes it when the flag is on', async () => {
    const { container, user, unmount } = renderWithProviders(<NavigationBar />);
    await user.click(getHamburgerIcon(container));
    await user.click(screen.getAllByText('About')[1]);
    expect(screen.queryByText("What's new in V2")).not.toBeInTheDocument();
    unmount();

    useFeatureFlagsStore.setState({ flags: { v2_sensor_page: { local: true } } });
    const rendered = renderWithProviders(<NavigationBar />);
    await rendered.user.click(getHamburgerIcon(rendered.container));
    await rendered.user.click(screen.getAllByText('About')[1]);
    const v2Link = screen.getByText("What's new in V2").closest('a');
    expect(v2Link).toHaveAttribute('href', '/about/v2');
  });
});
