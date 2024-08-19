let btnSubmit = document.getElementById("btnSubmit")
let inputEmail = document.getElementById("email")
let inputPassword = document.getElementById("password")

btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault()
    if (inputEmail.value.trim().length === 0 || inputPassword.value.trim().length === 0) {
        alert("Complete data...!!!")
        return
    }

    let body = {
        email: inputEmail.value.trim(),
        password: inputPassword.value.trim()
    }

    let payload = await fetch("/api/sessions/loginJWT", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    let data = await payload.json()
    console.log(data)
    // localStorage.setItem("token", data.token) // saves token in LocalStorage (token in headers)


})



let divData = document.getElementById("data")
let btnData = document.getElementById("btnData")
btnData.addEventListener("click", async (e) => {
    let payload = await fetch("/api/products/4", {
        // headers: {
        //     "Authorization": "Bearer " + localStorage.getItem("token")
        // }

    })
    console.log(payload);
    try {
        let data = await payload.json()
        console.log(data)
        divData.textContent = JSON.stringify(data, null, 5)
    } catch (error) {
        divData.textContent = "Error...!!!"
    }
})