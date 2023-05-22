document.addEventListener('DOMContentLoaded', (event) => checkTime());
window.addEventListener('load', (event) => showTime());
const entries = performance.getEntriesByType('navigation');

let startTime = 0;
function checkTime() {
  startTime = Date.now();
}

function showTime() {
  let elem = document.getElementById('load-info');

  let domTime = 0;
  entries.forEach((entry) => {
    domTime = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
  });
  let time = ((Date.now() - startTime + domTime) / 1000).toFixed(3);
  elem.textContent += ' + ' + (time * 1000).toString() + ' ms (client)';
}
