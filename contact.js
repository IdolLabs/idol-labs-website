(() => {
  const formEl = document.querySelector(".contact-form");
  const topicSelect = document.getElementById("topic");
  const inquirySelect = document.getElementById("inquiryType");
  const subjectInput = document.getElementById("email-subject");

  if (!(formEl instanceof HTMLFormElement)) {
    return;
  }

  if (!(topicSelect instanceof HTMLSelectElement)) {
    return;
  }

  if (!(inquirySelect instanceof HTMLSelectElement)) {
    return;
  }

  if (!(subjectInput instanceof HTMLInputElement)) {
    return;
  }

  const sendButton = formEl.querySelector('button[type="submit"]');

  if (!(sendButton instanceof HTMLButtonElement)) {
    return;
  }

  const inquiryOptionsByTopic = {
    "Rhyme Offline": ["Bug Report", "Feature Suggestion", "General Inquiry"],
    "Other Inquiry": ["General Inquiry"],
  };

  let isRecaptchaSolved = false;
  let isMinimumDelayElapsed = false;

  const minimumSubmitDelayMs = 5000;

  function updateSendEnabled() {
    const isFormValid = formEl.checkValidity();
    sendButton.disabled = !(
      isFormValid &&
      isRecaptchaSolved &&
      isMinimumDelayElapsed
    );
  }

  function updateEmailSubject() {
    const topic = topicSelect.value;
    const inquiryType = inquirySelect.value;
    subjectInput.value = `[${topic}] [${inquiryType}] New contact`;
  }

  function setInquiryOptionsForTopic() {
    const topic = topicSelect.value;
    const labels = inquiryOptionsByTopic[topic] ?? [];

    inquirySelect.innerHTML = "";

    labels.forEach((labelText) => {
      const optionEl = document.createElement("option");
      optionEl.value = labelText;
      optionEl.textContent = labelText;
      inquirySelect.appendChild(optionEl);
    });

    updateEmailSubject();
    updateSendEnabled();
  }

  topicSelect.addEventListener("change", setInquiryOptionsForTopic);
  inquirySelect.addEventListener("change", updateEmailSubject);
  formEl.addEventListener("input", updateSendEnabled);
  formEl.addEventListener("change", updateSendEnabled);

  window.onContactRecaptchaSuccess = () => {
    isRecaptchaSolved = true;
    updateSendEnabled();
  };

  window.onContactRecaptchaExpired = () => {
    isRecaptchaSolved = false;
    updateSendEnabled();
  };

  setInquiryOptionsForTopic();
  updateSendEnabled();

  window.setTimeout(() => {
    isMinimumDelayElapsed = true;
    updateSendEnabled();
  }, minimumSubmitDelayMs);
})();

