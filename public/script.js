document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:5050';
  
    let currentMovieId = 0;
    let currentReview = [];
    let currentReviewId = 0;

    let currentImageIndex = 0;
    const images = document.querySelectorAll('.carousel-image');
    const descriptions = [
        "hi",
        "Description for Movie 2",
        "Description for Movie 3"
    ];

    function updateDescription() {
        document.querySelector('.description').textContent = descriptions[currentImageIndex];
    }

    function switchImage(next = true) {
        images[currentImageIndex].classList.remove('active');
        if (next) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        }
        images[currentImageIndex].classList.add('active');
        updateDescription();
    }

    document.getElementById('next').addEventListener('click', () => switchImage(true));
    document.getElementById('prev').addEventListener('click', () => switchImage(false));

    // Comment form and buttons
    const commentForm = document.querySelector('.comment-form');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const comment = this.querySelector('textarea').value;
        this.querySelector('textarea').value = '';

        if (!comment) {
            return;
        }

        let commentBody = {
            "movieid": currentMovieId,
            "comment": comment
        };

        fetch(`${baseURL}/reviews/`, 
            {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(commentBody)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                getMovieReviews(currentMovieId);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    });

    document.getElementById('update-comment').addEventListener('click', (e) => {
        if (!currentReviewId) {
            alert('Please select a review to update!');
            return;
        }
        e.preventDefault();
        const comment = document.getElementById('commentsection').value;
        document.getElementById('commentsection').value = '';

        let commentBody = {
            "comment": comment
        };

        fetch(`${baseURL}/reviews/${currentReviewId}`, 
            {
                method: "PATCH",
                mode: "cors",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(commentBody)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                getMovieReviews(currentMovieId);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    });

    document.getElementById('delete-comment').addEventListener('click', (e) => {
        if (!currentReviewId) {
            alert('Please select a review to delete!');
            return;
        }
        e.preventDefault();
        fetch(`${baseURL}/reviews/${currentReviewId}`, 
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                getMovieReviews(currentMovieId);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    });

    //search movie function
    async function searchMovie() {
        const keyword = document.getElementById('searchKeyword').value;
        if (!keyword) {
            //alert("Please enter a keyword");
            return;
        }
        await fetch(`${baseURL}/tmdb/search/${keyword}`)
            .then(response => response.json())
            .then(data => {
                displayMovieInfo(data.movie);
                updateCarouselImages(data.id);
                getMovieReviews(data.id);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    }

    function displayMovieInfo(movie) {
        const movieContainer = document.getElementById('movieInfo');
        movieContainer.innerHTML = `
            <h1>${movie.title || 'Title Not Available'}</h1>
            <p><strong>Release Date:</strong> ${movie.release_date || 'Not Available'}</p>
            <p><strong>Overview:</strong> ${movie.overview || 'No overview available'}</p>
            <!-- More movie details here -->
        `;
    }

    async function updateCarouselImages(movieId) {
        currentMovieId = movieId;
        await fetch(`${baseURL}/tmdb/movie-images/${movieId}`)
            .then(response => response.json())
            .then(imageUrls => {
                const carouselImages = document.querySelectorAll('.carousel-image');
                
                imageUrls.forEach((url, index) => {
                    if (carouselImages[index]) {
                        carouselImages[index].src = url;
                        carouselImages[index].classList.remove('active');
                        if (index === 0) carouselImages[index].classList.add('active');
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    }

    async function getMovieReviews(movieId) {
        await fetch(`${baseURL}/reviews/movie/${movieId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                displayMovieReviews(data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    }

    function displayMovieReviews(reviews) {
        currentReview = reviews;
        if (!reviews) {
            return;
        }
        const reviewsContainer = document.getElementById('user-review');
        reviewsContainer.innerHTML = '';
        currentReviewId = 0;
        reviews.forEach(review => {
            let div = document.createElement('div');
            div.className = 'user-review';
            div.innerHTML = `
                <p><strong>${review.username}</strong>: ${review.comment}</p>
            `;
            div.id = review._id;
            div.tabIndex = -1;
            div.addEventListener('focus', (e) => {
                if (currentReviewId) {
                    document.getElementById(currentReviewId).classList.remove('active');
                }
                currentReviewId = e.target.id;
                e.target.classList.add('active');
            });
            // div.addEventListener('blur', (e) => {
            //     currentReviewId = 0;
            //     e.target.classList.remove('active');
            // });
            reviewsContainer.appendChild(div);
        });
    }

    document.getElementById('searchButton').addEventListener('click', (e) => {e.preventDefault(); searchMovie()});
});

//scroll animation for main to index
document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-button');
    const mainPage = document.getElementById('main-page');
  
    startButton.addEventListener('click', function() {
      mainPage.classList.add('scroll-up');
  
      setTimeout(function() {''
      window.location.href = 'index';
    });
      }, 1000); // Adjust the timeout to the length of your CSS animation
    });