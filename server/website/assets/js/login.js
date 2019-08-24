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
        window.location.href = 'index';
      }
      else {
        $('#errorMessage').text(data.status);
        $('#errorDisplay').removeClass('d-none');
      }
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
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
        Cookies.set('user_id', data.user_id);
        Cookies.set('username', data.username);
        window.location.href = 'messenger';
      }
      else {
        $('#errorMessage').text(data.status);
        $('#errorDisplay').removeClass('d-none');
      }
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
}

function closeErrorMessage() {
  $('#errorDisplay').addClass('d-none');
}