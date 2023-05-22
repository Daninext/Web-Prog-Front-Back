window.addEventListener('load', event => colorButton())

function colorButton() {
    let file = document.location.pathname;
    let navigation = document.getElementsByClassName("nav-item");
    for(let i = 0; i < navigation.length; ++i) {
        if (file === navigation.item(i).attributes.getNamedItem("href").value) {
            navigation.item(i).setAttribute("style", "color: azure");
        }
    }
}