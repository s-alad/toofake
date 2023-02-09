//yoinked from rvaidun
function attemptLogin(number: any) {
    fetch("https://us-central1-befake-623af.cloudfunctions.net/login", {
        "body": JSON.stringify({ "phoneNumber": number }),
        "method": "POST",
    }).then(
        response => response.json()
    ).then(
        data => {
            return data
        }
    ).catch(
        error => {
            return error
        }
    )
}

export { attemptLogin }