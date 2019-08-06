function ValidateEmail(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.value.match(mailformat)) {
        document.formEmail.email.focus();
        return true;
    } else {
        alert("You have entered an invalid email address!");
        document.formEmail.email.focus();
        return false;
    }
}