// ---------------- Quiz Data ----------------
const quizData = [
  {
    question: "What should you do first during an earthquake?",
    a: "Run outside",
    b: "Drop, Cover, Hold",
    c: "Shout for help",
    correct: "b"
  },
  {
    question: "During a fire, what should you avoid?",
    a: "Using elevators",
    b: "Using stairs",
    c: "Calling fire services",
    correct: "a"
  },
  {
    question: "During floods, where should you go?",
    a: "Lower ground",
    b: "Stay in water",
    c: "Higher ground",
    correct: "c"
  }
];

let quiz = document.getElementById("quiz");
let result = document.getElementById("result");

function loadQuiz() {
  quiz.innerHTML = "";
  quizData.forEach((q, index) => {
    quiz.innerHTML += `
      <div id="q${index}">
        <p><b>${index + 1}. ${q.question}</b></p>
        <label><input type="radio" name="q${index}" value="a"> ${q.a}</label><br>
        <label><input type="radio" name="q${index}" value="b"> ${q.b}</label><br>
        <label><input type="radio" name="q${index}" value="c"> ${q.c}</label><br>
      </div>
      <hr>
    `;
  });
  result.innerHTML = "";
}

function submitQuiz() {
  let score = 0;

  quizData.forEach((q, index) => {
    let answer = document.querySelector(`input[name="q${index}"]:checked`);
    let questionDiv = document.getElementById(`q${index}`);
    let labels = questionDiv.querySelectorAll("label");

    labels.forEach(label => {
      let input = label.querySelector("input");

      // Highlight correct answer
      if (input.value === q.correct) {
        label.style.color = "green";
        label.style.fontWeight = "bold";
      }

      // Highlight wrong selected answer
      if (answer && input.checked && input.value !== q.correct) {
        label.style.color = "red";
        label.style.fontWeight = "bold";
      }

      // Disable all options after submit
      input.disabled = true;
    });

    if (answer && answer.value === q.correct) {
      score++;
    }
  });

  result.innerHTML = `
    <h3>✅ You scored ${score} out of ${quizData.length}</h3>
    <button onclick="retryQuiz()">🔄 Try Again</button>
  `;
}

function retryQuiz() {
  loadQuiz();
}

// Load quiz at start
loadQuiz();


// ---------------- GDACS Disaster Alerts Integration ----------------
async function fetchAlerts() {
  const alertsList = document.getElementById("alerts");
  if (!alertsList) return; // prevent error if element not on page

  alertsList.innerHTML = "<li>Loading alerts...</li>";

  try {
    // Using rss2json API to bypass CORS
    const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.gdacs.org/xml/rss.xml");
    const data = await response.json();

    alertsList.innerHTML = "";
    data.items.slice(0, 5).forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${item.link}" target="_blank">${item.title}</a>
        <br><small>${new Date(item.pubDate).toLocaleString()}</small>
      `;
      alertsList.appendChild(li);
    });

    if (alertsList.innerHTML === "") {
      alertsList.innerHTML = "<li>⚠️ No alerts available</li>";
    }
  } catch (error) {
    alertsList.innerHTML = "<li>⚠️ Could not load alerts</li>";
    console.error("Error fetching alerts:", error);
  }
}

// Load alerts on page load
fetchAlerts();

// 🔄 Auto refresh every 5 minutes
setInterval(fetchAlerts, 5 * 60 * 1000);
