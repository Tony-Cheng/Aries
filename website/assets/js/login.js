function register() {
  var username = document.getElementById("inputusername").value;
  var password = document.getElementById("inputpassword").value;
  var checkPassword = document.getElementById("checkpassword").value;
  if (password != checkPassword) {
    $('#errorMessage').text("Password doesn't match!");
    $('#errorDisplay').removeClass('d-none');
  }
  $.ajax({
    url: '/aries/server/register',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({ "username": username, "password": password }),
    processData: false,
    success: function (data, textStatus, jQxhr) {
      if (data.status == "Success") {
        window.location.href = 'login';
      }
      else {
        $('#errorMessage').text(data.status);
        $('#errorDisplay').removeClass('d-none');
      }
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log('failed');
    }
  });
}

function login() {
  var username = document.getElementById("inputusername").value;
  var password = document.getElementById("inputpassword").value;
  $.ajax({
    url: '/aries/server/login',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({ "username": username, "password": password }),
    processData: false,
    success: function (data, textStatus, jQxhr) {
      if (data.status == "Success") {
        window.location.href = 'index';
      }
      else {
        $('#errorMessage').text(data.status);
        $('#errorDisplay').removeClass('d-none');
      }
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log('failed');
    }
  });
}

function closeErrorMessage() {
  $('#errorDisplay').addClass('d-none');
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