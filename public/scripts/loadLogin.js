window.addEventListener('load', (event) => start());

function greetingBuild(name) {
  if (name) {
    document.getElementsByClassName('greeting')[0].innerText = 'Hello, ' + name;
    document
      .getElementById('profile-button')
      .setAttribute('style', 'display: inline-block');
    document
      .getElementById('logout-button')
      .setAttribute('style', 'display: inline-block');
  } else {
    document.getElementsByClassName('greeting')[0].innerText =
      'Is this your first time here?';
    document
      .getElementById('login-button')
      .setAttribute('style', 'display: inline-block');
    document
      .getElementById('signup-button')
      .setAttribute('style', 'display: inline-block');
  }
}

function profile() {
  window.location.href = '/user/profile';
}

function logout() {
  document.cookie = 'code=';
  window.location.href = '/auth/logout';
}

function login() {
  window.location.href = '/auth';
}

function changeUsername() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    username: document.getElementById('new-username-input').value,
  });

  xhr.open('POST', '/user/update', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);

  compare();
  window.location.reload();

  return false;
}

function start() {
  if (!document.location.pathname.includes('/auth')) {
    if (!document.cookie.match(/sFrontToken=(.+?)(;|$)/)) {
      greetingBuild(undefined);
      return;
    }

    let frontTokenFromRequestHeader = document.cookie.match(
      /sFrontToken=(.+?)(;|$)/,
    )[1];

    let frontTokenDecoded = JSON.parse(
      decodeURIComponent(escape(atob(frontTokenFromRequestHeader))),
    );
    greetingBuild(frontTokenDecoded.up.username);
  }
}

supertokens.init({
  appInfo: {
    apiDomain: 'https://daninext-web.onrender.com',
    apiBasePath: '/auth',
    appName: 'new-web',
  },
  recipeList: [supertokensSession.init(), supertokensEmailPassword.init()],
});

async function signUpClicked() {
  let email = document.getElementById('sign-up-email-input').value;
  let password = document.getElementById('sign-up-password-input').value;
  try {
    let response = await supertokensEmailPassword.signUp({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    });
    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          window.alert(formField.error);
        } else if (formField.id === 'password') {
          window.alert(formField.error);
        }
      });
    } else {
      create();
      compare();
      window.location.href = '/cats/page/1';
    }
  } catch (err) {
    if (err.isSuperTokensGeneralError === true) {
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}

async function signInClicked() {
  let email = document.getElementById('sign-in-email-input').value;
  let password = document.getElementById('sign-in-password-input').value;
  try {
    let response = await supertokensEmailPassword.signIn({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    });

    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          window.alert(formField.error);
        }
      });
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      window.alert('Email password combination is incorrect.');
    } else {
      compare();
      window.location.href = '/cats/page/1';
    }
  } catch (err) {
    if (err.isSuperTokensGeneralError === true) {
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}

function create() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    username: document.getElementById('sing-up-username-input').value,
  });

  xhr.open('POST', '/user/create', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}

function compare() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({});

  xhr.open('POST', '/auth/compare', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}
