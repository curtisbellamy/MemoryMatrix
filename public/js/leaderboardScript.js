
window.onload = () => {



  fetch('/getUsers').then((response) => {
    if (response.status !== 200) {
      console.log('Error code: ' + response.status);
      return;
    }

    response.json().then(function (data) {
      for (i = 0; i < data.length; i++) { //data.length
        var pl = document.getElementById("playerList")
        var sl = document.getElementById("scoreList")
        var newNode = document.createElement("li")
        var newNode1 = document.createElement("li")
        newNode.innerHTML =`${i+1}.  ` + data[i].id;
        newNode1.innerHTML = data[i].points;
        pl.appendChild(newNode)
        sl.appendChild(newNode1)
      }
    });

  });


  let username = localStorage.getItem("name")
  document.getElementById("result1").innerHTML = " " + username + ", ";

  let score = localStorage.getItem("score")
  document.getElementById("result2").innerHTML = " " + score + "!";


}