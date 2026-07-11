/**
 * Adapters between the stored (nested) stimulus shape and the flat "one card per
 * stimulus" shape the edit form presents.
 *
 * Normalized stored entry (after EditSensorV2.normalizeStimulusKeys renames
 * `stimulus_type` -> `stimulusType` and records `_stimKey`):
 *
 *   {
 *     _stimKey: 'stimulus_type',
 *     stimulusType: [ { small_molecule: [...]|null, light: [...]|null, temperature: [...]|null } ],
 *     stimulus_evidence: [ { method, ref_figure, doi, kd } ],
 *   }
 *
 * Every stored entry is exactly 1 type-entry / 1 sub-item / 1 evidence (verified
 * across all sensors), so a card is just { kind, item, evidence }. flatten still
 * expands any multi-item / multi-evidence entry defensively so nothing is dropped
 * if such a record ever appears; unflatten always emits the canonical
 * 1-type-entry / 1-evidence entry the backend stores.
 */

export const STIMULUS_KINDS = ['small_molecule', 'light', 'temperature'];

export const STIMULUS_KIND_LABELS = {
  small_molecule: 'Small molecule',
  light: 'Light',
  temperature: 'Temperature',
};

export function createEmptyEvidence() {
  return { method: [], ref_figure: null, doi: null, kd: null };
}

export function createEmptyItem(kind) {
  if (kind === 'light') return { wavelength: null, regulatory_effect: null };
  if (kind === 'temperature') return { temperature: null, regulatory_effect: null };
  return { name: null, smiles: null, regulatory_effect: null };
}

export function createEmptyCard() {
  return {
    kind: 'small_molecule',
    item: createEmptyItem('small_molecule'),
    evidence: createEmptyEvidence(),
    _stimKey: 'stimulus_type',
  };
}

// One stored stimulus entry -> one or more flat cards.
function entryToCards(entry) {
  const typeEntries = Array.isArray(entry?.stimulusType) ? entry.stimulusType : [];
  const evidence = Array.isArray(entry?.stimulus_evidence) ? entry.stimulus_evidence : [];
  const stimKey = entry?._stimKey ?? 'stimulus_type';

  // Collect every sub-item across all type entries, tagged with its kind.
  const items = [];
  typeEntries.forEach((te) => {
    STIMULUS_KINDS.forEach((kind) => {
      (te?.[kind] ?? []).forEach((item) => items.push({ kind, item }));
    });
  });

  // Pair items with evidence by position; never drop either side.
  const count = Math.max(items.length, evidence.length, 1);
  const cards = [];
  for (let i = 0; i < count; i += 1) {
    const sub = items[i];
    cards.push({
      kind: sub ? sub.kind : 'small_molecule',
      item: sub ? sub.item : createEmptyItem('small_molecule'),
      evidence: i < evidence.length ? evidence[i] : createEmptyEvidence(),
      _stimKey: stimKey,
    });
  }
  return cards;
}

export function stimulusToCards(stimulus) {
  return (Array.isArray(stimulus) ? stimulus : []).flatMap(entryToCards);
}

// One flat card -> one stored stimulus entry (1 type-entry, 1 evidence).
export function cardToEntry(card) {
  const typeEntry = { small_molecule: null, light: null, temperature: null };
  typeEntry[card.kind] = [card.item];
  return {
    _stimKey: card._stimKey ?? 'stimulus_type',
    stimulusType: [typeEntry],
    stimulus_evidence: [card.evidence],
  };
}

export function cardsToStimulus(cards) {
  return (Array.isArray(cards) ? cards : []).map(cardToEntry);
}
