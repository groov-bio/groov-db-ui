const subject_color = '#0be300';
const regulator_color = '#1b96fa';
const transporter_color = '#fff700';
const enzyme_color = '#fc4e4e';
const other_color = '#545454';

// Javascript doesn't have a built-in range function
function range(start, end) {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
}

// assign colors to specific gene classes
function type2color(geneName) {
  const regulator = new RegExp('regulator|repressor|activator');
  const transporter = new RegExp('port|pump|channel');
  const enzyme = new RegExp('ase|P450');

  if (regulator.test(geneName)) {
    return regulator_color;
  } else if (transporter.test(geneName)) {
    return transporter_color;
  } else if (enzyme.test(geneName)) {
    return enzyme_color;
  } else {
    return other_color;
  }
}

function calcLength(start, stop, operonLength) {
  var size = Math.abs(start - stop);
  var geneLength = ((size / operonLength) * 100).toFixed(0);
  return geneLength;
}

function calcSpacer(data, index, operonLength) {
  const geneEnd = Math.max(data[index]['start'], data[index]['stop']);
  let nextGeneStart;
  try {
    nextGeneStart = Math.min(data[index + 1]['start'], data[index + 1]['stop']);
  } catch (err) {
    nextGeneStart = geneEnd;
  }
  let spacer = nextGeneStart - geneEnd;
  if (spacer < 0) {
    spacer = 0;
  }
  const spacerSize = ((spacer / operonLength) * 100).toFixed(0);

  return spacerSize;
}

export function generateGraphic(operon_data, reg_index) {
  var operonStart = Math.min(operon_data[0]['start'], operon_data[0]['stop']);
  var operonEnd = Math.max(
    operon_data.at(-1)['start'],
    operon_data.at(-1)['stop']
  );
  var operonLength = operonEnd - operonStart;

  if (operonLength >= 6000) {
    var displayLength = operonLength * 1.05;
  } else {
    var displayLength = 6500;
  }

  var graphic = [];
  for (var i in range(0, operon_data.length - 1)) {
    graphic.push({});
  }

  for (var i in range(0, operon_data.length - 1)) {
    var geneLength = calcLength(
      operon_data[i]['start'],
      operon_data[i]['stop'],
      displayLength
    );
    graphic[i]['length'] = geneLength.toString() + '%';
    try {
      graphic[i]['description'] = operon_data[i]['description'];
    } catch (e) {
      graphic[i]['description'] = 'hypothetical protein';
    }

    const geneType = type2color(graphic[i]['description']);

    if (i == reg_index) {
      graphic[i]['color'] = subject_color;
    } else {
      graphic[i]['color'] = geneType;
    }

    graphic[i]['direction'] = operon_data[i]['direction'];

    var spacer = calcSpacer(operon_data, parseInt(i), displayLength);
    graphic[i]['spacer'] = spacer.toString() + '%';

    graphic[i]['link'] = operon_data[i]['link'];
  }

  return graphic;
}
