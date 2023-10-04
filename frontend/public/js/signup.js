function signupFunc()
{
    let firstName = document.querySelector("#firstname").value;
    let lastName = document.querySelector("#lastname").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let signup_data = {'firstName': firstName,
                        'lastName': lastName,
                        'email': email,
                        'password': password
                    };

    console.log(signup_data);

    fetch('http://localhost:3000/auth/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signup_data),
        })
        .then((response) => { console.log(response) })
        .then((data) => {
            // Handle the API response
            console.log("Default signup");
            console.log(data);
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error:", error);
    });
}
let form = document.querySelector(".wrapper form");

form.addEventListener("submit", (e) =>{
    e.preventDefault();
    signupFunc();
});

