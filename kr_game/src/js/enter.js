function enterName() {
    localStorage["username"] = document.getElementById("username").value;
    document.getElementById("button").disabled = localStorage["username"] === "";
}

function read(){
    if (document.getElementById("username") !== null) {
        document.getElementById("username").value = localStorage["username"];
        document.getElementById("button").disabled = localStorage["username"] === "";
    }
}