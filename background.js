let username;
let password;

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.openOptionsPage();
  console.log("AutoLogin Started");
  chrome.action.setIcon({ path: "icon64.png" });
  get_options();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "update_credentials") {
    get_options();
  }
});

function get_options() {
  chrome.storage.sync.get(["username", "password"], (items) => {
    if (items.username) {
      username = items.username;
      password = items.password;
      start();
    } else {
      console.log("AutoLogin credentials not saved");
    }
  });
}

function start() {
  fetch("https://agnigarh.iitg.ac.in:1442/logout?030403030f050d06")
    .then(() => {
      return fetch("https://agnigarh.iitg.ac.in:1442/login?");
    })
    .then((res) => res.text())
    .then(login)
    .catch((err) => {
      console.error(err);
      setTimeout(start, 2000);
    });
}

function login(result) {
  const magic = result.match(/name="magic" value="([^"]+)"/)?.[1];
  const Tredir = result.match(/name="4Tredir" value="([^"]+)"/)?.[1];

  if (!magic || !Tredir) {
    console.log("Login page parse error");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("4Tredir", Tredir);
  formData.append("magic", magic);
  formData.append("username", username);
  formData.append("password", password);

  fetch("https://agnigarh.iitg.ac.in:1442", {
    method: "POST",
    body: formData
  })
    .then((res) => res.text())
    .then(keepalive)
    .catch((err) => {
      console.error(err);
      setTimeout(start, 2000);
    });
}

function keepalive(result) {
  console.log(result);

  if (result.includes("logged in as")) {
    chrome.action.setIcon({ path: "icon64.png" });
  }

  if (result.includes("Firewall authentication failed")) {
    chrome.notifications.create({
      type: "basic",
      title: "Incorrect Credentials!",
      iconUrl: "icon.png",
      message: "Credentials entered for AutoLogin are incorrect. Please change credentials and try again."
    });
    return;
  }

  if (result.includes("concurrent authentication")) {
    chrome.notifications.create({
      type: "basic",
      title: "Concurrent limit reached!",
      iconUrl: "icon.png",
      message: "Maybe you are logged in somewhere else too."
    });
    return;
  }

  const urlMatch = result.match(/location.href="([^"]+)"/);
  const url = urlMatch ? urlMatch[1] : null;

  if (url) {
    fetch(url)
      .then(() => {
        console.log("AutoLogin Refreshed");
        chrome.action.setIcon({ path: "icon64.png" });
        iconWatch(url);
      })
      .catch((err) => {
        console.error(err);
        chrome.action.setIcon({ path: "icon64.png" });
      });
  }
}

function iconWatch(url) {
  setInterval(() => {
    fetch(url)
      .then(() => {
        chrome.action.setIcon({ path: "icon64.png" });
      })
      .catch(() => {
        chrome.action.setIcon({ path: "icon64.png" });
      });
  }, 2000);
}
