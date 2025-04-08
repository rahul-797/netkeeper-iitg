// Load saved credentials and update UI
function get_options() {
  chrome.storage.sync.get(["username", "password"], (items) => {
    const status = document.getElementById("status");
    const saveBtn = document.getElementById("save");

    if (items.username) {
      status.textContent = "Credentials saved.";
      saveBtn.textContent = "Update";

      // Optional: Pre-fill saved credentials (uncomment if you want this)
      // document.getElementById("un").value = items.username;
      // document.getElementById("pd").value = items.password;
    } else {
      status.textContent = "Credentials not saved.";
      saveBtn.textContent = "Save";
    }
  });
}

// Save credentials to storage
function save_options() {
  const username = document.getElementById("un").value.trim();
  const password = document.getElementById("pd").value;

  if (!username || !password) {
    const status = document.getElementById("status");
    status.textContent = "Please enter both username and password.";
    return;
  }

  chrome.storage.sync.set({ username, password }, () => {
    get_options(); // Refresh status
  });
}

// Initialize event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  get_options();

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    save_options();

    // Clear fields after saving (optional)
    document.getElementById("un").value = "";
    document.getElementById("pd").value = "";

    // Notify background script to restart login with updated creds
    chrome.runtime.sendMessage({ type: "update_credentials" });
  });
});
