// ── Carousel buttons ──────────────────────────────────────────────────

var collectionBtn = document.querySelectorAll('.carousel-button');

collectionBtn.forEach(function(button) {

	button.addEventListener('click', function() {

		window.location.href = '#collection';

	});

});



// ── Load testimonials from DB on page load ────────────────────────────

function loadTestimonials() {

	fetch('/ClayAndCo_New/testimonials')

		.then(function(response) { return response.text(); })

		.then(function(html) {

			document.getElementById("testimonial-row").innerHTML = html;

		})

		.catch(function(err) {

			console.error("Failed to load testimonials:", err);

		});

}



document.addEventListener("DOMContentLoaded", loadTestimonials);



// ── Show testimonial form ─────────────────────────────────────────────

var testimonialBtn = document.getElementById("testimonial-button");

testimonialBtn.addEventListener("click", displayform);

	

function displayform() {

	testimonialBtn.style.display = "none";

	var testimonialForm = document.getElementById("testimonial-form");

	testimonialForm.style.display = "block";



	document.querySelectorAll('.rating-inputs:not(.readonly) label').forEach(function(star) {

		star.addEventListener('click', function() {

			this.style.transform = 'scale(1.2)';

			setTimeout(function() {

				star.style.transform = 'scale(1)';

			}, 200);

		});

	});



	var formSubmit = document.getElementById("formSubmit");

	formSubmit.addEventListener("submit", createCard);



	var formCancel = document.getElementById("cancelTestimonialBtn");

	formCancel.addEventListener("click", function() {

		document.getElementById("testimonial-form").style.display = "none";

		formSubmit.reset();

		testimonialBtn.style.display = "inline-block";

	});

}



// ── Submit new testimonial to DB ──────────────────────────────────────

function createCard(event) {

    event.preventDefault();



    var name   = document.getElementById("userName").value;

    var city   = document.getElementById("userCity").value;

    var state  = document.getElementById("userState").value;

    var review = document.getElementById("userText").value;

    var ratingInput = document.querySelector('input[name="star-rating"]:checked');



    if (!ratingInput) {

        alert("Please select a star rating before submitting.");

        return;

    }

    var rating = ratingInput.value;



    // Send as URL-encoded string instead of FormData

    var params = "name="   + encodeURIComponent(name)   +

                 "&city="  + encodeURIComponent(city)   +

                 "&state=" + encodeURIComponent(state)  +

                 "&review="+ encodeURIComponent(review) +

                 "&rating="+ encodeURIComponent(rating);



    fetch('/ClayAndCo_New/testimonials', {

        method: 'POST',

        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

        body: params

    })

    .then(function(response) { return response.text(); })

    .then(function(message) {

        if (message.includes("saved")) {

            alert("Thank you for sharing your experience with us!");

            document.getElementById("testimonial-form").style.display = "none";

            document.getElementById("formSubmit").reset();

            testimonialBtn.style.display = "inline-block";

            loadTestimonials();

        } else {

            alert("Something went wrong. Please try again.");

        }

    });

}