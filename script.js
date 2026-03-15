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

  // Controls (Search + Selector)
  const controls = document.createElement("div");
  controls.classList.add("controls");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.classList.add("search");

  const select = document.createElement("select");
  select.classList.add("episode-select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Jump to an episode...";
  select.appendChild(defaultOption);

  const resultsText = document.createElement("p");
  resultsText.classList.add("results-count");

  controls.appendChild(searchInput);
  controls.appendChild(select);
  controls.appendChild(resultsText);

  rootElem.appendChild(controls);

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

      episodeDiv.id = episodeCode;

      const option = document.createElement("option");
      option.value = episodeCode;
      option.textContent = `${episodeCode} - ${episode.name}`;
      select.appendChild(option);

      const title = document.createElement("h2");
      title.textContent = `${episodeCode} - ${episode.name}`;
      episodeDiv.appendChild(title);

      if (episode.image) {
        const image = document.createElement("img");
        image.src = episode.image.medium;
        image.alt = episode.name;
        episodeDiv.appendChild(image);
      }

      const summary = document.createElement("p");
      summary.innerHTML = episode.summary || "";
      episodeDiv.appendChild(summary);

      episodesContainer.appendChild(episodeDiv);
    });

    resultsText.textContent = `${list.length} episode(s) shown`;
  }

  // Initial render
  renderEpisodes(episodeList);

  // Search functionality
  searchInput.addEventListener("input", function (e) {
    const term = e.target.value.trim().toLowerCase();

    if (term === "") {
      renderEpisodes(episodeList);
      return;
    }

    const filtered = episodeList.filter((ep) => {
      const season = ep.season.toString().padStart(2, "0");
      const number = ep.number.toString().padStart(2, "0");
      const code = `s${season}e${number}`;

      const nameMatch = ep.name.toLowerCase().includes(term);
      const summaryMatch = (ep.summary || "").toLowerCase().includes(term);
      const codeMatch = code.includes(term);

      return nameMatch || summaryMatch || codeMatch;
    });

    renderEpisodes(filtered);
  });

  // Episode selector
  select.addEventListener("change", function (e) {
    const code = e.target.value;
    if (!code) return;

    const target = document.getElementById(code);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}
