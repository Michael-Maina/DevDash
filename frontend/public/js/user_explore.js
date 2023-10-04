let terminal_btn = document.querySelector('#terminal_intro');
let vim_btn = document.querySelector('#vim_intro');
let emacs_btn = document.querySelector('#emacs_intro');


terminal_btn.addEventListener("click", (e) => {
    let userId = window.location.href.split("/")[4];
    console.log(userId);
    window.location.href = `http://localhost:3000/user/${userId}/tutorial/intro_to_terminal`;
});

vim_btn.addEventListener("click", (e) => {
    let userId = window.location.href.split("/")[4];
    console.log(userId);
    window.location.href = `http://localhost:3000/user/${userId}/tutorial/intro_to_vim`;
});

emacs_btn.addEventListener("click", (e) => {
    let userId = window.location.href.split("/")[4];
    console.log(userId);
    window.location.href = `http://localhost:3000/user/${userId}/tutorial/intro_to_emacs`;
});

let logout_btn = document.querySelector('#logout-btn');


function logoutFunc()
{
    fetch('http://localhost:3000/user/logout', {
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

logout_btn.addEventListener("click", (e) => {
  logoutFunc();
});
