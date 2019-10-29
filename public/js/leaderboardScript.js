
window.onload = () => {

  // var scores = []
  var users = []


    fetch('/getUsers').then((response) => {
        if (response.status !== 200) {
            console.log('Error code: ' + response.status);
            return;
        }

        response.json().then(function (data) {
          var nums = []
          for (i = 0; i < data.length; i++){
              //users.push(data[i])
              // nums.push(data[i])
              var ul = document.getElementById("playerList")
              var newNode = document.createElement("li")
              newNode.innerHTML = data[i];
              ul.appendChild(newNode)
          }
        });


        // response.json().then((data) => {
        //   console.log(data)
        // })
 
    })

    fetch('/getScores').then((response) => {
      if (response.status !== 200) {
          console.log('Error code: ' + response.status);
          return;
      }

      response.json().then(function (data) {
        for (x = 0; x < data.length; x++){
          var ul = document.getElementById("scoreList")
          var newNode = document.createElement("li")
          newNode.innerHTML = data[x];
          ul.appendChild(newNode)
        }
      });


      // response.json().then((data) => {
      //   console.log(data)
      // })

  })

  // for(var obj in scores){
  //   console.log(obj)
  //   var ul = document.getElementById("playerList")
  //   var newNode = document.createElement("li")
  //   newNode.innerHTML = obj;
  //   ul.appendChild(newNode)
  // }

  // for(var obj in users){
  //   console.log(obj)
  // }
}