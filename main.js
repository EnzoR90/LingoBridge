const translators = {
    spanish: [
        { name: "Maria Garcia", status: "online" },
        { name: "Carlos Lopez", status: "online" },
        { name: "Elena Cruz", status: "offline" }
    ],
    filipino: [
        { name: "Juan Dela Cruz", status: "online" },
        { name: "Maria Santos", status: "online" },
        { name: "Pedro Villanueva", status: "offline" }
    ],
    chinese: [
        { name: "Chen Wei", status: "online" },
        { name: "Li Ming", status: "online" },
        { name: "Wang Ping", status: "offline" }
    ]
};

// Hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll(".container, .login-container, .signup-container");
    sections.forEach(section => section.classList.add("hidden"));
}

//function hideAllSections() {
    //const sectionIds = [
      //  'login-section', 'signup-section', 'translation-services', 
        //'document-translation', 'translation-results', 
        //'real-time-translation', 'translator-list-section', 
        //'translator-profile', 'request-details'
   // ];

   // sectionIds.forEach(id => {
     //   const element = document.getElementById(id);
       // if (element) {
         //   element.classList.add('hidden');
        //}
   // });
//}

// Navigation functions
function moveToNextStep() {
    hideAllSections();
    document.getElementById('translation-services')?.classList.remove('hidden');
}

function showDocumentTranslation() {
    hideAllSections();
    document.getElementById('document-translation')?.classList.remove('hidden');
}

function showRealTimeTranslation() {
    hideAllSections();
    document.getElementById('real-time-translation')?.classList.remove('hidden');
}

// Language code map for translation API
const languageCodeMap = {
    spanish: "es",
    filipino: "fil",
    chinese: "zh"
};

// Submit for Translation
function submitForTranslation() {
    const textToTranslate = document.getElementById('text-to-translate')?.value;
    const languageSelect = document.getElementById('language-select');
    const userSelectedLanguage = languageSelect ? languageSelect.value : null;
    const targetLanguage = languageCodeMap[userSelectedLanguage];

    if (!textToTranslate || !targetLanguage) {
        alert('Please provide both the text and a valid language.');
        return;
    }

    console.log("Text to translate:", textToTranslate);
    console.log("Target language:", targetLanguage);

    aiPoweredTranslation(textToTranslate, targetLanguage)
        .then(translatedText => {
            if (translatedText.startsWith("Error:")) {
                alert(translatedText);
                return;
            }

            const originalTextElem = document.getElementById('original-text');
            const translatedTextElem = document.getElementById('translated-text');

            if (originalTextElem && translatedTextElem) {
                originalTextElem.innerText = textToTranslate;
                translatedTextElem.innerText = translatedText;
                hideAllSections();
                document.getElementById('translation-results')?.classList.remove('hidden');
            } else {
                console.error("Elements for displaying translation results are missing.");
            }
        })
        .catch(error => {
            console.error("Translation Error:", error);
            alert("Translation failed. Please try again later.");
        });
}

// Translation API call
async function aiPoweredTranslation(text, targetLanguage) {
    const apiKey = 'AIzaSyASj7vXvmtDwWWvzNF4ul0dMfD59UDqjzA';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const payload = { q: text, target: targetLanguage, source: 'en' };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);

        const data = await response.json();
        if (data.error) return `Error: ${data.error.message}`;
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Error calling translation API:', error);
        return 'Translation failed due to a network or server issue. Please try again.';
    }
}

// Show/Hide Login and Signup sections
function showSignup() {
    hideAllSections();
    document.getElementById("signup-section")?.classList.remove("hidden");
}

function showLogin() {
    hideAllSections();
    document.getElementById("login-section")?.classList.remove("hidden");
}

