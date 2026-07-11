import {
  STIMULUS_KINDS,
  STIMULUS_KIND_LABELS,
  createEmptyEvidence,
  createEmptyItem,
  createEmptyCard,
  stimulusToCards,
  cardToEntry,
  cardsToStimulus,
} from './stimulusShape';

describe('Stimulus Shape Utilities', () => {
  describe('STIMULUS_KINDS constant', () => {
    test('has expected stimulus kinds', () => {
      expect(STIMULUS_KINDS).toEqual(['small_molecule', 'light', 'temperature']);
    });

    test('is an array of strings', () => {
      expect(Array.isArray(STIMULUS_KINDS)).toBe(true);
      expect(STIMULUS_KINDS.every((kind) => typeof kind === 'string')).toBe(true);
    });

    test('has exactly 3 kinds', () => {
      expect(STIMULUS_KINDS.length).toBe(3);
    });
  });

  describe('STIMULUS_KIND_LABELS constant', () => {
    test('has labels for all kinds', () => {
      expect(STIMULUS_KIND_LABELS).toHaveProperty('small_molecule');
      expect(STIMULUS_KIND_LABELS).toHaveProperty('light');
      expect(STIMULUS_KIND_LABELS).toHaveProperty('temperature');
    });

    test('has correct label values', () => {
      expect(STIMULUS_KIND_LABELS.small_molecule).toBe('Small molecule');
      expect(STIMULUS_KIND_LABELS.light).toBe('Light');
      expect(STIMULUS_KIND_LABELS.temperature).toBe('Temperature');
    });

    test('has exactly 3 labels', () => {
      expect(Object.keys(STIMULUS_KIND_LABELS).length).toBe(3);
    });
  });

  describe('createEmptyEvidence factory', () => {
    test('returns object with expected keys', () => {
      const evidence = createEmptyEvidence();
      expect(evidence).toHaveProperty('method');
      expect(evidence).toHaveProperty('ref_figure');
      expect(evidence).toHaveProperty('doi');
      expect(evidence).toHaveProperty('kd');
    });

    test('has exactly 4 keys', () => {
      const evidence = createEmptyEvidence();
      expect(Object.keys(evidence).length).toBe(4);
    });

    test('has correct default values', () => {
      const evidence = createEmptyEvidence();
      expect(evidence.method).toEqual([]);
      expect(evidence.ref_figure).toBe(null);
      expect(evidence.doi).toBe(null);
      expect(evidence.kd).toBe(null);
    });

    test('method is an empty array', () => {
      const evidence = createEmptyEvidence();
      expect(Array.isArray(evidence.method)).toBe(true);
      expect(evidence.method.length).toBe(0);
    });
  });

  describe('createEmptyItem factory', () => {
    test('creates small_molecule item with expected keys', () => {
      const item = createEmptyItem('small_molecule');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('smiles');
      expect(item).toHaveProperty('regulatory_effect');
      expect(Object.keys(item).length).toBe(3);
    });

    test('creates light item with expected keys', () => {
      const item = createEmptyItem('light');
      expect(item).toHaveProperty('wavelength');
      expect(item).toHaveProperty('regulatory_effect');
      expect(Object.keys(item).length).toBe(2);
    });

    test('creates temperature item with expected keys', () => {
      const item = createEmptyItem('temperature');
      expect(item).toHaveProperty('temperature');
      expect(item).toHaveProperty('regulatory_effect');
      expect(Object.keys(item).length).toBe(2);
    });

    test('small_molecule item has correct defaults', () => {
      const item = createEmptyItem('small_molecule');
      expect(item.name).toBe(null);
      expect(item.smiles).toBe(null);
      expect(item.regulatory_effect).toBe(null);
    });

    test('light item has correct defaults', () => {
      const item = createEmptyItem('light');
      expect(item.wavelength).toBe(null);
      expect(item.regulatory_effect).toBe(null);
    });

    test('temperature item has correct defaults', () => {
      const item = createEmptyItem('temperature');
      expect(item.temperature).toBe(null);
      expect(item.regulatory_effect).toBe(null);
    });

    test('unknown kind defaults to small_molecule', () => {
      const item = createEmptyItem('unknown');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('smiles');
      expect(item).toHaveProperty('regulatory_effect');
    });
  });

  describe('createEmptyCard factory', () => {
    test('returns object with expected keys', () => {
      const card = createEmptyCard();
      expect(card).toHaveProperty('kind');
      expect(card).toHaveProperty('item');
      expect(card).toHaveProperty('evidence');
      expect(card).toHaveProperty('_stimKey');
    });

    test('has exactly 4 keys', () => {
      const card = createEmptyCard();
      expect(Object.keys(card).length).toBe(4);
    });

    test('has correct default values', () => {
      const card = createEmptyCard();
      expect(card.kind).toBe('small_molecule');
      expect(card._stimKey).toBe('stimulus_type');
      expect(card.item).toEqual(createEmptyItem('small_molecule'));
      expect(card.evidence).toEqual(createEmptyEvidence());
    });

    test('item is a small_molecule item', () => {
      const card = createEmptyCard();
      expect(card.item).toHaveProperty('name');
      expect(card.item).toHaveProperty('smiles');
      expect(card.item).toHaveProperty('regulatory_effect');
    });
  });

  describe('stimulusToCards conversion', () => {
    test('converts empty array to empty array', () => {
      const stimulus = [];
      const cards = stimulusToCards(stimulus);
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(0);
    });

    test('handles null stimulus as empty array', () => {
      const cards = stimulusToCards(null);
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(0);
    });

    test('handles undefined stimulus as empty array', () => {
      const cards = stimulusToCards(undefined);
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(0);
    });

    test('converts entry with single small_molecule to card', () => {
      const stimulus = [
        {
          stimulusType: [
            {
              small_molecule: [{ name: 'Compound X', smiles: 'CC' }],
              light: null,
              temperature: null,
            },
          ],
          stimulus_evidence: [{ method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null }],
          _stimKey: 'stimulus_type',
        },
      ];
      const cards = stimulusToCards(stimulus);
      expect(cards.length).toBeGreaterThan(0);
      const smallMolCard = cards.find((c) => c.kind === 'small_molecule');
      expect(smallMolCard).toBeDefined();
      if (smallMolCard) {
        expect(smallMolCard.item.name).toBe('Compound X');
      }
    });

    test('converts entry with light stimulus to card', () => {
      const stimulus = [
        {
          stimulusType: [
            {
              small_molecule: null,
              light: [{ wavelength: 450, regulatory_effect: 'activates' }],
              temperature: null,
            },
          ],
          stimulus_evidence: [{ method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null }],
          _stimKey: 'stimulus_type',
        },
      ];
      const cards = stimulusToCards(stimulus);
      expect(cards.length).toBeGreaterThan(0);
      const lightCard = cards.find((c) => c.kind === 'light');
      expect(lightCard).toBeDefined();
    });
  });

  describe('cardToEntry conversion', () => {
    test('converts small_molecule card to entry', () => {
      const card = {
        kind: 'small_molecule',
        item: { name: 'Compound X', smiles: 'CC', regulatory_effect: null },
        evidence: { method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null },
        _stimKey: 'stimulus_type',
      };
      const entry = cardToEntry(card);
      expect(entry).toHaveProperty('stimulusType');
      expect(entry).toHaveProperty('stimulus_evidence');
      expect(entry._stimKey).toBe('stimulus_type');
      expect(entry.stimulusType).toHaveLength(1);
      expect(entry.stimulusType[0].small_molecule).toHaveLength(1);
      expect(entry.stimulusType[0].small_molecule[0].name).toBe('Compound X');
    });

    test('converts light card to entry with light type entry', () => {
      const card = {
        kind: 'light',
        item: { wavelength: 450, regulatory_effect: 'activates' },
        evidence: { method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null },
        _stimKey: 'stimulus_type',
      };
      const entry = cardToEntry(card);
      expect(entry.stimulusType[0].light).toHaveLength(1);
      expect(entry.stimulusType[0].light[0].wavelength).toBe(450);
    });

    test('converts temperature card to entry', () => {
      const card = {
        kind: 'temperature',
        item: { temperature: 37, regulatory_effect: 'represses' },
        evidence: { method: [], ref_figure: null, doi: null, kd: null },
        _stimKey: 'stimulus_type',
      };
      const entry = cardToEntry(card);
      expect(entry.stimulusType[0].temperature).toHaveLength(1);
      expect(entry.stimulusType[0].temperature[0].temperature).toBe(37);
    });

    test('preserves _stimKey value', () => {
      const card = {
        kind: 'small_molecule',
        item: { name: 'X', smiles: 'CC', regulatory_effect: null },
        evidence: { method: [], ref_figure: null, doi: null, kd: null },
        _stimKey: 'custom_key',
      };
      const entry = cardToEntry(card);
      expect(entry._stimKey).toBe('custom_key');
    });

    test('defaults _stimKey when not provided', () => {
      const card = {
        kind: 'small_molecule',
        item: { name: 'X', smiles: 'CC', regulatory_effect: null },
        evidence: { method: [], ref_figure: null, doi: null, kd: null },
      };
      const entry = cardToEntry(card);
      expect(entry._stimKey).toBe('stimulus_type');
    });
  });

  describe('cardsToStimulus conversion', () => {
    test('converts empty array to empty array', () => {
      const cards = [];
      const stimulus = cardsToStimulus(cards);
      expect(Array.isArray(stimulus)).toBe(true);
      expect(stimulus.length).toBe(0);
    });

    test('converts single card to single entry array', () => {
      const cards = [
        {
          kind: 'small_molecule',
          item: { name: 'X', smiles: 'CC', regulatory_effect: null },
          evidence: { method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null },
          _stimKey: 'stimulus_type',
        },
      ];
      const stimulus = cardsToStimulus(cards);
      expect(Array.isArray(stimulus)).toBe(true);
      expect(stimulus.length).toBe(1);
    });

    test('converts multiple cards to multiple entries', () => {
      const cards = [
        {
          kind: 'small_molecule',
          item: { name: 'X', smiles: 'CC', regulatory_effect: null },
          evidence: { method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null },
          _stimKey: 'stimulus_type',
        },
        {
          kind: 'light',
          item: { wavelength: 450, regulatory_effect: 'activates' },
          evidence: { method: ['EMSA'], ref_figure: '1', doi: 'doi:123', kd: null },
          _stimKey: 'stimulus_type',
        },
      ];
      const stimulus = cardsToStimulus(cards);
      expect(stimulus.length).toBe(2);
    });

    test('handles null input', () => {
      const stimulus = cardsToStimulus(null);
      expect(Array.isArray(stimulus)).toBe(true);
      expect(stimulus.length).toBe(0);
    });

    test('handles non-array input', () => {
      const stimulus = cardsToStimulus('not an array');
      expect(Array.isArray(stimulus)).toBe(true);
    });
  });

  describe('round-trip conversion (card -> entry -> card)', () => {
    test('converts card to entry and back preserves small_molecule structure', () => {
      const originalCard = {
        kind: 'small_molecule',
        item: { name: 'Compound X', smiles: 'CC', regulatory_effect: 'activates' },
        evidence: { method: ['EMSA'], ref_figure: '1A', doi: 'doi:123', kd: '100' },
        _stimKey: 'stimulus_type',
      };
      const entry = cardToEntry(originalCard);
      const cards = stimulusToCards([entry]);
      expect(cards.length).toBeGreaterThan(0);
      const roundTripCard = cards[0];
      expect(roundTripCard.kind).toBe('small_molecule');
      expect(roundTripCard.item.name).toBe('Compound X');
    });
  });
});
