function upload() {
  let xhr = new XMLHttpRequest();

  let frontTokenFromRequestHeader = document.cookie.match(
    /sFrontToken=(.+?)(;|$)/,
  )[1];
  let frontTokenDecoded = JSON.parse(
    decodeURIComponent(escape(atob(frontTokenFromRequestHeader))),
  );

  let json = JSON.stringify({
    content: document.getElementById('comment-input').value,
    author: frontTokenDecoded.up.username,
    catId: Number(document.getElementById('id-place').innerText),
  });

  xhr.open('POST', '/comment/create', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}
