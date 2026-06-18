document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.querySelector("#main-program-image");
  const thumbs = Array.from(document.querySelectorAll(".thumb"));
  const lightbox = document.querySelector("#image-lightbox");
  const lightboxImage = document.querySelector(".image-lightbox__image");
  const lightboxClose = document.querySelector(".image-lightbox__close");
  const reviewsList = document.querySelector(".reviews-list");
  const reviewForm = document.querySelector("#review-form");
  const reviewName = document.querySelector("#review-name");
  const reviewRating = document.querySelector("#review-rating");
  const reviewText = document.querySelector("#review-text");
  const reviewsStorageKey = "program-detail-reviews";

  const setActiveThumb = (selectedThumb) => {
    thumbs.forEach((thumb) => {
      thumb.classList.toggle("active", thumb === selectedThumb);
    });
  };

  const openLightbox = (imageSrc, imageAlt) => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightbox.hidden = false;
    document.body.classList.add("modal-open");
  };

  const closeLightbox = () => {
    if (!lightbox) {
      return;
    }

    lightbox.hidden = true;
    document.body.classList.remove("modal-open");
  };

  thumbs.forEach((thumb) => {
    const showSelectedImage = () => {
      mainImage.src = thumb.src;
      mainImage.alt = thumb.alt;
      setActiveThumb(thumb);
      openLightbox(thumb.src, thumb.alt);
    };

    thumb.addEventListener("click", showSelectedImage);
    thumb.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showSelectedImage();
      }
    });
  });

  if (mainImage) {
    mainImage.addEventListener("click", () => {
      openLightbox(mainImage.src, mainImage.alt);
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  const getSavedReviews = () => {
    try {
      return JSON.parse(localStorage.getItem(reviewsStorageKey)) || [];
    } catch {
      return [];
    }
  };

  const saveReviews = (reviews) => {
    localStorage.setItem(reviewsStorageKey, JSON.stringify(reviews));
  };

  const createReviewCard = ({ name, text, rating }) => {
    const reviewCard = document.createElement("article");
    reviewCard.className = "review-card";

    const reviewTitle = document.createElement("h3");
    reviewTitle.textContent = name;

    const reviewBody = document.createElement("p");
    reviewBody.textContent = text;

    const reviewScore = document.createElement("span");
    reviewScore.textContent = `Оценка: ${rating}/5`;

    reviewCard.append(reviewTitle, reviewBody, reviewScore);
    return reviewCard;
  };

  const renderSavedReviews = () => {
    getSavedReviews().forEach((review) => {
      reviewsList.append(createReviewCard(review));
    });
  };

  if (reviewsList) {
    renderSavedReviews();
  }

  if (reviewForm && reviewsList) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const newReview = {
        name: reviewName.value.trim(),
        rating: reviewRating.value,
        text: reviewText.value.trim(),
      };

      if (!newReview.name || !newReview.text) {
        return;
      }

      const reviews = getSavedReviews();
      reviews.push(newReview);
      saveReviews(reviews);
      reviewsList.append(createReviewCard(newReview));
      reviewForm.reset();
      reviewRating.value = "5";
    });
  }
});
