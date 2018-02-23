"use strict";

(function(){
    angular
        .module("NextReadHuntApp")
        .controller("DetailController", detailController);

    function detailController($scope, $routeParams, $rootScope, GoogleBookService, BookService, UserService, ReviewsService) {
        $scope.id = $routeParams.id;
        GoogleBookService.findBookByID(
            $scope.id,
            function (response) {
                $scope.book = response;
            }
        );
        if($rootScope.currentUser != null) {
            BookService.getBookById($routeParams.id).then(function (response) {
                if(response!=null){
                    BookService.getAllReviews($routeParams.id)
                        .then(function (response) {
                            $scope.userReviews = response;
                        });
                }
            });
        }


        $scope.addUserBook = function (book) {
            var newBook = {};
            var user = $rootScope.currentUser;
            newBook.title = book.volumeInfo["title"];
            newBook.pic = book.volumeInfo.imageLinks["smallThumbnail"];
            newBook.authors = book.volumeInfo["authors"];
            newBook.bookId = book.id;
            newBook.reviews = [];
            var books=null;
            var exist=false;
            BookService.findAllBooks().then(function (response) {
                    if (response != null) {
                        books = response;
                        if(books!=null){
                            for(var i=0; i<books.length; i++){
                                if(books[i].bookId == newBook.bookId){
                                    exist=true;
                                }
                            }
                        }
                        if(!exist){
                            BookService.addBook(newBook).then(function (response) {
                                    if (response != null) {
                                    }                },
                                function (err) {
                                    $scope.error = err;
                                });
                        }
                    }                },
                function (err) {
                    $scope.error = err;
                });

            var userBookExist=false;
            for(var i =0; i<user.books.length; i++){
                if(user.books[i].bookId==newBook.bookId){
                    userBookExist=true;
                }
            }

            if(!userBookExist){
                user.books.push(newBook);
                UserService.updateUser(user._id,user)
                    .then(function(response){
                        },
                        function(err) {
                            $scope.error = err;
                        });
            }
        }



        $scope.addUserReview = function (review, book) {
            var newReview = {};
            var newBook = {};
            var user = $rootScope.currentUser;
            newReview.rating= review.rating;
            newReview.bookId = book.id;
            newReview.comments = review.comments;
            newReview.userId = user._id;
            newReview.userName= user.username;
            newReview.bookName = book.volumeInfo["title"];
            newBook.title = book.volumeInfo["title"];
            newBook.pic = book.volumeInfo.imageLinks["smallThumbnail"];
            newBook.authors = book.volumeInfo["authors"];
            newBook.bookId = book.id;
            newBook.reviews =[]
            newBook.reviews.push(newReview);

            BookService.getBookById(book.id).then(function (response) {
                    var reviewExist;
                    console.log(response);
                    if (response != null) {
                        var reviews = response.reviews;
                        console.log(response)
                        if(reviews!=null){
                            for(var i=0; i<reviews.length; i++){
                                if(reviews[i].userId == newReview.userId){
                                    reviewExist=true;
                                    break;
                                    console.log(reviewExist);
                                }
                            }
                        }
                        else {
                            user.books.push(newBook);
                            UserService.updateUser(user._id,user)
                                .then(function(response){
                                        console.log(response);
                                        if(response!=null){
                                            ReviewsService.addReview(newReview).then(function (response) {
                                                    console.log(response);
                                                    if (response != null) {
                                                    }                },
                                                function (err) {
                                                    $scope.error = err;
                                                });

                                        }
                                    },
                                    function(err) {
                                        $scope.error = err;
                                    });

                        }
                    }
                    else{user.books.push(newBook);
                        BookService.addBook(newBook).then(function (response) {
                                console.log(response);
                                if (response != null) {
                                    UserService.updateUser(user._id,user)
                                        .then(function(response){
                                                console.log(response);
                                                if(response!=null){
                                                    ReviewsService.addReview(newReview).then(function (response) {
                                                            console.log(response);
                                                            if (response != null) {
                                                            }                },
                                                        function (err) {
                                                            $scope.error = err;
                                                        });
                                                }
                                            },
                                            function(err) {
                                                $scope.error = err;
                                            });
                                }                },
                            function (err) {
                                $scope.error = err;
                            });
                    }},
                function (err) {
                    $scope.error = err;
                });

            var userReviewExist=false;
            for(var i =0; i<user.reviews.length; i++){
                if(user.reviews[i].bookId==newReview.bookId){
                    userReviewExist=true;
                }
            }

            if(!userReviewExist){
                user.reviews.push(newReview);
                UserService.updateUser(user._id,user)
                    .then(function(response){
                        },
                        function(err) {
                            $scope.error = err;
                        });
            }

        }

        $scope.follow = function (userId) {
            var newBook = {};
            var user = $rootScope.currentUser;

            UserService.findUserById(userId)
                .then(function (response) {
                        var followingUser = response;
                        var following = user.following;
                        if(following.indexOf(followingUser._id)>-1){
                        }
                        else{
                            following.push(followingUser._id);
                            user.following = following;
                            UserService.updateUser(user._id, user)
                                .then(function (response) {
                                    },
                                    function (err) {
                                        $scope.error = err;
                                    });

                        }
                    },
                    function (err) {
                        $scope.error = err;
                    });
        }
    }
})();



