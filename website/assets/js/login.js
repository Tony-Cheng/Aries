function register() {
  var username = document.getElementById("inputusername").value;
  var password = document.getElementById("inputpassword").value;
  var checkPassword = document.getElementById("checkpassword").value;
  if (password != checkPassword) {
    return false;
  }
  else if (password == "" || username == "") {
    return false;
  }
  $.ajax({
    url: '/aries/server/register',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({ "username": username, "password": password }),
    processData: false,
    success: function (data, textStatus, jQxhr) {
      console.log('success')
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log('failed');
    }
  });
}

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "localhost:3334", true);
  xhttp.send();
}