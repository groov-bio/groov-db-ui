import { useState } from 'react';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import ReferencesArrayEdit from '../../../Components/editSensorV2/ReferencesArrayEdit';

// ReferencesArrayEdit is a plain controlled component (not Formik-bound): it
// only shows a typed value once the parent re-renders it with updated
// `items`. This harness re-plays onChange back into state so typing actually
// shows up, the way EditSensorV2/ProteinEditSection use it in the real app.
function makeCognitoUser() {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({ getJwtToken: () => 'jwt-token' }),
      }),
    },
  };
}

function Harness({ initialItems, user, onChangeSpy }) {
  const [items, setItems] = useState(initialItems);
  return (
    <ReferencesArrayEdit
      items={items}
      user={user}
      onChange={(next) => {
        onChangeSpy?.(next);
        setItems(next);
      }}
    />
  );
}

describe('ReferencesArrayEdit', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, ok: true, json: () => Promise.resolve({}) })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  test('shows the empty-state message when there are no items', () => {
    renderWithProviders(<ReferencesArrayEdit items={[]} onChange={() => {}} user={{}} />);
    expect(screen.getByText(/no references/i)).toBeInTheDocument();
  });

  test('renders a reference entry (expanded by default) with its title, year, journal, DOI, and authors', () => {
    const items = [
      {
        title: 'A great paper about regulators',
        year: 2020,
        journal: 'Nature',
        doi: '10.1000/paper',
        url: 'https://example.com/paper',
        authors: [{ last_name: 'Smith', first_name: 'Jane' }],
      },
    ];
    renderWithProviders(<ReferencesArrayEdit items={items} onChange={() => {}} user={{}} />);

    // The (truncated) title appears both as the accordion summary heading and
    // as the Title textarea's value -- getAllByText avoids the ambiguity.
    expect(screen.getAllByText('A great paper about regulators').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Title')).toHaveValue('A great paper about regulators');
    expect(screen.getByLabelText('Year')).toHaveValue(2020);
    expect(screen.getByLabelText('Journal')).toHaveValue('Nature');
    expect(screen.getByLabelText('DOI')).toHaveValue('10.1000/paper');
    expect(screen.getByLabelText('URL')).toHaveValue('https://example.com/paper');
    expect(screen.getByLabelText('Last name')).toHaveValue('Smith');
    expect(screen.getByLabelText('First name')).toHaveValue('Jane');
  });

  test('falls back to "DOI: <doi>" as the accordion title when there is no title', () => {
    const items = [{ doi: '10.1000/notitle', authors: [] }];
    renderWithProviders(<ReferencesArrayEdit items={items} onChange={() => {}} user={{}} />);
    expect(screen.getByText('DOI: 10.1000/notitle')).toBeInTheDocument();
  });

  test('the "Look up" button is disabled until a DOI is entered, then calls lookupDoiV2 (fetch) on click', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () =>
          Promise.resolve({ reference: { title: 'Found Title', year: 2021, journal: 'Science', authors: [] } }),
      })
    );
    const items = [{ title: null, doi: null, authors: [] }];
    const { user } = renderWithProviders(<Harness initialItems={items} user={makeCognitoUser()} />);

    const lookupButton = screen.getByRole('button', { name: /look up/i });
    expect(lookupButton).toBeDisabled();

    await user.type(screen.getByLabelText('DOI'), '10.1000/xyz');
    expect(screen.getByRole('button', { name: /look up/i })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /look up/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.groov.bio/v2/doiLookup?doi='),
        expect.any(Object)
      )
    );
  });

  test('clicking "Add reference" calls onChange with an additional empty reference', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<ReferencesArrayEdit items={[]} onChange={onChange} user={{}} />);

    await user.click(screen.getByRole('button', { name: /add reference/i }));

    expect(onChange).toHaveBeenCalledWith([
      { title: null, authors: [], year: null, journal: null, doi: null, url: null, interaction: [] },
    ]);
  });
});
