import {
  getAllTempSensorsV2,
  getTempSensorV2,
  getAllProcessedTempV2,
  getProcessedTempV2,
  addNewSensorV2,
  deleteTempV2,
  editSensorV2,
  approveProcessedSensorV2,
  rejectProcessedSensorV2,
  deleteSensorV2,
  lookupDoiV2,
  fetchPublishedSensorsV2,
} from './v2Admin';

const V2_API_BASE = 'https://api.groov.bio';

function makeUser({ jwt = 'test-jwt', username = 'test-user' } = {}) {
  return {
    cognitoUser: {
      getSignInUserSession: () => ({
        getIdToken: () => ({
          getJwtToken: () => jwt,
        }),
      }),
      getUsername: () => username,
    },
  };
}

function mockFetchResponse({ ok = true, status = 200, json = {} } = {}) {
  return {
    ok,
    status,
    json: () => Promise.resolve(json),
  };
}

describe('v2Admin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTempSensorsV2', () => {
    it('fetches the endpoint with auth headers and returns parsed JSON on success', async () => {
      const user = makeUser({ jwt: 'jwt-1' });
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ json: { submissions: [{ id: 1 }] } })
        )
      );

      const result = await getAllTempSensorsV2(user);

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/getAllTempSensors`,
        { headers: { Accept: 'application/json', Authorization: 'jwt-1' } }
      );
      expect(result).toEqual({ submissions: [{ id: 1 }] });
    });

    it('returns an empty submissions list on a 204', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ status: 204 }))
      );

      const result = await getAllTempSensorsV2(user);

      expect(result).toEqual({ submissions: [] });
    });

    it('throws using the server message when the response is not ok', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ ok: false, status: 500, json: { message: 'boom' } })
        )
      );

      await expect(getAllTempSensorsV2(user)).rejects.toThrow('boom');
    });

    it('throws a default message when the error body has no message', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ ok: false, status: 404, json: {} }))
      );

      await expect(getAllTempSensorsV2(user)).rejects.toThrow(
        'Failed to load temp sensors (404)'
      );
    });
  });

  describe('getTempSensorV2', () => {
    it('fetches the encoded submissionUUID with auth headers and returns JSON', async () => {
      const user = makeUser({ jwt: 'jwt-2' });
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ json: { id: 'abc' } }))
      );

      const result = await getTempSensorV2(user, 'uuid one/two');

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/getTempSensor?submissionUUID=${encodeURIComponent(
          'uuid one/two'
        )}`,
        { headers: { Accept: 'application/json', Authorization: 'jwt-2' } }
      );
      expect(result).toEqual({ id: 'abc' });
    });

    it('throws using the server message when not ok', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ ok: false, status: 404, json: { message: 'not found' } })
        )
      );

      await expect(getTempSensorV2(user, 'x')).rejects.toThrow('not found');
    });
  });

  describe('getAllProcessedTempV2', () => {
    it('returns parsed JSON on success', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ json: { processed: [{ id: 1 }] } }))
      );

      const result = await getAllProcessedTempV2(user);

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/getAllProcessedTemp`,
        { headers: expect.objectContaining({ Accept: 'application/json' }) }
      );
      expect(result).toEqual({ processed: [{ id: 1 }] });
    });

    it('returns an empty processed list on a 204', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ status: 204 }))
      );

      const result = await getAllProcessedTempV2(user);

      expect(result).toEqual({ processed: [] });
    });

    it('throws on a non-ok response', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ ok: false, status: 500, json: {} }))
      );

      await expect(getAllProcessedTempV2(user)).rejects.toThrow(
        'Failed to load processed sensors (500)'
      );
    });
  });

  describe('getProcessedTempV2', () => {
    it('fetches the encoded submissionUUID and returns JSON', async () => {
      const user = makeUser({ jwt: 'jwt-3' });
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ json: { id: 'p1' } }))
      );

      const result = await getProcessedTempV2(user, 'uuid&2');

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/getProcessedTemp?submissionUUID=${encodeURIComponent(
          'uuid&2'
        )}`,
        { headers: { Accept: 'application/json', Authorization: 'jwt-3' } }
      );
      expect(result).toEqual({ id: 'p1' });
    });

    it('throws on a non-ok response', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ ok: false, status: 400, json: {} }))
      );

      await expect(getProcessedTempV2(user, 'x')).rejects.toThrow(
        'Failed to load processed sensor (400)'
      );
    });
  });

  describe('addNewSensorV2', () => {
    it('POSTs the submissionUUID with auth + content-type headers', async () => {
      const user = makeUser({ jwt: 'jwt-4' });
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ status: 202, json: { message: 'queued' } })
        )
      );

      const result = await addNewSensorV2(user, 'sub-1');

      expect(global.fetch).toHaveBeenCalledWith(`${V2_API_BASE}/v2/addNewSensor`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'jwt-4',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionUUID: 'sub-1' }),
      });
      expect(result).toEqual({ status: 202, body: { message: 'queued' } });
    });

    it('resolves with the status/body instead of throwing on a non-ok response', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ ok: false, status: 409, json: { message: 'conflict' } })
        )
      );

      const result = await addNewSensorV2(user, 'sub-1');

      expect(result).toEqual({ status: 409, body: { message: 'conflict' } });
    });
  });

  describe('deleteTempV2', () => {
    it('POSTs the submissionUUID and returns status/body on success', async () => {
      const user = makeUser({ jwt: 'jwt-5' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 204,
          // Simulate a real empty 204 body: res.json() rejects and
          // parseJsonOrEmpty() falls back to {}.
          json: () => Promise.reject(new Error('Unexpected end of JSON input')),
        })
      );

      const result = await deleteTempV2(user, 'sub-2');

      expect(global.fetch).toHaveBeenCalledWith(`${V2_API_BASE}/v2/deleteTemp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'jwt-5',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionUUID: 'sub-2' }),
      });
      expect(result).toEqual({ status: 204, body: {} });
    });

    it('resolves with status/body instead of throwing on a 404', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ ok: false, status: 404, json: {} }))
      );

      const result = await deleteTempV2(user, 'missing-sub');

      expect(result).toEqual({ status: 404, body: {} });
    });
  });

  describe('editSensorV2', () => {
    it('POSTs category/grv_id/data plus the username and a timestamp', async () => {
      const user = makeUser({ jwt: 'jwt-6', username: 'alice' });
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ status: 202, json: { message: 'queued' } })
        )
      );

      const result = await editSensorV2(user, {
        category: 'TF',
        grv_id: 'grv-1',
        data: { foo: 'bar' },
      });

      expect(global.fetch).toHaveBeenCalledWith(`${V2_API_BASE}/v2/editSensor`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'jwt-6',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'TF',
          grv_id: 'grv-1',
          data: { foo: 'bar' },
          user: 'alice',
          timeSubmit: 1700000000000,
        }),
      });
      expect(result).toEqual({ status: 202, body: { message: 'queued' } });

      nowSpy.mockRestore();
    });
  });

  describe('approveProcessedSensorV2', () => {
    it('POSTs the submissionUUID and returns status/body on success', async () => {
      const user = makeUser({ jwt: 'jwt-7' });
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({
            status: 200,
            json: { message: 'ok', grv_id: 'g1', category: 'TF' },
          })
        )
      );

      const result = await approveProcessedSensorV2(user, 'sub-3');

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/approveProcessedSensor`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'jwt-7',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submissionUUID: 'sub-3' }),
        }
      );
      expect(result).toEqual({
        status: 200,
        body: { message: 'ok', grv_id: 'g1', category: 'TF' },
      });
    });

    it('returns status/body without throwing on a 409 conflict', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({
            ok: false,
            status: 409,
            json: { message: 'already promoted' },
          })
        )
      );

      const result = await approveProcessedSensorV2(user, 'sub-3');

      expect(result).toEqual({ status: 409, body: { message: 'already promoted' } });
    });
  });

  describe('rejectProcessedSensorV2', () => {
    it('POSTs the submissionUUID and returns status/body', async () => {
      const user = makeUser({ jwt: 'jwt-8' });
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ status: 204, json: {} }))
      );

      const result = await rejectProcessedSensorV2(user, 'sub-4');

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/rejectProcessedSensor`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'jwt-8',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submissionUUID: 'sub-4' }),
        }
      );
      expect(result).toEqual({ status: 204, body: {} });
    });
  });

  describe('deleteSensorV2', () => {
    it('POSTs category/grv_id and returns status/body on success', async () => {
      const user = makeUser({ jwt: 'jwt-9' });
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({
            status: 200,
            json: { message: 'deleted', grv_id: 'g2', category: 'RNA' },
          })
        )
      );

      const result = await deleteSensorV2(user, 'RNA', 'g2');

      expect(global.fetch).toHaveBeenCalledWith(`${V2_API_BASE}/v2/deleteSensor`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'jwt-9',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: 'RNA', grv_id: 'g2' }),
      });
      expect(result).toEqual({
        status: 200,
        body: { message: 'deleted', grv_id: 'g2', category: 'RNA' },
      });
    });

    it('returns status/body without throwing on a 404', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({ ok: false, status: 404, json: { message: 'not found' } })
        )
      );

      const result = await deleteSensorV2(user, 'RNA', 'missing');

      expect(result).toEqual({ status: 404, body: { message: 'not found' } });
    });
  });

  describe('lookupDoiV2', () => {
    it('GETs the encoded doi with auth headers and returns status/body', async () => {
      const user = makeUser({ jwt: 'jwt-10' });
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ status: 200, json: { title: 'A paper' } }))
      );

      const result = await lookupDoiV2(user, '10.1000/abc def');

      expect(global.fetch).toHaveBeenCalledWith(
        `${V2_API_BASE}/v2/doiLookup?doi=${encodeURIComponent('10.1000/abc def')}`,
        { headers: { Accept: 'application/json', Authorization: 'jwt-10' } }
      );
      expect(result).toEqual({ status: 200, body: { title: 'A paper' } });
    });

    it('returns status/body without throwing on a non-ok response', async () => {
      const user = makeUser();
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ ok: false, status: 404, json: {} }))
      );

      const result = await lookupDoiV2(user, 'bad-doi');

      expect(result).toEqual({ status: 404, body: {} });
    });
  });

  describe('fetchPublishedSensorsV2', () => {
    it('fetches the public index with a cache-busting timestamp and no auth', async () => {
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockFetchResponse({
            json: { stats: { regulators: 1, ligands: 2 }, sensors: [] },
          })
        )
      );

      const result = await fetchPublishedSensorsV2();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://groov-api.com/v2/index.json?t=1700000000000',
        { cache: 'no-store' }
      );
      expect(result).toEqual({ stats: { regulators: 1, ligands: 2 }, sensors: [] });

      nowSpy.mockRestore();
    });

    it('throws when the response is not ok', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(mockFetchResponse({ ok: false, status: 503, json: {} }))
      );

      await expect(fetchPublishedSensorsV2()).rejects.toThrow(
        'Failed to load published sensors (503)'
      );
    });
  });
});
