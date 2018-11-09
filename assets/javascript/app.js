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

    var quoteCategories = ["art", "funny", "inspire", "life", "love", "management", "sports", "students"];
    var userToken = " ";


    initApp();
    /****************************************************************************
    *****************************************************************************
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
                // reference to database to persist user owned list
                db_books.child(userToken).on("child_added", function (childSnapshot) {
                    console.log(childSnapshot.val());
                    var bookName = childSnapshot.val().name;
                    var author = childSnapshot.val().author;
                    var isbn = childSnapshot.val().isbn;
                    $("#owned-table > tbody").append("<tr><td>" + bookName + "</td><td>" + author + "</td><td>" + isbn + "</td><td>");
                });
            } else {
                // No user is signed in.
                console.log("No one signed in");
            }
        });
    }

    /****************************************************************************
    *****************************************************************************
        Generate a random quote everytime user clicks on the button
    *****************************************************************************
    *****************************************************************************/
    $('#btnModalQuote').on('click', () => {
        //Generate a random quote category
        let category = quoteCategories[Math.floor(Math.random() * quoteCategories.length)];
        let queryURL = "http://quotes.rest/qod.json?category=" + category;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let quote = response.contents.quotes[0].quote;
            let author = response.contents.quotes[0].author;
            $('#quote').html(`<h4>${quote}</h4>`);
            $('#author').html(`<h5>- ${author}</h5>`)
        });
    });

    /****************************************************************************
    *****************************************************************************
        User SignIn/SignUp Functionality
    *****************************************************************************
    *****************************************************************************/
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
    *****************************************************************************
        add book entries to Firebase 
    *****************************************************************************
    *****************************************************************************/
    // Button to add books
    $("#add-book-btn").on("click", function (event) {
        event.preventDefault();

        // Grabs user input
        var bookName = $("#book-name-input").val().trim();
        var author = $("#author-input").val().trim();
        var isbn = $("#isbn-input").val().trim();

        // Creates local "temporary" object for holding book data
        var newBook = {
            name: bookName,
            author: author,
            isbn: isbn,
        };

        // Uploads book data to the database
        db_books.child(userToken).push(newBook);
        console.log(userToken);

        // Alert
        alert("Book successfully added");

        // Clears all of the text-boxes
        $("#book-name-input").val("");
        $("#author-input").val("");
        $("#isbn-input").val("");
    });
    
    /****************************************************************************
    *****************************************************************************
       Search 
    *****************************************************************************
    *****************************************************************************/

    var apiKey = "&api_key=AIzaSyAEoZnDs6l4qoPHa6jFkYCfl1ukpV5Wowk";

    $('#btnSearch').on('click', () => {
        let searchTerm = $('#txtSearch').val().trim();
        let queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + searchTerm + apiKey;
        let url = '';
        let img = '';
        let title = '';
        let author = '';
        // Creating an AJAX call 
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then((response) => {
            console.log(response);
            var results = response.data.items.length;

            for (i = 0; i < response.items.length; i++) {
                console.log(response.items[i]);
                //get title of the book
                title = $('<h5 class = "center-align black-text">' + response.items[i].volumeInfo.title + '</h5>');
                author = $('<h5 class = "center-align black-text"> By:' + response.items[i].volumeInfo.authors + '</h5>');
                img = $('img class = "image" id= "bookImage"> <br> <a href=' + response.items[i].volumeInfo.infoLink + '><button id="imagebutton" class=""> Read More</button></a>');
                url = response.item[i].volumeInfo.imageLinks.thumbnail;
                img.attr('src', url); //attach the image url 
                title.appendTo("#result");
                author.appendTo("#result");
                img.appendTo("#result");
            }
        });

    });

    $('#btnReset').on('click', () => {
        $('#txtSearch').text('');
    })

    /****************************************************************************
    *****************************************************************************
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