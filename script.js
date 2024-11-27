const dashboardURL = "https://sites.google.com/view/your-dashboard"; // Replace with your page URL
window.location.href = dashboardURL; // Redirect to the page

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form reload

    const name = document.getElementById('name').value.trim();
    const grade = document.getElementById('grade').value;
    const strand = document.getElementById('strand').value;
    const section = document.getElementById('section').value.trim();

    if (name && grade && strand && section) {
        // Google Apps Script Web App URL
        const scriptURL = "https://script.google.com/macros/s/AKfycbwXOKbrxHK_sEFGb40z10PDt8duUz0X0bdTbo_0oqyCWGZqX7o_1UsY29Ad2pX4diba/exec"; // Replace with your actual URL

        // Data to send
        const formData = new URLSearchParams({
            name: name,
            grade: grade,
            strand: strand,
            section: section
        });

        // Send data to Google Spreadsheet
        fetch(scriptURL, {
            method: "POST",
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                if (result === "Success") {
                    // Store the data in localStorage
                    localStorage.setItem('userInfo', JSON.stringify({ name, grade, strand, section }));

                    // Hide login page and show success page with user info
                    document.getElementById('loginPage').style.display = 'none';
                    document.getElementById('successPage').style.display = 'block';

                    document.getElementById('userInfo').innerHTML = `
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Grade:</strong> ${grade}</p>
                        <p><strong>Strand:</strong> ${strand}</p>
                        <p><strong>Section:</strong> ${section}</p>
                    `;

                    // Create a dynamic button
                    const buttonContainer = document.getElementById('dynamicButtonContainer');
                    const newButton = document.createElement('button');
                    newButton.innerText = 'Go to Home';
                    newButton.className = 'dynamic-button';
                    newButton.addEventListener('click', function () {
                        // Redirect to the configured dashboard URL
                        window.location.href = dashboardURL;
                    });
                    buttonContainer.appendChild(newButton);
                } else {
                    document.getElementById('output').innerHTML = `<p style='color: red;'>Submission failed: ${result}</p>`;
                }
            })
            .catch(error => {
                document.getElementById('output').innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
            });
    } else {
        document.getElementById('output').innerHTML = '<p style="color: red;">Please fill out all fields.</p>';
    }
});

// On page load, check if user info is saved in localStorage
window.onload = function() {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
        // Parse stored data and show success page
        const { name, grade, strand, section } = JSON.parse(userInfo);

        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('successPage').style.display = 'block';

        document.getElementById('userInfo').innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Grade:</strong> ${grade}</p>
            <p><strong>Strand:</strong> ${strand}</p>
            <p><strong>Section:</strong> ${section}</p>
        `;

        // Create a dynamic button if it doesn't already exist
        const buttonContainer = document.getElementById('dynamicButtonContainer');
        if (!buttonContainer.querySelector('.dynamic-button')) {
            const newButton = document.createElement('button');
            newButton.innerText = 'Go to Home';
            newButton.className = 'dynamic-button';
            newButton.addEventListener('click', function () {
                // Redirect to the configured dashboard URL
                window.location.href = dashboardURL;
            });
            buttonContainer.appendChild(newButton);
        }
    } else {
        // Show login page if no user data is found
        document.getElementById('loginPage').style.display = 'block';
        document.getElementById('successPage').style.display = 'none';
    }
};

// Sign out functionality
document.getElementById('signOutButton').addEventListener('click', function () {
    // Clear user data from localStorage
    localStorage.removeItem('userInfo');

    // Hide success page and show login page again
    document.getElementById('successPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';

    // Clear input fields and output
    document.getElementById('name').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('strand').value = '';
    document.getElementById('section').value = '';
    document.getElementById('output').innerHTML = ''; // Clear error/success message
});