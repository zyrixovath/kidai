
async function searchDemo(inputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById("searchResult");

  if (!input || !output) return;

  const query = input.value.trim();

  if (!query) {
    output.textContent = "Tell us what you need help with.";
    return;
  }

  output.replaceChildren();

  const loading = document.createElement("p");
  loading.textContent = "Finding the most relevant services...";
  output.appendChild(loading);

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Search failed.");
    }

    output.replaceChildren();

    if (!data.results || data.results.length === 0) {
      output.textContent =
        "No close match found. Try describing the service in different words, or visit Help.";
      return;
    }

    const heading = document.createElement("h3");
    heading.textContent = "Here's what might help";
    output.appendChild(heading);

    data.results.forEach(service => {
      const card = document.createElement("article");
      card.className = "search-result-card";

      const title = document.createElement("h4");
      title.textContent = service.title;

      const description = document.createElement("p");
      description.textContent = service.description;

      const link = document.createElement("a");
      link.href = service.url;
      link.textContent = "Explore service →";

      card.append(title, description, link);
      output.appendChild(card);
    });
  } catch (error) {
    output.replaceChildren();

    const message = document.createElement("p");
    message.textContent =
      error.message || "Search is temporarily unavailable. Please try again.";

    output.appendChild(message);
  }
}

// Allow pressing Enter in the search field.
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("homeSearch");

  if (input) {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchDemo("homeSearch");
      }
    });
  }
});

// Existing prototype interactions.
function toggleMenu() {
  const nav = document.querySelector(".nav-links");
  if (nav) nav.classList.toggle("active");
}

function checkStatus() {
  const result = document.getElementById("statusResult");
  const reference = document.getElementById("ref");

  if (!result || !reference) return;

  result.textContent = reference.value.trim()
    ? "Demo only: this reference is not connected to a real request."
    : "Please enter a demo reference number.";
}
