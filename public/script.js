document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:5050';

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
        console.log('Comment submitted:', comment);
        this.querySelector('textarea').value = '';
    });

    document.getElementById('update-comment').addEventListener('click', () => {
        console.log('Update comment');
        // Add functionality for updating a comment
    });

    document.getElementById('delete-comment').addEventListener('click', () => {
        console.log('Delete comment');
        // Add functionality for deleting a comment
    });

    //search movie function
    async function searchMovie() {
        const keyword = document.getElementById('searchKeyword').value;
        if (!keyword) {
            alert("Please enter a keyword");
            return;
        }
        await fetch(`${baseURL}/tmdb/search/${keyword}`)
            .then(response => response.json())
            .then(data => {
                displayMovieInfo(data.movie);
                updateCarouselImages(data.id);
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

    document.getElementById('searchButton').addEventListener('click', (e) => {e.preventDefault(); searchMovie()});
});