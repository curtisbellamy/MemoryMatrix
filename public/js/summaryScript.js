window.onload = () => {
    let score = localStorage.getItem("score")

    document.getElementById("resultSpan").innerText = String(score) + " "
    document.getElementById("hiddenVal").value = score
    console.log(document.getElementById("hiddenVal").value)


}

function storeName(){
    var username = document.getElementById("screenName").value
    localStorage.setItem("name", username)
  }