window.addEventListener('load', (event) => loadChat());

const socket = io('http://localhost:200');
socket.on('connect', function () {
  console.log('Connected');

  socket.on('message-client', (data) => {
    let display = document.getElementById('display');

    let m = document.createElement('p');
    m.innerText = data.message;
    display.appendChild(m);
  });
});

function loadChat() {
  document.getElementById('cur-code').innerText =
    'Current code: ' + document.cookie.match(/code=(.+?)(;|$)/)[1];

  socket.emit('join', document.cookie.match(/code=(.+?)(;|$)/)[1]);
  fetch('/group/messages').then((response) => {
    if (response.ok) {
      response.json().then(async (json) => {
        let temp = await JSON.parse(stringify(json).replaceAll('\n', ''));
        let display = document.getElementById('display');
        for (let i = 0; i < temp.messages.transfer.length; ++i) {
          let m = document.createElement('p');
          m.innerText = temp.messages.transfer[i].content;
          display.appendChild(m);
        }
      });
    }
  });
}

function join() {
  let code = document.getElementById('code-input').value;
  document.cookie = 'code=;max-age=-1';
  document.cookie = 'code=' + code + ';path=/';

  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    code: code,
  });

  xhr.open('POST', '/group/create', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);

  document.getElementById('cur-code').innerText = 'Current code: ' + code;

  socket.emit('join', code);
  loadChat();
}

function submitMessage() {
  socket.emit('message', {
    message: document.getElementById('message-input').value,
    code: document.cookie.match(/code=(.+?)(;|$)/)[1],
  });

  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    content: document.getElementById('message-input').value,
    code: document.cookie.match(/code=(.+?)(;|$)/)[1],
  });

  xhr.open('POST', '/group/message', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}

function stringify(value) {
  switch (typeof value) {
    case 'string':
    case 'object':
      return JSON.stringify(value);
    default:
      return String(value);
  }
}

function create() {
  fetch('/group/code').then((response) => {
    response.json().then(async (json) => {
      let temp = await JSON.parse(stringify(json).replaceAll('\n', ''));
      document.getElementById('code-input').value = temp.code;
    });
  });
}
