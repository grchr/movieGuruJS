let signUpDiv = document.getElementById("signUpDiv");
let signInDiv = document.getElementById("signInDiv")
var finalUsername;

function signUp(){
    clearSignIn();
    signUpDiv.innerHTML = `<div class="container">
<div class="row">
<div class="col-md">
      <h1>Sign Up</h1>
      <p>Please fill in this form to create an account.</p>
      <hr>
      </div>
      </div>
      </div>
      
      <div class="container">
<div class="row">
<div class="col-md">
      <label for="email"><b>Email</b></label>
      <input class="form-control form-rounded" type="text" placeholder="Enter Email" name="email" id="email" required>
      </div>
      </div>
      </div>
      
      <div class="container">
<div class="row">
<div class="col-md">
      <label for="userName"><b>Username</b></label>
      <input class="form-control form-rounded" id="username" type="text" placeholder="Enter Username" name="username" id="username" required>
      </div>
      </div>
      </div>
      
      
      <div class="container">
<div class="row">
<div class="col-md">
      <label for="psw"><b>Password</b></label>
      <input class="form-control form-rounded" type="password" placeholder="Enter Password" name="psw" id="pswd" required>
</div>
</div>
</div>

<div class="container">
<div class="row">
<div class="col-md">
      <label for="psw-repeat"><b>Repeat Password</b></label>
      <input class="form-control form-rounded" type="password" placeholder="Repeat Password" name="psw-repeat" id="pswdRepeat" required>
      </div>
      </div>
      </div>


<div class="container">
<div class="row">
<div class="col-md">
      <div class="clearfix">
        <button type="button" onclick="clearSignUp()" class="mainRoundedButton cancel">Cancel</button>
        <button type="button" onclick="processSignUp()" class="mainRoundedButton sign">Sign Up</button>
      </div>
      </div>
      </div>
    </div>`
}

function signIn(){
    clearSignUp();
    signInDiv.innerHTML = `<div class="container">
<div class="row">
<div class="col-md">
      <h1>Sign In</h1>
      <hr>
      </div>
      </div>
    </div>
    <div class="container">
    <div class="row">
    <div class="col-md">
      <label for="username"><b>Username</b></label>
      <input class="form-control form-rounded" id="username" type="text" placeholder="Enter Username" name="username">
      </div>
      </div>
      </div>
      
      
      <div class="container">
      <div class="row">
      <div class="col-md">
      <label for="psw"><b>Password</b></label>
      <input class="form-control form-rounded" id="pswd" type="password" placeholder="Enter Password" name="psw">
      </div>
      </div>
</div>
    <div class="container">
    <div class="row">
    <div class="col-md">
      <div class="clearfix">
        <button type="button" onclick="clearSignIn()" class="mainRoundedButton cancel">Cancel</button>
        <button type="button" onclick="processSignIn()" class="mainRoundedButton sign">Sign In</button>
      </div>
      </div>
      </div>
    </div>`
}

function clearSignUp(){
    signUpDiv.innerHTML = "";
    document.getElementById('errors').innerText = "";
}

function clearSignIn(){
    signInDiv.innerHTML = "";
    document.getElementById('errors').innerText = "";
}

function processSignUp(){
    console.log("process signup");
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let pswd = document.getElementById('pswd');
    let pswdrepeat = document.getElementById('pswdRepeat');
    let errors = document.getElementById('errors');
    console.log(pswd);
    console.log(pswdrepeat);
    if (pswd.value != pswdrepeat.value) {
        errors.innerText = "* Passwords do not match";
        for (let i = 0; i<document.getElementsByTagName("input").length; i++) {
            document.getElementsByTagName("input")[i].setAttribute('class', 'form-control form-rounded input-error');
        }
        return;
    }
    console.log(email.value);
    console.log(username.value);
    console.log(pswd.value);
    console.log(pswdrepeat.value);
    var user = {
        "name": username.value,
        "email": email.value,
        "password": pswd.value
    };
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/users/signup");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(user));
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState == 4) {
            if (xhr.status == 201) {
                finalUsername = username.value;
                localStorage.setItem("storageName",finalUsername);
                location.replace("http://localhost:8080/search.html")
            } else {
                errors.innerText = xhr.responseText;
                for (let i = 0; i<document.getElementsByTagName("input").length; i++) {
                    document.getElementsByTagName("input")[i].setAttribute('class', 'form-control form-rounded input-error');
                }
            }
        }
    }
}

function processSignIn(){
    let username = document.getElementById('username');
    let pswd = document.getElementById('pswd');
    let errors = document.getElementById('errors');
    var credentials = {
        "name": username.value,
        "password": pswd.value
    };
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/users/signin");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(credentials));
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                finalUsername = username.value;
                localStorage.setItem("storageName",finalUsername);
                location.replace("http://localhost:8080/search.html")
            } else {
                errors.innerText = xhr.responseText;
                for (let i = 0; i<document.getElementsByTagName("input").length; i++) {
                    document.getElementsByTagName("input")[i].setAttribute('class', 'form-control form-rounded input-error');
                }
            }
        }
    }
}