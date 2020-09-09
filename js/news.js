const apiKey = "6b0254fc064248f48a6ad4e60d494a07";
let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
const main = document.querySelector("main");

window.addEventListener("load", (e) => {
  postNews();
});

async function postNews() {
  const res = await fetch(url);
  const data = await res.json();
  main.innerHTML = data.articles.map(createArticle).join("\n");
}

function createArticle(article) {
  return `
    <div class="article">
      <a href="${article.url}" target="_blank">
        <img src="${article.urlToImage}" class="image"/>
        <h2>${article.title}</h2>
        <p>${article.description}</p>
      </a>
    </div>
  `;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(function () {
    console.log("Service Worker registered");
  });
}
