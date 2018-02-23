"use strict";

module.exports = function(app, bookModel) {
    app.get("/api/project/books", getBooks);
    app.get("/api/project/book/:bookId", getBookById);
    app.delete("/api/project/book/:bookId", deleteBook);
    app.post("/api/project/book/:bookId", updateBook);
    app.post("/api/project/book/", addBook);
    app.get("/api/project/book?bookTitle=bookTitle", getBookByTitle);
    //app.get("/api/project/book/reviews/:bookId", getReviews);
    app.get("/api/project/book/:bookId/review/:reviewId", deleteReview);
    app.get("/api/project/book/:bookId/reviews", getBookReviews);

    function addBook(req, res) {
        bookModel
            .Create(req.body)
            .then(
                function(book){
                    res.json(book);
                },
                function(){
                    res.status(400).send(err);
                }
            )
    }
    function updateBook(req, res) {
        var bookId = req.params.bookId;
        bookModel
            .update(bookId, req.body)
            .then(
                function(book){
                    res.json(book);
                },
                function(){
                    res.status(400).send(err);
                }
            )

    }
    function deleteReview(req, res) {
        var bookId = req.params.bookId;
        var reviewId = req.params.reviewId;
        bookModel
            .getBookById(bookId)
            .then(
                function(book){
                    var index= book.indexOf(reviewId);
                    book.reviews.splice(index,1);
                    res.json(book);
                },
                function(){
                    res.status(400).send(err);
                }
            )

    }

    function getBooks(req, res) {
        bookModel
            .FindAll()
            .then(
                function (books) {
                    res.json(books);
                },
                function () {
                    res.status(400).send(err);
                }
            );

    }

    function getBookReviews(req, res) {
        bookModel.FindAllReviews(req.params.bookId)
            .then(
                function (reviews){
                    res.json(reviews);
                },
                function(){
                    res.status(400).send(err);
                }
            );
    }

    function getBookById(req, res) {
        var bookId = req.params.bookId;
        console.log(bookId);
        bookModel
            .FindById(bookId)
            .then(function(book){
                res.json(book);
            }, function(){
                res.status(400).send(err);
            })

    }

    function deleteBook(req, res) {
        var bookId = req.params.bookId;
        res.json(bookModel.Delete(bookId));
    }

    function getBookByTitle(req, res) {
        var bookTitle = req.param("bookTitle");
        res.json(bookModel.findFormByTitle(bookTitle));
    }
}