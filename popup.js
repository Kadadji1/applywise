const jobTextArea = document.getElementById("jobText");
const resumeTextArea = document.getElementById("resumeText");

const profileStatus = document.getElementById("profileStatus");
const extractStatus = document.getElementById("extractStatus");
const analysisStatus = document.getElementById("analysisStatus");

chrome.storage.local.get(["savedResume", "savedJobText"], (result) => {

  if (result.savedResume) {
    resumeTextArea.value = result.savedResume;
    profileStatus.innerText = "✓ Saved profile loaded";
  }

  if (result.savedJobText) {
    jobTextArea.value = result.savedJobText;
  }

});

resumeTextArea.addEventListener("input", () => {

  chrome.storage.local.set({
    savedResume: resumeTextArea.value
  });

});

jobTextArea.addEventListener("input", () => {

  chrome.storage.local.set({
    savedJobText: jobTextArea.value
  });

});


document.getElementById("saveProfileBtn").addEventListener("click", () => {

  chrome.storage.local.set({
    savedResume: resumeTextArea.value
  });

  profileStatus.innerText = "✓ Profile saved successfully";

});


document.getElementById("clearProfileBtn").addEventListener("click", () => {

  resumeTextArea.value = "";

  chrome.storage.local.remove("savedResume");

  profileStatus.innerText = "Profile cleared";

});


document.getElementById("extractBtn").addEventListener("click", async () => {

  extractStatus.innerText = "Extracting job description...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {

      const linkedInJobDescription = document.querySelector('[data-testid="expandable-text-box"]');

      if (linkedInJobDescription) {
        return linkedInJobDescription.innerText;
      }

      const possibleDescriptionBlocks = [
        '.jobs-description',
        '.jobs-box__html-content',
        '#jobDescriptionText',
        '[data-testid="jobDescription"]'
      ];

      for (const selector of possibleDescriptionBlocks) {
        const block = document.querySelector(selector);

        if (block) {
          return block.innerText;
        }
      }

      return document.body.innerText;

    }
  }, (results) => {

    const pageText = results[0].result;

    jobTextArea.value = pageText.substring(0, 5000);

    chrome.storage.local.set({
      savedJobText: jobTextArea.value
    });

    extractStatus.innerText = "✓ Job description extracted";

  });

});


document.getElementById("generateBtn").addEventListener("click", () => {

  analysisStatus.innerText = "Analyzing job match...";

  const jobText = jobTextArea.value.toLowerCase();
  const resumeText = resumeTextArea.value.toLowerCase();

  if (!jobText || !resumeText) {
    alert("Please add both the job description and your resume/profile.");
    analysisStatus.innerText = "";
    return;
  }

  document.getElementById("results").classList.remove("hidden");

  const keywords = [
    "qa",
    "testing",
    "selenium",
    "playwright",
    "api",
    "javascript",
    "automation",
    "jira",
    "sql",
    "python"
  ];

  let matchedKeywords = 0;
  let missingSkills = [];

  keywords.forEach(keyword => {

    if (jobText.includes(keyword) && resumeText.includes(keyword)) {
      matchedKeywords++;
    }

    if (jobText.includes(keyword) && !resumeText.includes(keyword)) {
      missingSkills.push(keyword);
    }

  });

  let score = Math.floor((matchedKeywords / keywords.length) * 100);

  if (score < 15) {
    score = 15;
  }

  document.getElementById("matchScore").innerText = score + "%";

  const missingSkillsList = document.getElementById("missingSkills");
  missingSkillsList.innerHTML = "";

  missingSkills.forEach(skill => {

    const li = document.createElement("li");
    li.innerText = skill;
    missingSkillsList.appendChild(li);

  });

  const suggestions = [
    "Highlight your technical skills more clearly.",
    "Add more QA-related keywords to improve ATS matching.",
    "Mention tools and technologies used in projects."
  ];

  const suggestionsList = document.getElementById("resumeSuggestions");
  suggestionsList.innerHTML = "";

  suggestions.forEach(item => {

    const li = document.createElement("li");
    li.innerText = item;
    suggestionsList.appendChild(li);

  });

  document.getElementById("coverLetter").value =
`Dear Hiring Team,

I am excited to apply for this role. My background and technical interests align with many of the skills mentioned in the job description.

I am especially interested in continuing to grow in QA, automation, and software development while contributing to a collaborative team.

Thank you for your consideration.

Best regards,`;

  analysisStatus.innerText = "✓ Analysis completed";

});


document.getElementById("copyCoverLetterBtn").addEventListener("click", async () => {

  const text = document.getElementById("coverLetter").value;

  await navigator.clipboard.writeText(text);

  document.getElementById("copyCoverLetterBtn").innerText = "Copied";

  setTimeout(() => {
    document.getElementById("copyCoverLetterBtn").innerText = "Copy";
  }, 1500);

});
