function register() {
    var username = document.getElementById("inputusername").value;
    var password = document.getElementById("inputpassword").value;
    var checkPassword = document.getElementById("checkpassword").value;
    if (password != checkPassword) {
        return false;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", "localhost:3334/register", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("fname=Henry&lname=Ford");
    // var data = JSON.stringify({ "username": username, "password": password });
    // xhr.send(data);
}

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML = this.responseText;
      }
    };
    xhttp.open("POST", "localhost:3334", true);
    xhttp.send();
  }