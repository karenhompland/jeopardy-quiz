var scoreList;
var editMode = false;
var numOfPlayers;

function onLoad() {
    /*readTextFile("./spm.json", function (text) {
        qData = JSON.parse(text);
        img = document.getElementById('qImg');
    });*/
    qBox = document.getElementById('qContainer');
    checkLocalStorage();
    for (const x of Array(numOfPlayers).keys()) {
        document.getElementById(`team${x + 1}`).style.display = "flex";
    }
    showButtons();
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

function showButtons() {
    const qBox = document.querySelectorAll('div.container > div.fillIn');
    qBox.forEach(element => {
        element.style.display = "none";
    });
    const qButtons = document.querySelectorAll('div.container > button');
    qButtons.forEach(element => {
        element.style.display = "block";
    });
}

function showQuestions() {
    const qButtons = document.querySelectorAll('div.container > button');
    qButtons.forEach(element => {
        element.style.display = "none";
    });
    const qBox = document.querySelectorAll('div.container > div.fillIn');
    qBox.forEach(element => {
        element.style.display = "block";
        localStorage.getItem(element.id) == null ? element.innerHTML = "" : element.innerHTML = `${localStorage.getItem(element.id)}`;
    });
}

function enableEditMode() {
    editMode = true;
    document.getElementById("plusPlayer").style.display = "block";
    document.getElementById("minPlayer").style.display = "block";
    document.getElementById("saveButton").style.display = "block";
    document.getElementById("playButton").style.display = "block";
    document.getElementById("clearButton").style.display = "block";
    document.getElementById("editButton").style.display = "none";
    document.getElementById("restartButton").style.display = "none";
    showQuestions();
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.contentEditable = "true";
        element.style.textDecoration = "underline 2px #FFFFFF99";
    });
}


function saveButton() {
    localStorage.setItem("heading", document.getElementById("heading").innerHTML);
    for (const x of Array(5).keys()) {
        localStorage.setItem(`category${x + 1}`, document.getElementById(`category${x + 1}`).innerHTML);
    }
    const qButtons = document.querySelectorAll('div.container > div.fillIn');
    qButtons.forEach(element => {
        localStorage.setItem(element.id, element.innerHTML);
    });
}

function playMode(save) {
    if (save) { saveButton(); }
    editMode = false;
    document.getElementById("plusPlayer").style.display = "none";
    document.getElementById("minPlayer").style.display = "none";
    document.getElementById("saveButton").style.display = "none";
    document.getElementById("playButton").style.display = "none";
    document.getElementById("clearButton").style.display = "none";
    document.getElementById("editButton").style.display = "block";
    document.getElementById("restartButton").style.display = "block";
    showButtons();
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

function clearStorage() {
    if (confirm("Do you want to clear all data? This will delete all questions and text filled in.")) {
        localStorage.clear();
        onLoad();
        playMode(false);
        document.querySelectorAll('.opened').forEach(element => {
            element.style = "";
            element.classList.remove('opened');
        });
    }
}

