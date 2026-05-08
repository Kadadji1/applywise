document.getElementById("extractBtn").addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    action: "getJobDescription"
  }, (response) => {

    document.getElementById("jobText").value =
      response.jobText;

  });

});


document.getElementById("generateBtn").addEventListener("click", () => {

  const jobText = document.getElementById("jobText").value;
  const resumeText = document.getElementById("resumeText").value;

  if (!jobText || !resumeText) {
    alert("Please add both the job description and your resume/profile.");
    return;
  }

  document.getElementById("results").classList.remove("hidden");

  const score = Math.floor(Math.random() * 25) + 70;

  document.getElementById("matchScore").innerText = score + "%";

  const missingSkills = [
    "Selenium",
    "CI/CD",
    "REST API Testing"
  ];

  const suggestions = [
    "Highlight your QA testing experience more clearly.",
    "Add automation testing tools to your resume.",
    "Mention collaboration with developers and designers."
  ];

  const missingSkillsList = document.getElementById("missingSkills");
  missingSkillsList.innerHTML = "";

  missingSkills.forEach(skill => {
    const li = document.createElement("li");
    li.innerText = skill;
    missingSkillsList.appendChild(li);
  });

  const suggestionsList = document.getElementById("resumeSuggestions");
  suggestionsList.innerHTML = "";

  suggestions.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    suggestionsList.appendChild(li);
  });

  document.getElementById("coverLetter").value =
`Dear Hiring Team,

I am excited to apply for this role. My background in QA testing, software tools, and product-focused problem solving aligns well with the position requirements.

I am especially interested in contributing to a collaborative team while continuing to grow my technical and automation skills.

Thank you for your time and consideration.

Best regards,`;

});
