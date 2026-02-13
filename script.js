//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach(function (episode) {
    const episodeDiv = document.createElement("div"); // this creates a div container for each episode

    const season = episode.season.toString().padStart(2, "0"); // this converts the season number to a string and pads it with a leading zero if it's less than 10
    const number = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${season}E${number}`; // this creates a string in the format "SxxExx" where xx is the season and episode number

    //tto create a title for each episode
    const title = document.createElement("h2");
    title.textContent = `${episodeCode} - ${episode.name}`;
    episodeDiv.appendChild(title);

    // tto create images for each episodes
    if (episode.image) {
      const image = document.createElement("img");
      image.src = episode.image.medium; // this sets the source of the image to the medium-sized image provided in the episode data
      episodeDiv.appendChild(image);
    } // putting it in an if statement helps to avoid crash and error if there is no image provided for an episode. also it doesn't create an empty <img> tag when there is no image provided, which would look bad on the page.

    // to create a summary for each episode
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary; // this sets the inner HTML of the paragraph to the summary provided in the episode data
    episodeDiv.appendChild(summary);

    rootElem.appendChild(episodeDiv);
  });
}

window.onload = setup;
