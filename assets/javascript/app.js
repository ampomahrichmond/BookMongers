/****************************************************************************
 ****************************************************************************
    Configure Firebase 
*****************************************************************************
*****************************************************************************/
var config = {
    apiKey: "AIzaSyC9vAXjOwVWdpAhJbYBB2njf_AhpvJ63wg",
    authDomain: "bookmongers-221023.firebaseapp.com",
    databaseURL: "https://bookmongers-221023.firebaseio.com",
    projectId: "bookmongers-221023",
    storageBucket: "bookmongers-221023.appspot.com",
    messagingSenderId: "654412021314"
};
firebase.initializeApp(config);
const db_users = firebase.database().ref("users");
const db_books = firebase.database().ref("books");
const auth = firebase.auth();

$('#btnSignup').on('click', () => {
    let firstName = $('#first_name').val().trim();
    let lastName = $('#last_name').val().trim();
    let userName = $('#username').val().trim();
    let email = $('#email').val().trim();
    let password = $('#password').val().trim();
    let confirmPassword = $('#chkpwd').val().trim();

    console.log(firstname);
    console.log(lastname);

    let validationPassed = true;
    let passwordsMatch = true;
    if (!checkName(firstName)) {
        //TODO: Notify the user that the first name can only be alphabets
        validationPassed = false;
    }


    if (!checkName(lastName)) {
        //TODO: Notify the user that the last name can only be alphabets
        validationPassed = false;
    }

    if (!checkEmail(email)) {
        //TODO: Notify the user that a valid email has not been entered
        validationPassed = false;
    }

    if (!CheckPassword(password)) {
        //TODO: Notify the user that passowrd format has not been entered
        validationPassed = false;
    }

    if (!CheckPassword(confirmPassword)) {
        //TODO: Notify the user that passowrd format has not been entered
        validationPassed = false;
    }
    if (password != confirmPassword) {
        //TODO: Notify the user that passowrd format has not been entered
        passwordsMatch = false;
    }

    if (validationPassed && passwordsMatch) {
        console.log("validation passed and passwords match");
        auth.createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log(user.uid);
                db_users.child(user.uid).set({
                    "displayName": firstName + " " + lastName,
                    "email": email,
                    "password": password
                });

                $("#messageToUser").text(`${userName}, thanks for signing up!`);

                setTimeout(function () {
                    window.location.replace("welcomepage.html");

                }, 2000);
                //TODO: Alert User that we have successfully created the user account and redirect him to home.html
            })
            .catch(
                e => {
                    console.log("Error:" + e.message)
                }
            );
    }
});

$('#btnSignup').on('click', () => {
    let email = $('#loginUser').val().trim();
    let password = $('#loginPassword').val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (firebaseUser) {
            console.log(firebaseUser.user.email);
            console.log(firebaseUser.user.uid);
            console.log(firebaseUser.user.displayName);

            $('#messageToUser').text("Successful login" + auth.currentUser);
            setTimeout(function () {
                window.location.replace("welcomepage.html");

            }, 2000);
        })
        .catch(function (error) {
            console.log("Sigin Error:" + error.message)
        });

    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("user signed in" + user);
        } else {
            // No user is signed in.
        }
    });
});

/****************************************************************************
 ****************************************************************************
    Input Validation
*****************************************************************************
*****************************************************************************/

// Name has to be alphabets only and cannot have alpha numeric characters
const checkName = (name) => {
    // the regular expression looks for one or more uppercase or lowercase letters within the character class [A-Za-z], 
    // followed with an end of a line anchor $
    let regex = /^[a-zA-Z]+$/;
    if (regex.test(name) == false) {
        // alert("Name must be in alphabets only");
        return false;
    }
    if (name == " ") {
        alert("Name Field cannot be left empty");
        return false;
    }
}

/* Email Regular Expression Rules - [personal_info]@[domain].[extn]
 *** personal_info can be any of the following
 * Uppercase (A-Z) and lowercase (a-z) English letters.
 * Digits (0-9).
 * Characters ! # $ % & ' * + - / = ? ^ _ ` { | } ~
 * Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other.
 *** domain - The domain name [for example com, org, net, in, us, info] part contains letters, digits, hyphens, and dots.
 */
const checkEmail = (email) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    if (regex.test(email)) {
        alert("Congrats! This is a valid Email email");
        return true;
    } else {
        alert("This is not a valid email address");
        return false;
    }
}

// To check a password between 6 to 12 characters 
// which contain at least one numeric digit, one uppercase and one lowercase letter
const CheckPassword = (pwd) => {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
    if (regex.test(pwd)) {
        alert('Correct,');
        return true;
    } else {
        alert('Wrong...!');
        return false;
    }
}

function signIn() {
    firebase.auth().signInWithEmailAndPassword("roop1@gmail.com", "Hello1231")
        .then(function (firebaseUser) {
            console.log(firebaseUser.user.email);
            console.log(firebaseUser.user.uid);
            console.log(firebaseUser.user.displayName);

            $('#messageToUser').text("Successful login" + auth.currentUser);
        })
        .catch(function (error) {
            console.log("Sigin Error:" + error.message)
        });

    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("user signed in" + user);
        } else {
            // No user is signed in.
        }
    });

}