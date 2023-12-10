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
        const username = localStorage.getItem("username");

        if (!username) {
            alert('Please login!');
            return;
        }

        if (!comment) {
            return;
        }

        if (!currentMovieId) {
            alert('Please search a movie!');
            return;
        }

        let commentBody = {
            "movieid": currentMovieId,
            "comment": comment,
            "username": username
        };

        fetch(`${baseURL}/reviews/`, 
            {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
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
        const username = localStorage.getItem("username");
        if (!username) {
            alert('Please login!');
            return;
        }
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
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
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
        const username = localStorage.getItem("username");
        if (!username) {
            alert('Please login!');
            return;
        }
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
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
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
                console.log('Fetched data:', data);
                displayMovieInfo(data.movie);
                updateCarouselImages(data.id, data.movie);
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

        `
        ;
    }

    async function updateCarouselImages(movieId, movie) {
        currentMovieId = movieId;
    
        const carouselImages = document.querySelectorAll('.carousel-image');

        if (movie && movie.poster_path) {
            const posterImageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
            carouselImages[0].src = posterImageUrl;
            carouselImages[0].classList.add('active');
        } 
    
        try {
            const response = await fetch(`${baseURL}/tmdb/movie-images/${movieId}`);
            const imageUrls = await response.json();
            imageUrls.forEach((url, index) => {
                if (carouselImages[index+1]) {
                    carouselImages[index+1].src = url;
                    carouselImages[index+1].classList.remove('active');
                    carouselImages[index+1].style.width = '100%';
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
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
    document.getElementById('login-button').addEventListener('click', (e) => {e.preventDefault(); window.location.href = "/login"});
    document.getElementById('register-button').addEventListener('click', (e) => {e.preventDefault(); window.location.href = "/register"});
    document.getElementById('logout-button').addEventListener('click', (e) => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        window.location.href = "/";
        alert("Logout Success!");});

    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById('login-button').style.visibility = "hidden"; 
        document.getElementById('register-button').style.visibility = "hidden"; 
        document.getElementById('username').textContent = "Welcome! " + username;
    }
    else {
        document.getElementById('logout-button').style.visibility = "hidden"; 
    }
});

    function autocomplete(inp) {
        var currentFocus;
    
        inp.addEventListener("input", function(e) {
            var a, b, val = this.value;
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
    
            // Fetch the API key from back-end
            fetch('http://localhost:5050/api/getApiKey')
                .then(response => response.json())
                .then(data => {
                    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(val)}&include_adult=false&language=en-US&page=1`;
    
                    const options = {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `${data.apiKey}` 
                        }
                    };
    
                    fetch(url, options)
                        .then(res => res.json())
                        .then(json => {
                            if (json.results && Array.isArray(json.results)) {
                            const movies = json.results.slice(0, 5);
                            a = document.createElement("DIV");
                            a.setAttribute("id", this.id + "autocomplete-list");
                            a.setAttribute("class", "autocomplete-items");
                            this.parentNode.appendChild(a);
    
                            movies.forEach(movie => {
                                b = document.createElement("DIV");
                                b.innerHTML = `<strong>${movie.title.substr(0, val.length)}</strong>`;
                                b.innerHTML += movie.title.substr(val.length);
                                b.innerHTML += `<input type='hidden' value='${movie.title}'>`;
                                b.addEventListener("click", function(e) {
                                    inp.value = this.getElementsByTagName("input")[0].value;
                                    closeAllLists();
                                });
                                a.appendChild(b);
                            });}
                            else {
                                console.log('No results found or incorrect data format');
                            }
                        })
                        .catch(err => console.error('error:' + err));
                });
        });
    
        /* Keyboard function */
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });
    
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
    
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
    
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
    
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
    
    autocomplete(document.getElementById("searchKeyword"));



    