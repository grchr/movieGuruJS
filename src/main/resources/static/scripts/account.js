let user;
let bookmarks;
let bookmarksDetails = [];
let bookmarksInfo = document.getElementById('myBookmarks');
let oneBookmarkReady = new Event('oneBookmarkReady');
let allBokkmarksReady = new Event('allBookmarksReady');
let infoUrl = 'http://www.omdbapi.com/?apikey=f8306841&i=%query&plot=full';

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
            getBookmarkInfo();
        }
    }
}

function getBookmarkInfo(){
    bookmarks.forEach(function(storedBookmark) {
        let tempUrl = infoUrl;
        tempUrl = tempUrl.replace('%query', storedBookmark.imdbId);
        let infoRequest = new XMLHttpRequest();
        infoRequest.open("GET", tempUrl, true);
        infoRequest.send();
        infoRequest.onreadystatechange = (e) => {
            if (infoRequest.readyState == 4 && infoRequest.status == 200) {
                let jsonObject = JSON.parse(infoRequest.responseText);
                bookmarksDetails.push(jsonObject);
                bookmarksInfo.dispatchEvent(oneBookmarkReady);
            }
        }
    })
}

bookmarksInfo.addEventListener('oneBookmarkReady', function(){
    console.log("oneBookmarkReady");
    console.log(bookmarksDetails);
    if (bookmarksDetails.length === bookmarks.length) {
        bookmarksInfo.dispatchEvent(allBokkmarksReady);
    }
});

bookmarksInfo.addEventListener('allBookmarksReady', function(){

    console.log("allbookmakrsReady");
    console.log(bookmarksDetails);
    for (i=0; i<bookmarksDetails.length; i++) {
        myBookmarksFactory(bookmarksDetails[i], i);
    }
});

let myBookMarksBox;
function myBookmarksFactory(movie, i){
    let myBookMarks = `
    <div class="container">
    <div class="row">
        <div class="col-md">
            <table>
                <tr>
                    <td rowspan=6><img class="showMorePoster" src="${movie.Poster}"/></td>
                </tr>
                <tr>
                    <td><strong>Title: </strong>${movie.Title}</td>
                </tr>    
                    <td><strong>Released: </strong>${movie.Year}</td>
                <tr>    
                    <td><strong>IMDB Rating: </strong>${movie.imdbRating}</td>
                </tr>   
                <tr>
                    <td colspan=4><strong> Plot: </strong><div class="plot">${movie.Plot}<div></td>
                </tr>  
           </table>
        </div>
    </div>
    </div>
<hr>`;
    myBookMarksBox = document.createElement("div");
    myBookMarksBox.setAttribute("id", "myBookmarks" + i);
    myBookMarksBox.setAttribute("class", "myBookmarksClass");
    myBookMarksBox.innerHTML = myBookMarks;
    bookmarksInfo.appendChild(myBookMarksBox);
}