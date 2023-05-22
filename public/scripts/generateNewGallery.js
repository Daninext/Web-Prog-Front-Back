function createGallery(imageCount) {
  let catId = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let place = document.getElementsByClassName('l-gallery');
  for (let i = 0; i < imageCount; ++i) {
    let elem = document.createElement('p');
    elem.setAttribute('class', 'gallery-item gallery-item-is-shadowed');

    let image = document.createElement('img');
    let id = Math.floor(Math.random() * catId.length);
    image.setAttribute('src', 'cats/' + catId[id].toString() + '.jpg');
    catId.splice(id, 1);

    elem.appendChild(image);
    place.item(0).appendChild(elem);
  }
}
