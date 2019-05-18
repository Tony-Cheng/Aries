function register() {
    var username = document.getElementById("inputusername").value;
    var password = document.getElementById("inputpassword").value;
    var checkPassword = document.getElementById("checkpassword").value;
    // if (password != checkPassword) {
    //     return false;
    // }
    var xmlHttp = new XMLHttpRequest();
    var url = "http://localhost:3333/register/";
    xmlHttp.open("POST", url, true); // false for synchronous request
    // xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    var data = JSON.stringify({ "username": username, "password": password });
    // xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xmlHttp.send(JSON.stringify({ "email": "hello@user.com", "response": { "name": "Tester" } }));
    xmlHttp.send( null );
}