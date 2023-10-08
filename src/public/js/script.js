const LSForm = document.querySelector('#loginsignupform');
const signupSwitch = document.querySelector('#signupSwitch');
const loginsignupbutton = document.querySelector('#loginsignupbutton');
let LRSR = '/login';

if(location.search.split('?error=')[1])
    alert(location.search.split('?error=')[1]);

signupSwitch.addEventListener('click', e => {
    LSForm.loginsignupbutton.textContent = 'Signup';
    LRSR = '/signup';
});

LSForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = LSForm.username.value;
    const password = LSForm.password.value;
    const json = JSON.stringify({username, password});

    const response = await fetch(LRSR, {
        body: json,
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
    })

    if(response.redirected)
        location = response.url;
}) 