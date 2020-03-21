let typingTimer;                //timer identifier
let doneTypingInterval = 2000;  //time in ms (2 seconds)
var myInput = document.getElementById('inputText');
var mySuggestions = document.getElementById('suggestionSearch');
var moreInfoMovie = document.getElementById('moreInfoMovie');
let url = 'http://www.omdbapi.com/?apikey=f8306841&plot=short&s=%query';
let urlMore = 'http://www.omdbapi.com/?apikey=f8306841&plot=full&t=%query';
let xmlHttp = new XMLHttpRequest();
let results = null;
let event = new Event('suggestionsReady');
let moreInfoEvent = new Event('moreInfoReady');
let suggestionList;
let user;
let bookmarks;

window.addEventListener('load', (event) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/users/" + localStorage.getItem("storageName"));
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            user = JSON.parse(xhr.responseText);
            console.log(user);
            getBookmarksForUser();
        }
    }
});

function getBookmarksForUser() {
    console.log("getBookmarksForUser");
    let bookmarkRequest = new XMLHttpRequest();
    bookmarkRequest.open("GET", "http://localhost:8080/api/bookmarks/" + user.id);
    bookmarkRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    bookmarkRequest.send();
    bookmarkRequest.onreadystatechange = (e) => {
        if (bookmarkRequest.readyState == 4 && bookmarkRequest.status == 200) {
            bookmarks = JSON.parse(bookmarkRequest.responseText);
            console.log(bookmarks);
        }
    }
}

