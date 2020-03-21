function logout(){
    localStorage.clear();
    location.replace("http://localhost:8080/index.html");
}

function welcomeUser(){
    document.getElementById("navbarDropdownMenuLink").innerText = "Welcome " + localStorage.getItem("storageName") + "!";
}

function gotoAccount(){
    location.replace("http://localhost:8080/account.html");
}

function gotoSearchMenu(){
    location.replace("http://localhost:8080/search.html");
}