let allEpisodes = [];

function setup() {
  const rootElem = document.getElementById("root");

  rootElem.textContent = "Loading episodes, please wait...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(function (episodes) {
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
    })
    .catch(function () {
      rootElem.textContent =
        "Sorry, something went wrong while loading the episodes.";
    });
}

window.onload = setup;

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // HEADER BOX
  const headerBox = document.createElement("div");
  headerBox.classList.add("header-box");
  const mainTitle = document.createElement("h1");
  mainTitle.textContent = "TV Show Project";
  headerBox.appendChild(mainTitle);
  rootElem.appendChild(headerBox);

  // CONTROLS BOX
  const controlsBox = document.createElement("div");
  controlsBox.classList.add("controls-box");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";

  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Jump to an episode...";
  select.appendChild(defaultOption);

  const resultsText = document.createElement("p");
  resultsText.classList.add("results-count");
  resultsText.textContent = `${episodeList.length} episodes shown`;

  controlsBox.appendChild(searchInput);
  controlsBox.appendChild(select);
  controlsBox.appendChild(resultsText);
  rootElem.appendChild(controlsBox);

  // EPISODES GRID
  const episodesContainer = document.createElement("div");
  episodesContainer.classList.add("episodes-container");
  rootElem.appendChild(episodesContainer);

  function renderEpisodes(list) {
    episodesContainer.innerHTML = "";
    select.innerHTML = "";
    select.appendChild(defaultOption);

    list.forEach((episode) => {
      const episodeDiv = document.createElement("div");

      const season = episode.season.toString().padStart(2, "0");
      const number = episode.number.toString().padStart(2, "0");
      const episodeCode = `S${season}E${number}`;

      // Episode title box
      const title = document.createElement("h2");
      title.textContent = `${episodeCode} - ${episode.name}`;
      episodeDiv.appendChild(title);

      // Image
      if (episode.image) {
        const image = document.createElement("img");
        image.src = episode.image.medium;
        image.alt = episode.name;
        episodeDiv.appendChild(image);
      }

      // Summary
      const summary = document.createElement("p");
      summary.innerHTML = episode.summary || "";
      episodeDiv.appendChild(summary);

      episodeDiv.id = episodeCode;
      episodesContainer.appendChild(episodeDiv);

      // Add option to select
      const option = document.createElement("option");
      option.value = episodeCode;
      option.textContent = `${episodeCode} - ${episode.name}`;
      select.appendChild(option);
    });

    resultsText.textContent = `${list.length} episode(s) shown`;
  }

  // Initial render
  renderEpisodes(episodeList);

  // SEARCH
  searchInput.addEventListener("input", function (e) {
    const term = e.target.value.trim().toLowerCase();
    if (!term) {
      renderEpisodes(episodeList);
      return;
    }
    const filtered = episodeList.filter((ep) => {
      const code = `s${ep.season.toString().padStart(2, "0")}e${ep.number
        .toString()
        .padStart(2, "0")}`;
      return (
        ep.name.toLowerCase().includes(term) ||
        (ep.summary || "").toLowerCase().includes(term) ||
        code.includes(term)
      );
    });
    renderEpisodes(filtered);
  });

  // SELECT
  select.addEventListener("change", function (e) {
    const code = e.target.value;
    if (!code) return;
    const target = document.getElementById(code);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}
