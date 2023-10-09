function loginFunc()
{
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let login_data = {'email': email, 'password': password};

    console.log(login_data);

    fetch('http://localhost:3000/user/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(login_data),
        })
        .then((response) => {
            console.log(response);
            if (response.redirected)
            {
                window.location.href = response.url;
            }
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error:", error);
    });
}
let form = document.querySelector(".wrapper form");

form.addEventListener("submit", (e) =>{
    e.preventDefault();
    loginFunc();
});

function googleLoginFunc()
{
    fetch('http://localhost:3000/user/login/google', {
        method: "POST",
        })
        .then((response) => {
            console.log(response);
            if (response.redirected)
            {
                window.location.href = response.url;
            }
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error:", error);
    });
}
let google = document.querySelector("#google-login");

google.addEventListener("click", (e) =>{
    e.preventDefault();
    googleLoginFunc();
});