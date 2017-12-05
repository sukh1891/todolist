function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}
function onDeviceReady() {
    var db = openDatabase('todolist', '1.0', 'todolist', 1024*1024);
    db.transaction(populateDB, failed, success);
    db.transaction(successDB, failed, success);
}
function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY, title VARCHAR, description TEXT, done CHAR, date TEXT)');
}
function successDB(tx) {
    tx.executeSql('SELECT * FROM list', [], querySuccess, failed);
}
function querySuccess(tx, results) {
    var len = results.rows.length;
    for (var i = len-1; i > -1; i--) {
        var rowid = results.rows.item(i).id;
        var rowdone = results.rows.item(i).done;
        var description = results.rows.item(i).description;
        var date = results.rows.item(i).date;
        if(rowdone == 1) {
            var img = "<img src='img/done.png'/>";
            var subhead = "Completed on " + date;
        } else {
            var img = "<img src='img/notdone.png'/>";
            var subhead = description;
        }
        document.getElementById("demo").innerHTML += "<div class='task'><a class='done' onclick='done(" + rowid + ", " + rowdone + ");'>" + img + "</a> <div class='ticrip'><b>" +  results.rows.item(i).title + "</b><u>" +  subhead + "</u></div><a class='remove' onclick='remove(" + rowid + ");'><img src='img/remove.png'/></a></div><br/>";
    }
}
function failed() {
    alert("An error occured! Please restart the app!");
}
function success() {
    
}
function done(id, rowdone) {
    var db = openDatabase('todolist', '1.0', 'todolist', 1024*1024);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd < 10){
        dd = "0" + dd;
    }
    if(mm < 10){
        mm = "0" + mm;
    }
    today = dd+'/'+mm+'/'+yyyy;
    db.transaction(function(transaction) {
        if(rowdone == 1) {
            var query = "UPDATE list SET done=0, date=? WHERE id=?";
        } else {
            var query = "UPDATE list SET done=1, date=? WHERE id=?";
        }
        transaction.executeSql(query, [today, id],
        function(tx, result) {window.location.reload(true);},
        function(error){alert('Something went Wrong');});
    });
}
function remove(id) {
    var db = openDatabase('todolist', '1.0', 'todolist', 1024*1024);
    db.transaction(function(transaction) {
        var query = "DELETE FROM list WHERE id=?";
        transaction.executeSql(query, [id],
        function(tx, result) {window.location.reload(true);},
        function(error){alert('Something went Wrong');});
    });
}
function successCB() {
    window.location.reload(true);
}
function errorCB() {
    alert("no inserted");
    window.location.reload(true);
}
function insertDB() {
    var db = openDatabase('todolist', '1.0', 'todolist', 1024*1024);
    db.transaction(insertoDB, errorCB, successCB);
}
function insertoDB(tx) {
    tx.executeSql('INSERT INTO list (title, description, done) VALUES ( ?, ?, 0)', [document.getElementById("title").value, document.getElementById("description").value]);
}
function hideTask() {
    $(".tasks").addClass("hide");
}
function showTask() {
    $(".tasks").removeClass("hide");
}
function showRemove() {
    $(".remove").toggle(10);
    $(".remove img").toggle(10);
}
function menu() {
    $(".nav").toggle(10);
}
function about() {
    $(".about").toggle(10);
}
$(document).click(function(e) {
    if( e.target.id != 'nav') {
        $("#nav").hide();
    }
});