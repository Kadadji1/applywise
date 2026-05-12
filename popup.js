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

document.getElementById("generateBtn").addEventListener("click", async () => {

  analysisStatus.innerText = "Analyzing job match...";

  const jobText = jobTextArea.value.toLowerCase();
  const resumeText = resumeTextArea.value.toLowerCase();

  if (!jobText || !resumeText) {
    alert("Please add both the job description and your resume/profile.");
    analysisStatus.innerText = "";
    return;
  }

  document.getElementById("results").classList.remove("hidden");

  try {

    const response = await fetch("https://quiet-apply-api.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jobDescription: jobText,
        resume: resumeText
      })
    });

    const data = await response.json();

    analysisStatus.innerText = "✓ AI analysis complete";

    document.getElementById("results").innerHTML = `
      <div class="result-card">
        <h3>AI Analysis</h3>
        <p style="white-space: pre-wrap;">${data.result}</p>
      </div>
    `;

  } catch (error) {

    console.error(error);
    analysisStatus.innerText = "AI analysis failed.";

  }

});

document.getElementById("copyCoverLetterBtn").addEventListener("click", async () => {

  const text = document.getElementById("coverLetter").value;

  await navigator.clipboard.writeText(text);

  document.getElementById("copyCoverLetterBtn").innerText = "Copied";

  setTimeout(() => {
    document.getElementById("copyCoverLetterBtn").innerText = "Copy";
  }, 1500);

});