//on keyup, start the countdown
myInput.addEventListener('keydown', function () {
    clearTimeout(typingTimer);
    if (myInput.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

myInput.addEventListener('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

myInput.addEventListener('focus', function(){
    console.log("input focused");
    resetUrls();
    myInput.value = "";
});

mySuggestions.addEventListener('suggestionsReady', function () {
    suggestionList = document.createElement("div");
    suggestionList.setAttribute("id", "autocomplete-list");
    suggestionList.setAttribute("class", "autocomplete-items");
    document.body.appendChild(suggestionList);
    for (let i = 0; i<results.length; i++) {
        suggestionFactory(results[i], i);
    }
    resetUrls();
});


//When done typing search for movies
function doneTyping() {
    document.activeElement.blur();
    url = url.replace('%query', myInput.value);
    console.log(myInput.value);
    console.log(url);
	closeSuggestionList();
    closeMoreInfo();
    getMovies(url);
}

//Gets movies and dispatches custom even when ready
function getMovies(url) {
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = (e) => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let jsonObject = JSON.parse(xmlHttp.responseText);
            console.log('Should bring some results...');
            console.log(jsonObject);
            console.log('Raw Results...');
            console.log(xmlHttp.responseText);
            results = jsonObject.Search;
            console.log('Try to get results only');
            console.log(results[0]);

            mySuggestions.dispatchEvent(event);
        }
    }
}

function resetUrls() {
    url = 'http://www.omdbapi.com/?apikey=f8306841&plot=short&s=%query';
    urlMore = 'http://www.omdbapi.com/?apikey=f8306841&plot=full&t=%query';
}

let suggestionBox;
function suggestionFactory(arg, i) {
    let bookmarkButtonClass;
    if (movieContainedInBookmarks(arg.imdbID) === null) {
        bookmarkButtonClass = "bookmarkButton";
    } else {
        bookmarkButtonClass = "storedBookmarkButton";
    }
    let suggestion = `<table id="suggestionTable">
    <tr>
        <td class="test" rowspan=4><img class="poster" src="${arg.Poster}"/></td>
    </tr>
    <tr>
        <td><strong>Title: </strong>${arg.Title}</td>
    </tr>
    <tr>
        <td><strong>Released: </strong>${arg.Year}</td>
        <td><button id="${arg.imdbID}" class=${bookmarkButtonClass} onclick="bookmarkThis('${arg.imdbID}', '${arg.Title}')">&#10084;</button></td>
    </tr> 
    <tr>
        <td><button class="showMoreButton" onclick="showMoreSelected('${arg.Title}')" id="more${i}">Show More >></button></td>
    </tr>                 
    </table>`;
    console.log("Suggestion Factory");
    console.log(arg.Title);
    suggestionBox = document.createElement("div");
    suggestionBox.setAttribute("id", "suggestionDivId" + i);
    suggestionBox.setAttribute("class", "suggestionDiv");
    suggestionBox.innerHTML = suggestion;
    suggestionList.appendChild(suggestionBox);
}

function movieContainedInBookmarks(imdbId){
    let bookmarkExists = false;
    let existingBookmak = null;
    bookmarks.forEach(function (storedBookmark) {
            if (storedBookmark.imdbId === imdbId) {
                bookmarkExists = true;
                existingBookmak = storedBookmark;
            }
        }
    );
    return existingBookmak;
}

function bookmarkThis(imdbId, title) {
    let bookmark = {
      "imdbId": imdbId,
      "title": title,
      "user": user
    };
    let bookmarkExists = false;
    let existingBookmak;
    bookmarks.forEach(function (storedBookmark) {
            if (storedBookmark.imdbId === bookmark.imdbId) {
                bookmarkExists = true;
                existingBookmak = storedBookmark;
            }
        }
    );
    if (bookmarkExists) { //delete it
        let deleteCall = new XMLHttpRequest();
        deleteCall.open("DELETE", "http://localhost:8080/api/bookmark/" + existingBookmak.id);
        deleteCall.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        deleteCall.send(JSON.stringify(bookmark));
        deleteCall.onreadystatechange = (e) => {
            if (deleteCall.readyState == 4) {
                if (deleteCall.status == 200) {
                    document.getElementById(imdbId).className = "bookmarkButton";
                    getBookmarksForUser();
                }
            }
        };
    } else { //create it
        let save = new XMLHttpRequest();
        save.open("POST", "http://localhost:8080/api/bookmark" );
        save.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        save.send(JSON.stringify(bookmark));
        save.onreadystatechange = (e) => {
            if (save.readyState == 4) {
                if (save.status == 201) {
                    console.log(save.responseText);
                    document.getElementById(imdbId).className = "storedBookmarkButton";
                    getBookmarksForUser();
                }
            }
        }
    }
}

let selectedMovie;
function showMoreSelected(arg){
    closeSuggestionList();
    urlMore = urlMore.replace('%query', arg);
    console.log("----->" + urlMore);
    xmlHttp.open("GET", urlMore, true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = (e) => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            console.log(xmlHttp.responseText);
            selectedMovie = JSON.parse(xmlHttp.responseText);
            console.log(selectedMovie);
            moreInfoMovie.dispatchEvent(moreInfoEvent);
        }
    }
}

moreInfoMovie.addEventListener('moreInfoReady', function() {
    console.log("Inside moreInfoReady");
    let metadata = document.createElement("div");
    metadata.setAttribute("id", "metadata");
    metadata.innerHTML = `<table class="metadataTable">
    <tr>
        <td rowspan=6><img class="showMorePoster" src="${selectedMovie.Poster}"/></td>
    </tr>
    <tr>
        <td><strong>Title: </strong>${selectedMovie.Title}</td>
    </tr>    
        <td><strong>Released: </strong>${selectedMovie.Year}</td>
    <tr>    
        <td><strong>IMDB Rating: </strong>${selectedMovie.imdbRating}</td>
    </tr>   
    <tr>
        <td colspan=4><strong> Plot: </strong><div class="plot">${selectedMovie.Plot}<div></td>
    </tr>
    <tr>
        <td colspan=4><button id="showMoreButton" onclick="goBackFromMore()" class="showMoreButton" id="goBack">Go Back >></button></td>
    </tr>             
    </table>`;
    moreInfoMovie.appendChild(metadata);
});

function goBackFromMore(){
    closeMoreInfo();
    suggestionList = document.createElement("div");
    suggestionList.setAttribute("id", "autocomplete-list");
    suggestionList.setAttribute("class", "autocomplete-items");
    document.body.appendChild(suggestionList);
    for (let i = 0; i<results.length; i++) {
        suggestionFactory(results[i], i);
    }
}


function closeSuggestionList(){
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
        x[i].parentNode.removeChild(x[i]);
    }
}

function closeMoreInfo() {
    console.log("closeMoreInfo")
    let x = document.getElementById("metadata");
    if (x != null) {
        x.parentNode.removeChild(x);
    }
}