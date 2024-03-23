document.addEventListener("DOMContentLoaded", function () {
  clearLocalStorage();
  getCurrentImageOfTheDay();

  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const date = document.getElementById("inputdate").value;

    if (date) {
      getImageOfTheDay(date);
    } else {
      alert("Please select a date.");
    }
  });
});

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  getImageOfTheDay(currentDate);
}

function getImageOfTheDay(date) {
  const apiKey = "hZxEtoKWR5oZE3aFEuR3BbYxxxRs2pIz4ebZJCoM";
  const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayImage(data);
      saveSearch(date);
      displaySearchHistory();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayImage(data) {
  const titleElement = document.getElementById("title");
  const imgElement = document.getElementById("img");
  const pnameElement = document.getElementById("pname");
  const descElement = document.getElementById("desc");

  titleElement.textContent = `NASA Picture Of The Day: ${data.date || "NA"}`;
  imgElement.src = data.url;
  imgElement.alt = data.title;
  pnameElement.textContent = data.title;
  descElement.textContent = data.explanation;
}

function clearLocalStorage() {
  localStorage.removeItem("searches");
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function displaySearchHistory() {
  const previousElement = document.getElementById("previous");
  const searches = JSON.parse(localStorage.getItem("searches")) || [];

  previousElement.innerHTML = "<h3>Previous Searches</h3>";

  if (searches.length > 0) {
    searches.forEach((date) => {
      const anchor = document.createElement("a");
      anchor.textContent = date;
      anchor.href = "#";
      anchor.addEventListener("click", () => {
        getImageOfTheDay(date);
      });

      previousElement.appendChild(anchor);
    });
  } else {
    previousElement.innerHTML += "<p>No previous searches</p>";
  }
}
