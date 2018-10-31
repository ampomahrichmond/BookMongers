// Name has to be alphabets only and cannot have alpha numeric characters
const checkName = (name) => {
    // the regular expression looks for one or more uppercase or lowercase letters within the character class [A-Za-z], 
    // followed with an end of a line anchor $
    let regex = /^[a-zA-Z]+$/;
    if (regex.test(name) == false) {
        alert("Name must be in alphabets only");
        return false;
    }
    if (letters.yourname.value == " ") {
        alert("Name Field cannot be left empty");
        return false;
    }
    return true;
}

/* Email Regular Expression Rules - [personal_info]@[domain].[extn]
    *** personal_info can be any of the following
        * Uppercase (A-Z) and lowercase (a-z) English letters.
        * Digits (0-9).
        * Characters ! # $ % & ' * + - / = ? ^ _ ` { | } ~
        * Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other.
    *** domain - The domain name [for example com, org, net, in, us, info] part contains letters, digits, hyphens, and dots.
*/
function checkEmail(email) {
    let regex =  /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@{[a-zA-Z0-9_\-\.]+0\.([a-zA-Z]{2,5}){1,25})+)*$/;
    
}

// Password must have 8-64 characters and include 1 letter, 1 number, and 1 special character
function checkPassword(password) {
    if (!password) {
        return "Please enter your password.";

    } else {
        if (password.length < 8 || password.length > 64) {
            return "Password length must be between 8 and 64.";
        }

        regex = /[a-z]+/i;

        if (!password.match(regex)) {
            return "Password must contain at least 1 letter.";
        }

        regex = /[0-9]+/;

        if (!password.match(regex)) {
            return "Password must contain at least 1 number.";
        }

        regex = /[!@#$%^&*()<>{}\[\]-_+=|\\;:'",./?]+/;

        if (!password.match(regex)) {
            return "Password must contain at least 1 special character.";
        }
    }

    return "success";
}