const nodes = [
  { id: 'bad-bunny', label: 'Bad Bunny', x: 180, y: 120 },
  { id: 'taylor-swift', label: 'Taylor Swift', x: 360, y: 70 },
  { id: 'rosalia', label: 'Rosalia', x: 360, y: 180 },
  { id: 'larussel', label: 'LaRussel', x: 520, y: 250 },
  { id: 'geese', label: 'Geese', x: 620, y: 120 },
  { id: 'four-tet', label: 'Four Tet', x: 660, y: 300 }
];

const edges = [
  ['bad-bunny', 'taylor-swift'],
  ['bad-bunny', 'rosalia'],
  ['rosalia', 'taylor-swift'],
  ['rosalia', 'larussel'],
  ['geese', 'four-tet'],
  ['larussel', 'geese']
];

const graph = document.getElementById('graph');
const edgesGroup = document.getElementById('edges');
const nodesGroup = document.getElementById('nodes');
const palette = document.getElementById('palette');
const status = document.getElementById('status');

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

function makeNode(node) {
  const group = document.createElementNS(svgNS, 'g');
  group.setAttribute('class', 'node');
  group.dataset.nodeId = node.id;

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', node.x);
  circle.setAttribute('cy', node.y);
  circle.setAttribute('r', 34);

  const text = document.createElementNS(svgNS, 'text');
  text.setAttribute('x', node.x);
  text.setAttribute('y', node.y);
  text.textContent = node.label;

  group.appendChild(circle);
  group.appendChild(text);
  nodesGroup.appendChild(group);

  group.addEventListener('click', () => {
    selectedId = node.id;
    updateSelection();
    status.textContent = `Selected ${node.label}. Now choose a color.`;
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
    const circle = nodeEl.querySelector('circle');
    circle.style.fill = color;
  }
}

edges.forEach(makeEdge);
nodes.forEach(makeNode);

palette.querySelectorAll('.swatch').forEach((button) => {
  const color = button.dataset.color;
  button.style.background = color;

  button.addEventListener('click', () => {
    applyColor(color);
  });
});

const resetButton = document.createElement('button');
resetButton.className = 'reset';
resetButton.textContent = 'Reset colors';
resetButton.addEventListener('click', () => {
  nodeColors.clear();
  document.querySelectorAll('.node circle').forEach((circle) => {
    circle.style.fill = '';
  });
  selectedId = null;
  updateSelection();
  status.textContent = 'Select a node to begin.';
});

status.parentElement.appendChild(resetButton);
