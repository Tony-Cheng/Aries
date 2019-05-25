const register_button = document.getElementById('register');

register_button.addEventListener('click', register());

async function register() {
    var username = document.getElementById("inputusername").value;
    var password = document.getElementById("inputpassword").value;
    var checkPassword = document.getElementById("checkpassword").value;
    if (password != checkPassword) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "http://server_aries_test.tcheng.ca:2222/register");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.13.0");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "e831e6ce-dd46-412f-b727-0aed167caf06,0c85d33b-e8f2-4a3e-9e09-31a4a2698531");
    xhr.setRequestHeader("Host", "localhost:3333");
    xhr.setRequestHeader("accept-encoding", "gzip, deflate");
    xhr.setRequestHeader("content-length", "53");
    xhr.setRequestHeader("Connection", "keep-alive");
    xhr.setRequestHeader("cache-control", "no-cache");
    var data = JSON.stringify({ "username": username, "password": password });
    xhr.send( data );
}