fetch('../assets/json/espacioAereo.json')
.then(response => response.json())
.then(response => console.log(JSON.stringify(response))
.catch(error => console.log(error))