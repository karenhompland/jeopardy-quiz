var scoreList;
var editMode = false;
var numOfPlayers;
var buttonText = [];

function onLoad() {
    readTextFile("./spm.json", function (text) {
        qData = JSON.parse(text);
        qBox = document.getElementById('qContainer');
        img = document.getElementById('qImg');
    });
    checkLocalStorage();
    for (const x of Array(numOfPlayers).keys()) {
        document.getElementById(`team${x + 1}`).style.display = "flex";
    }
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function checkLocalStorage() {
    if (localStorage.getItem("heading") != null) {
        document.getElementById("heading").innerHTML = localStorage.getItem("heading");
    }
    localStorage.getItem('numPlayers') != null ? numOfPlayers = parseInt(localStorage.getItem('numPlayers')) : numOfPlayers = 3;
    if (localStorage.getItem('scoreList') != null) {
        scoreList = localStorage.getItem('scoreList').split(",").map(function (item) {
            return parseInt(item);
        })
        updateAllScores();
    }
    else {
        scoreList = Array(numOfPlayers).fill(0);
    }
    for (const x of Array(5).keys()) {
        var category = localStorage.getItem(`category${x + 1}`);
        if (category != null) {
            document.getElementById(`category${x + 1}`).innerHTML = category;
        }
        else {
            document.getElementById(`category${x + 1}`).innerHTML = `Category ${x + 1}`;
        }
    }
}

function updateAllScores() {
    for (const x of Array(scoreList.length).keys()) {
        document.getElementById(`score${x + 1}`).innerHTML = scoreList[x];
    }

}

function enableEditMode() {
    editMode = true;
    document.getElementById("plusPlayer").style.display = "block";
    document.getElementById("minPlayer").style.display = "block";
    document.getElementById("saveButton").style.display = "block";
    document.getElementById("playButton").style.display = "block";
    document.getElementById("editButton").style.display = "none";
    document.getElementById("restartButton").style.display = "none";
    const qButtons = document.querySelectorAll('div.container > button');
    qButtons.forEach(element => {
        buttonText.push(element.innerHTML);
        localStorage.getItem(element.id) == null ? element.innerHTML = `<p contentEditable=true></p>` : element.innerHTML = `<p contentEditable=true>${localStorage.getItem(element.id)}</p>`;
        element.style.backgroundColor = "#2a2a2a";
        element.style.color = "#ffffff";
    });
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.contentEditable = "true";
        element.style.textDecoration = "underline 2px #FFFFFF99";
    });
    /*const qContainer = document.getElementById("qContainer");
    qContainer.addEventListener("keydown", function (event) {
        if (event.target.nodeName === "BUTTON" && event.key === " ") {
            event.preventDefault();
            event.target.innerHTML+=" ";
        }
    });*/
}


function saveButton() {
    localStorage.setItem("heading", document.getElementById("heading").innerHTML);
    for (const x of Array(5).keys()) {
        localStorage.setItem(`category${x + 1}`, document.getElementById(`category${x + 1}`).innerHTML);
    }
    const qButtons = document.querySelectorAll('div.container > button');
    qButtons.forEach(element => {
        localStorage.setItem(element.id, element.firstChild.innerHTML);
    });
}

function playMode() {
    saveButton();
    editMode = false;
    document.getElementById("plusPlayer").style.display = "none";
    document.getElementById("minPlayer").style.display = "none";
    document.getElementById("saveButton").style.display = "none";
    document.getElementById("playButton").style.display = "none";
    document.getElementById("editButton").style.display = "block";
    document.getElementById("restartButton").style.display = "block";
    const qButtons = document.querySelectorAll('div.container > button');
    var counter = 0;
    qButtons.forEach(element => {
        element.innerHTML = buttonText[counter];
        counter++;
        element.style = "";
    });
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.contentEditable = "false";
        element.style.textDecoration = "none";
    });
}

function resetGame() {
    if (confirm("Do you want to reset the game? This will clear all scores.")) {
        scoreList = Array(numOfPlayers).fill(0);
        localStorage.setItem('scoreList', scoreList);
        updateAllScores();
        document.querySelectorAll('.opened').forEach(element => {
            element.style = "";
            element.classList.remove('opened');
        });
    }

}


function onClick(id) {
    const documentElement = document.getElementById(id);
    if (documentElement.classList.contains("opened")) {
        documentElement.style = "";
        documentElement.classList.remove('opened');
    }
    else if (!editMode) {
        documentElement.style.backgroundColor = "#2a2a2a";
        documentElement.style.color = "#2a2a2a";
        documentElement.classList.add('opened');
        qBox.style.visibility = "visible";
        document.getElementById('qText').innerHTML = localStorage.getItem(id);
        /*if(id.includes("img")){
            document.getElementById('qImg').src='./spm-bilder/'+[id]+'.png';
            img.style.visibility = "visible";
        }*/
        if (documentElement.className.includes("sound")) {
            qBox.style.backgroundColor = "#E5A812";
            var audio = new Audio('bell.mp3');
            audio.play();
        }
    }
    else if (editMode) {


    }


}

function scoreClickMin(id) {
    scoreList[id - 1] -= 1;
    document.getElementById(`score${id}`).innerHTML = scoreList[id - 1];
    localStorage.setItem('scoreList', scoreList);
}

function scoreClickPlus(id) {
    scoreList[id - 1] += 1;
    document.getElementById(`score${id}`).innerHTML = scoreList[id - 1];
    localStorage.setItem('scoreList', scoreList);
}

function closeQ() {
    qBox.style.backgroundColor = "#8338ec";
    qBox.style.visibility = "hidden";
    /*document.getElementById('qImg').src='';
    img.style.visibility = "hidden";*/
}

function plusPlayer() {
    if (numOfPlayers < 5) {
        numOfPlayers += 1;
        if (numOfPlayers == 1) {
            scoreList = [0];
        }
        else {
            scoreList.push(0);
        }
        document.getElementById(`team${numOfPlayers}`).style.display = "flex";
        //document.getElementById(`team${numOfPlayers}`).innerHTML=scoreList[numOfPlayers];
    }
    if (numOfPlayers == 5) {
        document.getElementById("plusPlayer").disabled = true;
    }
    document.getElementById("minPlayer").disabled = false;
    savePlayers();
}

function minPlayer() {
    if (numOfPlayers > 0) {
        document.getElementById(`team${numOfPlayers}`).style.display = "none";
        numOfPlayers -= 1;
        scoreList.pop();
    }
    if (numOfPlayers == 0) {
        document.getElementById("minPlayer").disabled = true;
    }
    document.getElementById("plusPlayer").disabled = false;
    savePlayers();
}

function savePlayers() {
    localStorage.setItem("numPlayers", numOfPlayers);
    localStorage.setItem("scoreList", scoreList);
}

