document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#program-search");
  const sortSelect = document.querySelector("#program-sort");
  const programsList = document.querySelector(".programs-list");
  const pagination = document.querySelector(".pagination");
  const paginationPages = document.querySelector("#pagination-pages");
  const prevButton = document.querySelector('[data-pagination="prev"]');
  const nextButton = document.querySelector('[data-pagination="next"]');
  const emptyMessage = document.querySelector("#programs-empty");

  if (!searchInput || !sortSelect || !programsList || !paginationPages || !prevButton || !nextButton) {
    return;
  }

  const cards = Array.from(programsList.querySelectorAll(".program-card"));
  const pageSize = 3;
  let currentPage = 1;

  const normalizeText = (text) => text.toLocaleLowerCase("ru").trim();

  const sortCards = (items) => {
    const [field, direction] = sortSelect.value.split("-");
    const modifier = direction === "desc" ? -1 : 1;

    return [...items].sort((firstCard, secondCard) => {
      if (field === "title") {
        return firstCard.dataset.title.localeCompare(secondCard.dataset.title, "ru") * modifier;
      }

      const firstValue = Number(firstCard.dataset[field]);
      const secondValue = Number(secondCard.dataset[field]);
      return (firstValue - secondValue) * modifier;
    });
  };

  const getFilteredCards = () => {
    const query = normalizeText(searchInput.value);

    return cards.filter((card) => {
      const cardText = normalizeText(card.textContent);
      const cardTitle = normalizeText(card.dataset.title);
      return cardText.includes(query) || cardTitle.includes(query);
    });
  };

  const renderPagination = (pageCount) => {
    paginationPages.innerHTML = "";

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const pageButton = document.createElement("button");
      pageButton.type = "button";
      pageButton.className = "pagination__button";
      pageButton.textContent = pageNumber;

      if (pageNumber === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        currentPage = pageNumber;
        renderCatalog();
      });

      paginationPages.append(pageButton);
    }
  };

  function renderCatalog() {
    const filteredCards = sortCards(getFilteredCards());
    const pageCount = Math.max(Math.ceil(filteredCards.length / pageSize), 1);

    if (currentPage > pageCount) {
      currentPage = pageCount;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const visibleCards = filteredCards.slice(startIndex, startIndex + pageSize);

    cards.forEach((card) => {
      card.hidden = true;
    });

    visibleCards.forEach((card) => {
      card.hidden = false;
      programsList.append(card);
    });

    emptyMessage.hidden = filteredCards.length > 0;
    pagination.hidden = filteredCards.length === 0;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === pageCount;

    renderPagination(pageCount);
  }

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderCatalog();
  });

  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderCatalog();
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderCatalog();
    }
  });

  nextButton.addEventListener("click", () => {
    currentPage += 1;
    renderCatalog();
  });

  renderCatalog();
});
