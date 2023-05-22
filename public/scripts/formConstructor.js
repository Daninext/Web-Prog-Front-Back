window.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('add-cat-form')
    .addEventListener('submit', function (e) {
      upload();
    });
  document
    .getElementById('add-breed-form')
    .addEventListener('submit', function (e) {
      addBreed();
    });
  document
    .getElementById('remove-cat-form')
    .addEventListener('submit', function (e) {
      removeCat();
    });
  document
    .getElementById('add-cat-form')
    .addEventListener('reset', function (e) {
      e.preventDefault();
      clearForm();
    });
  document
    .getElementById('photo-input')
    .addEventListener('change', function () {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        uploadedImage = reader.result;
        document.querySelector(
          '#display-photo',
        ).style.backgroundImage = `url(${uploadedImage})`;
      });

      reader.readAsDataURL(this.files[0]);
    });
});

let uploadedImage = '';

function upload() {
  if (uploadedImage === '') return;

  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    data: uploadedImage,
    name: document.getElementById('name-input').value,
    breed: document.getElementById('breed-select').value,
  });

  xhr.open('POST', '/cats/create', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}

function clearForm() {
  document.getElementById('name-input').value = null;
  document.getElementById('breed-input').value = null;
  document.getElementById('photo-input').value = null;
}

function removeCat() {
  let _id = document.getElementById('id-input').value;
  if (!_id) return;

  let xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/cats/delete/${_id}`, false);
  xhr.send();
}

function addBreed() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    name: document.getElementById('breed-input').value,
  });

  xhr.open('POST', '/breed/create', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}