// Signup and Login functions
function signup(event) {
    event.preventDefault();
    const email = document.getElementById("signup-email")?.value;
    const password = document.getElementById("signup-password")?.value;

    if (email && password) {
        localStorage.setItem("user-email", email);
        localStorage.setItem("user-password", password);
        alert("Signup successful! Please log in.");
        showLogin();
    } else {
        alert("Please enter both email and password.");
    }
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById("login-email")?.value;
    const password = document.getElementById("login-password")?.value;

    const storedEmail = localStorage.getItem("user-email");
    const storedPassword = localStorage.getItem("user-password");

    if (email === storedEmail && password === storedPassword) {
        alert("Login successful!");
        showTranslationServices();
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

// Show Translation Services Section after Login
function showTranslationServices() {
    hideAllSections();
    document.getElementById("translation-services")?.classList.remove("hidden");
}

// Function for toggling upload options
function toggleUploadOptions() {
    const uploadOptions = document.getElementById("upload-options");
    uploadOptions.classList.toggle("hidden");
}

// Documented navigation functions
function goBackToTranslationServices() {
    hideAllSections();
    document.getElementById('translation-services').classList.remove('hidden');
}


function goHome() {
    hideAllSections();
    document.getElementById('login-section').classList.remove('hidden');
}

function goBackToDocumentTranslation() {
    hideAllSections();
    document.getElementById('document-translation')?.classList.remove('hidden');
}

function showTranslators() {
    const selectedLanguage = document.getElementById('language-select').value;
    const translatorList = document.getElementById('translator-list');
    const translatorHeader = document.getElementById('translator-header');

    if (!translators[selectedLanguage]) {
        alert('No translators available for this language.');
        return;
    }

    translatorHeader.innerText = `List of Translators for ${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}`;
    translatorList.innerHTML = '';

    translators[selectedLanguage].forEach(translator => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${translator.name} <span class="translator-status">${translator.status === 'online' ? '🟢' : '🔴'}</span>`;
        listItem.onclick = () => showTranslatorProfile(translator.name);
        translatorList.appendChild(listItem);
    });

    hideAllSections();
    document.getElementById('translator-list-section')?.classList.remove('hidden');
}

function showTranslatorProfile(translatorName) {
    document.getElementById('translator-name').innerText = translatorName;
    hideAllSections();
    document.getElementById('translator-profile')?.classList.remove('hidden');
}

function goBackToRealTime() {
    hideAllSections();
    document.getElementById('real-time-translation')?.classList.remove('hidden');
}

function resetForm() {
    const documentTypeElement = document.getElementById("document-type");
    const specificRequestElement = document.getElementById("specific-request");
    const translatorSelectElement = document.getElementById("translator-select");

    if (documentTypeElement) {
        documentTypeElement.value = "";
    }
    
    if (specificRequestElement) {
        specificRequestElement.value = "";
    }

    if (translatorSelectElement) {
        translatorSelectElement.innerHTML = "";
    }

    goBackToTranslationServices();
}

// Show Translator Selection dropdown
function showTranslatorSelect() {
    const language = document.getElementById('language-select').value;
    populateTranslators(language);

    document.getElementById("translator-select-group")?.classList.remove("hidden");
    const confirmButton = document.querySelector("button[onclick='showTranslatorSelect()']");
    if (confirmButton) {
        confirmButton.setAttribute("onclick", "submitToTranslator()");
        confirmButton.innerText = "Confirm Submission to Translator";
    }
}

function populateTranslators(language) {
    const translatorSelect = document.getElementById("translator-select");
    translatorSelect.innerHTML = ""; 

    if (translators[language]) {
        translators[language].forEach(translator => {
            const option = document.createElement("option");
            option.value = translator.name;
            option.textContent = `${translator.name} (${translator.status === 'online' ? '🟢 Online' : '🔴 Offline'})`;
            translatorSelect.appendChild(option);
        });
    } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No translators available";
        translatorSelect.appendChild(option);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showLogin();
});

// Handle file upload and determine file type
function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    // Check file type and call the relevant function
    if (file.type === "application/pdf") {
        extractTextFromPDF(file);
    } else if (
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        extractTextFromDOC(file);
    } else {
        alert("Unsupported file type. Please upload a PDF or DOC file.");
    }
}

async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = "";

        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ");
        }

        // Send extracted text for translation
        console.log("Extracted text from PDF:", text); // Log to verify
        translateExtractedText(text);
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        alert("Failed to extract text from PDF. Please try a different file.");
    }
}

async function extractTextFromDOC(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;

        // Send extracted text for translation
        console.log("Extracted text from DOC/DOCX:", text); // Log to verify
        translateExtractedText(text);
    } catch (error) {
        console.error("Error extracting text from DOC/DOCX:", error);
        alert("Failed to extract text from DOC/DOCX. Please try a different file.");
    }
}

async function translateExtractedText(text) {
    const languageSelect = document.getElementById('language-select');
    const targetLanguage = languageSelect ? languageCodeMap[languageSelect.value] : null;

    if (!targetLanguage) {
        alert('Please select a target language for translation.');
        return;
    }

    try {
        const translatedText = await aiPoweredTranslation(text, targetLanguage);
        if (translatedText.startsWith("Error:")) {
            alert(translatedText);
            return;
        }

        // Display the translation results
        document.getElementById('original-text').innerText = text;
        document.getElementById('translated-text').innerText = translatedText;
        hideAllSections();
        document.getElementById('translation-results')?.classList.remove('hidden');
    } catch (error) {
        console.error("Translation failed:", error);
        alert("Translation failed. Please try again.");
    }
}

// Show specific sections and hide others
function showTranslationResults() {
    hideAllSections();
    document.getElementById('translation-results').classList.remove('hidden');
}

function showCommunityForm() {
    hideAllSections();
    document.getElementById('community-form-section').classList.remove('hidden');
}

function showCommunityFeed() {
    hideAllSections();
    document.getElementById('community-feed-section').classList.remove('hidden');
    displayCommunityPosts();
}

function publishToCommunity() {
    showCommunityForm();
}

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5I3tcFszIpfKn0POV51YcpuNVO-cXXIM",
authDomain: "api-restaurant-427414.firebaseapp.com",
databaseURL: "https://api-restaurant-427414-default-rtdb.firebaseio.com",
projectId: "api-restaurant-427414",
storageBucket: "api-restaurant-427414.firebasestorage.app",
messagingSenderId: "756280709111",
appId: "1:756280709111:web:6e010334410176255468f2",
measurementId: "G-JVMH3P5ZLE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to submit a community post to Firestore
async function submitCommunityPost(event) {
    event.preventDefault();

    const username = localStorage.getItem("user-email");
    const documentType = document.getElementById("document-type").value;
    const additionalComments = document.getElementById("additional-comments").value;

    try {
        await db.collection("posts").add({
            username: username,
            documentType: documentType,
            additionalComments: additionalComments,
            comments: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Your post has been submitted to the community!");
        showCommunityFeed();
    } catch (error) {
        console.error("Error submitting post:", error);
        alert("There was an issue submitting your post. Please try again.");
    }
}

// Display community posts from Firestore
async function displayCommunityPosts() {
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = ""; // Clear existing posts

    try {
        const querySnapshot = await db.collection("posts").orderBy("timestamp", "desc").get();

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <h3>${post.documentType}</h3>
                <p><strong>Posted by:</strong> ${post.username}</p>
                <p><strong>Additional Comments:</strong> ${post.additionalComments}</p>
                <div class="comments-section" id="comments-${doc.id}">
                    <h4>Comments:</h4>
                    ${post.comments.map(comment => `<p><strong>${comment.username}:</strong> ${comment.text}</p>`).join("")}
                    <input type="text" id="comment-input-${doc.id}" placeholder="Add a comment">
                    <button onclick="addComment('${doc.id}')">Post Comment</button>
                </div>
            `;
            postContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        postContainer.innerHTML = "<p>Failed to load community posts. Please try again later.</p>";
    }
}

// Add a comment to a specific post
async function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value.trim();
    const username = localStorage.getItem("user-email");

    if (!commentText) {
        alert("Comment cannot be empty.");
        return;
    }

    try {
        const postRef = db.collection("posts").doc(postId);
        await postRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion({ username, text: commentText })
        });

        commentInput.value = ""; // Clear the input
        displayCommunityPosts(); // Refresh posts to show the new comment
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}
