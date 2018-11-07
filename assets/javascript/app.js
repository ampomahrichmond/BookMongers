$(document).ready(function () {
    /****************************************************************************
     ****************************************************************************
        Configure Firebase 
    *****************************************************************************
    *****************************************************************************/
    var config = {
        apiKey: "AIzaSyD17fnAlr9kMX8ULA7jiclC1h5Ua_HQD3A",
        authDomain: "bookmongers-631d6.firebaseapp.com",
        databaseURL: "https://bookmongers-631d6.firebaseio.com",
        projectId: "bookmongers-631d6",
        storageBucket: "",
        messagingSenderId: "298235970222"
    };

    firebase.initializeApp(config);
    const db_users = firebase.database().ref("users");
    const db_books = firebase.database().ref("books");
    const auth = firebase.auth();

    let quoteCategories = ["art", "funny", "inspire", "life", "love", "management", "sports", "students"];

    initApp();
    var userToken = '';
    /****************************************************************************
     ****************************************************************************
        Initialize App Procedure 
    *****************************************************************************
    *****************************************************************************/
    function initApp() {
        $('.modal').modal();
        $('.parallax').parallax();
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                console.log(user);
                userToken = user.uid;
                firebase.database().ref('/users/' + userToken).once('value').then(function (snapshot) {
                    username = (snapshot.val() && snapshot.val().displayName) || 'Anonymous';
                    console.log("Page refreshed: " + username);
                    $('#welcomeMessage').html("<h1>Welcome " + username + "</h1>");
                });
            } else {
                // No user is signed in.
                console.log("No one signed in");
            }
        });
    }



    /****************************************************************************
     ****************************************************************************
        User SignIn/SignUp Functionality
    *****************************************************************************
    *****************************************************************************/

    $('#btnModalQuote').on('click', () => {
        // let queryURL = "http://quotes.rest/qod.json?category=management";
        let queryURL = "http://quotes.rest/qod/categories.json";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response.contents.categories);
            let categories = response.contents.categories;
            console.log(categories);
            categories.forEach((value, index) => {
                console.log(value);
            })
            $('#quote').text(response.contents.categories)
            // console.log(response.contents.quotes[0]);
        });
    });

    $('#btnSignIn').on('click', () => {
        let email = $('#loginUser').val().trim();
        let password = $('#loginPassword').val().trim();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setTimeout(function () {
                    window.location.replace("home.html");
                }, 100);
            }).catch((error) => {
                console.log("Sigin Error:" + error.message)
            });
    });

    $('#btnRegister').on('click', () => {
        let firstName = $('#first_name').val().trim();
        let lastName = $('#last_name').val().trim();
        // let userName = $('#username').val().trim();
        let email = $('#email').val().trim();
        let password = $('#password').val().trim();
        let confirmPassword = $('#chkpwd').val().trim();

        // console.log(firstName);
        // console.log(lastName);
        let passwordsMatch = true;
        if (password != confirmPassword) {
            //TODO: Notify the user that passowrd format has not been entered
            passwordsMatch = false;
        }

        if (passwordsMatch) {
            console.log("Passwords match");
            auth.createUserWithEmailAndPassword(email, password)
                .then((savedUser) => {
                    db_users.child(savedUser.user.uid).set({
                        "displayName": firstName + " " + lastName,
                        "email": email,
                        "password": password
                    });

                    setTimeout(function () {
                        window.location.replace("home.html");
                    }, 100);
                })
                .catch(error => {
                    console.log("Error:" + error.message)
                });
        }
    });

    $("#logout").on('click', () => {
        auth.signOut().then(function () {
            console.log('Signed Out');
            $('#signoutModal').modal('open');
        }, function (error) {
            console.error('Sign Out Error', error.message);
        });
    });

    $('#btnCancel').on('click', () => {
        $('#signUpModal').modal('close');
    });

    $('#btnQuoteModalClose').on('click', () => {
        $('#quoteModal').modal('close');
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
        if (regex.test(name)) {
            // alert("Name must be in alphabets only");
            return true;
        }
        if (name == " ") {
            alert("Name Field cannot be left empty");
            return false;
        }
        return false;
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
            // alert("Congrats! This is a valid Email email");
            return true;
        } else {
            // alert("This is not a valid email address");
            return false;
        }
    }

    // To check a password between 6 to 12 characters 
    // which contain at least one numeric digit, one uppercase and one lowercase letter
    const CheckPassword = (pwd) => {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
        if (regex.test(pwd)) {
            // alert('Correct,');
            return true;
        } else {
            // alert('Wrong...!');
            return false;
        }
    }
})