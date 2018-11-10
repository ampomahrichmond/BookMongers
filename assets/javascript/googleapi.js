// <!-- OUTSTANDING: CURRENT TEST DESIGN IS WORKING. NEED TO ADD THE JAVASCRIPT/JQUERY PIECE TO OUR PROJECT 
//     AND CONNECT IT TO THE RESPECTIVE ASSOCIATED HTML FILE!

// 1.NEED TO ADD A DYNAMICALLY OWNED BUTTON SO WHEN USER CLICKS ON THE BOOK IMAGE AND DUMP 
// THE BOOK INFORMATION INTO THE OWNED SECTION OF OUR APP
// 2.NEED TO ADD THE MATERIALIZE ID'S AND CLASSESS FOR CSS STYLING -->

///////////////////////////////////////////TEST HTML SECTION PIECE STARTS HERE/////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////// */}

// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

//     <title>Books to Generate</title>
//     <style type="text/css">
//         body {
//             background-color: lavenderblush;
//         }

//         button,
//         div,
//         form,
//         input {
//             margin: 10px;
//         }

//         .book {
//             float: left;
//         }

//         /* Small Devices */
//         @media screen and (max-width : 360px) {
//             .container {
//                 width: 100%;
//             }

//             .main-section {
//                 width: 100%;
//             }
//         }

//         /* Small Devices, Tablets */
//         @media screen and (max-width : 768px) {
//             .container {
//                 width: 100%;
//             }

//             .main-section {
//                 width: 100%;
//             }
//         }

//         /* Medium Devices, Desktops */
//         @media screen and (max-width : 980px) {
//             .container {
//                 width: 100%;
//             }

//             .main-section {
//                 width: 100%;
//             }
//         }
//     </style>
// </head>

// <body>

//     <div class="container">
//         <h1>I Feel like Reading................</h1>

//         <form id="book-form">
//             <label for="book-input">Add a book</label>
//             <input type="text" id="book-input"><br>

//             <!-- Button triggers new book to be added -->
//             <input id="add-book" type="submit" value="Submit">
//         </form>

//         <!-- Books will Get Dumped Here -->
//         <div id="book-view"></div>

//         <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
//         <script type="text/javascript">


/* ///////////////////////////////////////////JAVASCRIPT PIECE STARTS HERE/////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////// */

            // // This function handles events where a book button is clicked on
            $("#add-book").on("click", function (event) {
                event.preventDefault();
                //     // This line grabs the input from the textbox
                var book = $("#book-input").val().trim();

                displayBookInfo(book);
                // this is calling the function passing in the what user typed
            });

            // // Function for dumping the JSON content for each button into the div
            function displayBookInfo(userBook) {
                console.log("displayBookInfo");
                console.log(userBook);

                // Method to replace dipslayed books with newly selected books
                $("#book-view").empty()
                // var books = $(this).attr("data-name");
                var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + userBook + "&api_key=AIzaSyA4XTI4Xb3uAaUVL1W5TvBR_blUC4HQbTg";
                // Creating an AJAX call for the specific book button being clicked on
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {

                    for (i = 0; i < response.items.length; i++) {

                        var url = response.items[i].volumeInfo.imageLinks.thumbnail;
                        var moreInfo = response.items[i].volumeInfo.infoLink;
                        var title = response.items[i].volumeInfo.title;
                        var author = response.items[i].volumeInfo.authors[0];
                        console.log(url);
                        console.log(moreInfo);
                        console.log(title);
                        console.log(author);

                        // REPLACE WITH MATERIALIZE PROJECT CLASSES AND ID'S USED FOR PROJECT's HTML FILE//

                        var titleDisplay = $('<h5 class = "center-align black-text">' + title + '</h5>');
                        var authorDisplay = $('<h5 class = "center-align black-text">' + author + '</h5>');
                        var img = $('<img class = "image" id= "bookImage">');
                        img.attr('src', url);
                        var infoLink = $('<a href= ' + moreInfo + ' > Click Here For More Information </a>');
                        var div = $("<div>");
                        div.append(titleDisplay);
                        div.append(authorDisplay);
                        div.append(img);
                        div.append(infoLink);
                        $('#book-view').append(div);
                    }

                });
            }
        </script>
    </div>
</body>

</html>