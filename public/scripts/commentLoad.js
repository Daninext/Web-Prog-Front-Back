window.addEventListener('load', (event) => getComment(1));

function getComment(page) {
  let id = document.getElementById('id-place').innerText;
  fetch('/comment/catId/' + id + '/page/' + page).then((response) =>
    processing(response),
  );
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

function processing(request) {
  if (request.ok) {
    let preloader = document.getElementsByClassName('l-preloader')[0];
    if (preloader)
      document.getElementsByClassName('l-content')[0].removeChild(preloader);

    let comment = document.getElementsByClassName('l-comment')[0];
    let chCount = comment.childElementCount;
    for (let i = 0; i < chCount; ++i) {
      comment.removeChild(comment.children[0]);
    }
    let head = document.createElement('p');
    head.innerText = 'Комментарии';
    comment.appendChild(head);

    request.json().then(async (json) => {
      let temp = await JSON.parse(stringify(json).replaceAll('\n', ''));
      for (let i = 0; i < temp.ans.length; ++i) {
        let body = document.createElement('p');
        body.innerText =
          'Автор: ' +
          temp.ans[i].author +
          '\nКомментарий: ' +
          temp.ans[i].content;

        comment.appendChild(body);
        comment.appendChild(document.createElement('p'));
      }

      let buttonsCount = Math.ceil(temp.count / 5);
      for (let i = 1; i < buttonsCount + 1; ++i) {
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('onclick', 'getComment(' + i + ')');
        button.innerText = i.toString();
        comment.appendChild(button);
      }
    });
  } else {
    let gif = document.getElementById('load-gif');
    gif.setAttribute('src', '../../gifs/wrong.gif');
    gif.setAttribute('style', 'height: 240px; width: 245px');

    let content = document.getElementsByClassName('l-content')[0];
    let head = document.createElement('p');
    head.innerText = 'Что-то пошло не так...';
    head.setAttribute('style', 'visibility: visible');
    head.setAttribute('class', 'fail-comment');
    content.appendChild(head);
  }
}
