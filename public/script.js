document.addEventListener('DOMContentLoaded', () => {
    let currentImageIndex = 0;
    const images = document.querySelectorAll('.carousel-image');
    const descriptions = [
        "Description for Movie 1",
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
});
