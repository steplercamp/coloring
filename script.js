const nodes = [
  { id: 'bad-bunny', label: 'Bad Bunny', x: 400, y: 70 },
  { id: 'taylor-swift', label: 'Taylor Swift', x: 560, y: 130 },
  { id: 'rosalia', label: 'Rosalia', x: 560, y: 270 },
  { id: 'larussel', label: 'LaRussel', x: 400, y: 350 },
  { id: 'geese', label: 'Geese', x: 240, y: 270 },
  { id: 'four-tet', label: 'Four Tet', x: 240, y: 130 }
];

const edges = [
  ['bad-bunny', 'taylor-swift'],
  ['bad-bunny', 'rosalia'],
  ['rosalia', 'taylor-swift'],
  ['rosalia', 'larussel'],
  ['geese', 'four-tet'],
  ['larussel', 'geese']
];

const svg = document.getElementById('graph');
const edgesGroup = document.getElementById('edges');
const nodesGroup = document.getElementById('nodes');
const status = document.getElementById('status');
const picker = document.getElementById('picker');
const stage = document.getElementById('stage');
const resetButton = document.getElementById('reset');

const nodeColors = new Map();
let selectedId = null;

const svgNS = 'http://www.w3.org/2000/svg';

function makeEdge([fromId, toId]) {
  const from = nodes.find((node) => node.id === fromId);
  const to = nodes.find((node) => node.id === toId);

  const line = document.createElementNS(svgNS, 'line');
  line.setAttribute('x1', from.x);
  line.setAttribute('y1', from.y);
  line.setAttribute('x2', to.x);
  line.setAttribute('y2', to.y);
  line.setAttribute('class', 'edge');
  edgesGroup.appendChild(line);
}

function hexagonPoints(cx, cy, radius) {
  const points = [];
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

function makeNode(node) {
  const group = document.createElementNS(svgNS, 'g');
  group.setAttribute('class', 'node');
  group.dataset.nodeId = node.id;

  const hex = document.createElementNS(svgNS, 'polygon');
  hex.setAttribute('points', hexagonPoints(node.x, node.y, 54));

  const text = document.createElementNS(svgNS, 'text');
  text.setAttribute('x', node.x);
  text.setAttribute('y', node.y);
  text.textContent = node.label;

  group.appendChild(hex);
  group.appendChild(text);
  nodesGroup.appendChild(group);

  group.addEventListener('click', (event) => {
    event.stopPropagation();
    selectedId = node.id;
    updateSelection();
    status.textContent = `Selected ${node.label}. Choose a color.`;
    showPickerAt(node.x, node.y);
  });
}

function updateSelection() {
  document.querySelectorAll('.node').forEach((nodeEl) => {
    nodeEl.classList.toggle('selected', nodeEl.dataset.nodeId === selectedId);
  });
}

function applyColor(color) {
  if (!selectedId) {
    status.textContent = 'Select a node first.';
    return;
  }

  nodeColors.set(selectedId, color);

  const nodeEl = document.querySelector(`.node[data-node-id="${selectedId}"]`);
  if (nodeEl) {
    const hex = nodeEl.querySelector('polygon');
    hex.style.fill = color;
  }
}

function showPickerAt(svgX, svgY) {
  const point = svg.createSVGPoint();
  point.x = svgX;
  point.y = svgY;
  const screenPoint = point.matrixTransform(svg.getScreenCTM());
  const stageRect = stage.getBoundingClientRect();

  picker.style.left = `${screenPoint.x - stageRect.left}px`;
  picker.style.top = `${screenPoint.y - stageRect.top}px`;
  picker.classList.add('show');
  picker.setAttribute('aria-hidden', 'false');
}

function hidePicker() {
  picker.classList.remove('show');
  picker.setAttribute('aria-hidden', 'true');
}

edges.forEach(makeEdge);
nodes.forEach(makeNode);

picker.querySelectorAll('.swatch').forEach((button) => {
  const color = button.dataset.color;
  button.style.background = color;

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    applyColor(color);
  });
});

resetButton.addEventListener('click', () => {
  nodeColors.clear();
  document.querySelectorAll('.node polygon').forEach((hex) => {
    hex.style.fill = '';
  });
  selectedId = null;
  updateSelection();
  hidePicker();
  status.textContent = 'Select a node to begin.';
});

stage.addEventListener('click', () => {
  selectedId = null;
  updateSelection();
  hidePicker();
  status.textContent = 'Select a node to begin.';
});

window.addEventListener('resize', () => {
  if (!selectedId) return;
  const node = nodes.find((item) => item.id === selectedId);
  if (node) {
    showPickerAt(node.x, node.y);
  }
});
