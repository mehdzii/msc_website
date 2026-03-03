/* ==========================================================================
   MSC INPT — Registration Form JavaScript
   
   Handles:
   1. Form submission with success alert
   2. Favorite professor lock (easter egg)
   3. Profile picture upload preview
   ========================================================================== */


/**
 * 1. FORM SUBMISSION HANDLER
 * Prevents default page reload, displays a success alert with the
 * submitted student name and email, then resets the form.
 */
const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.fullName.value;
    const email = form.email.value;

    alert(
        "Registration Successful!\n\n" +
        "Student Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Welcome to INPT 🎓"
    );

    form.reset();

    // Hide the photo preview after form reset
    const preview = document.getElementById("photoPreview");
    if (preview) preview.style.display = "none";
});


/**
 * 2. PROFESSOR SELECT LOCK (Easter Egg)
 * Prevents changing the "Favorite Professor" dropdown from Hassan Farsi.
 * If the user tries to select another option, it snaps back with an alert.
 */
const professorSelect = document.getElementById("professor");
const fixedProfessor = "Hassan-Farsi";

professorSelect.addEventListener("change", function () {
    alert("Seriously 😐 you can't change this professor.");
    professorSelect.value = fixedProfessor;
});


/**
 * 3. PROFILE PICTURE PREVIEW
 * When a user selects an image file, it reads the file with FileReader
 * and displays a circular thumbnail preview below the upload area.
 * Non-image files are rejected with an alert.
 */
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function () {
    const file = photoInput.files[0];

    if (!file) return;

    // Validate that the selected file is an image
    if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        photoInput.value = "";
        photoPreview.style.display = "none";
        return;
    }

    // Read the image file and display the preview
    const reader = new FileReader();

    reader.onload = function (e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
    };

    reader.readAsDataURL(file);
});
