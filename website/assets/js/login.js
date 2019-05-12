function register() {
    var username = document.getElementById("inputusername").value;
    var password = document.getElementById("inputpassword").value;
    var checkPassword = document.getElementById("checkpassword").value;
    if (password != checkPassword) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3333/register";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            window.location.replace("./login.html");
        }
    };
    var data = JSON.stringify({ "username": username, "password": password });
    xhr.send(data);

}

// function httpGet(theUrl)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
//     xmlHttp.send( null );
//     return xmlHttp.responseText;
// }