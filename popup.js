chrome.storage.sync.get([
  "username",
  "password"
], function(items) {
  if(items.username) {
    $("#msg").hide();
    $('#logout').on('click', function() {
      $.ajax({
        url: "https://agnigarh.iitg.ac.in:1442/logout?030403030f050d06",
        type: "GET",
        success: function() {
        },
        error: function(error) {
          console.log(error);
        }
      });
    });   
  $('#login').on('click', function() {
    chrome.runtime.sendMessage({ type: "update_credentials" });
  });
  }
  else {
    $("#login").hide();
    $("#logout").hide();
  }
});

$('#changecred').on('click', function() {
  chrome.runtime.openOptionsPage();
}); 
