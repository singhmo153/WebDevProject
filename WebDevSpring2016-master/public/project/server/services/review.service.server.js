"use strict";

module.exports = function(app, reviewModel) {
    app.post("/api/project/review", createReview);
    app.get("/api/project/reviews/:userId", getReviews);
    app.get("/api/project/review/:id", getReviewById);
    app.put("/api/project/review/:id", updateReview);
    app.delete("/api/project/review/:id", deleteReview);

    function createReview(req, res) {
        console.log(req.body);
        reviewModel
            .Create(req.body)
            .then(
                function(review){
                    res.json(review);
                },
                function () {
                    res.status(400).send(err);
                }
            )
    }

    function getReviews(req, res) {
        var userId = req.params.userId;
        res.json(reviewModel.FindAll(userId))
    }

    function getReviewById(req, res) {
        var id = req.params.id;
        res.json(reviewModel.FindById(id));
    }

    function updateReview(req, res) {
        var id = req.params.id;
        var review = req.body;
        reviewModel.Update(id, review)
            .then(function (review){
                    res.json(review)
                },
                function(){
                    res.status(400).send(err);
                })

    }

    function deleteReview(req, res) {
        var id = req.params.id;
        res.json(reviewModel.Delete(id));
    }
}