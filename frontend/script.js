let selectedTemplate = "modern";


// =========================
// TEMPLATE SELECTION
// =========================

function selectTemplate(template, button) {

    selectedTemplate = template;

    // The selector belongs to the generator, so its state cannot affect
    // controls that may later be added to the generated portfolio.
    document
        .querySelectorAll("#generator .template-option")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    // Add active to clicked button
    button.classList.add("active");

    console.log("Selected template:", selectedTemplate);
}


// =========================
// CHANGE TEMPLATE
// =========================

function changeTemplate(template) {

    selectedTemplate = template;

    const portfolio =
        document.getElementById("portfolio");

    if (!portfolio) {
        console.error("Portfolio element not found!");
        return;
    }

    applyTemplate(portfolio);

    console.log("Changed template:", template);
}


// =========================
// CREATE ANOTHER PORTFOLIO
// =========================

function createAnotherPortfolio() {

    const generator =
        document.getElementById("generator");

    const portfolio =
        document.getElementById("portfolio");

    const userText =
        document.getElementById("userText");

    if (!generator || !portfolio) {
        console.error("Generator or portfolio not found!");
        return;
    }

    // Hide portfolio
    portfolio.classList.add("hidden");

    // Show generator
    generator.style.display = "flex";

    // Clear previous text
    if (userText) {
        userText.value = "";
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================
// GENERATE PORTFOLIO
// =========================

async function generatePortfolio() {

    const userText =
        document.getElementById("userText").value;

    const loading =
        document.getElementById("loading");

    const portfolio =
        document.getElementById("portfolio");

    const generator =
        document.getElementById("generator");


    // Check input

    if (!userText.trim()) {

        alert("Please tell us about yourself.");

        return;
    }


    // Loading

    loading.innerText =
        "🤖 AI is creating your portfolio...";


    try {

        const response =
            await fetch(
                "http://localhost:5000/generate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        text: userText
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );


        if (!data.success) {

            loading.innerText =
                data.error ||
                "Something went wrong.";

            return;
        }


        const p =
            data.portfolio;


        // =========================
        // HERO
        // =========================

        document.getElementById(
            "portfolioName"
        ).innerText =
            p.name || "Your Name";


        document.getElementById(
            "portfolioHeadline"
        ).innerText =
            p.headline || "Developer";


        // =========================
        // ABOUT
        // =========================

        document.getElementById(
            "about"
        ).innerText =
            p.about || "";


        // =========================
        // GITHUB
        // =========================

        const github =
            document.getElementById("github");


        if (p.contact && p.contact.github) {

            github.href =
                p.contact.github.startsWith("http")
                    ? p.contact.github
                    : "https://" + p.contact.github;

            github.style.display = "inline-block";

        } else {

            github.style.display = "none";
        }


        // =========================
        // LINKEDIN
        // =========================

        const linkedin =
            document.getElementById("linkedin");


        if (p.contact && p.contact.linkedin) {

            linkedin.href =
                p.contact.linkedin.startsWith("http")
                    ? p.contact.linkedin
                    : "https://" + p.contact.linkedin;

            linkedin.style.display = "inline-block";

        } else {

            linkedin.style.display = "none";
        }


        // =========================
        // SKILLS
        // =========================

        const skillsContainer =
            document.getElementById("skills");

        skillsContainer.innerHTML = "";


        (p.skills || []).forEach(skill => {

            const element =
                document.createElement("span");

            element.className = "skill";

            element.innerText = skill;

            skillsContainer.appendChild(
                element
            );

        });


        // =========================
        // PROJECTS
        // =========================

        const projectsContainer =
            document.getElementById("projects");

        projectsContainer.innerHTML = "";


        (p.projects || []).forEach(project => {

            const card =
                document.createElement("div");

            card.className =
                "project-card";


            let technologies = "";

            (project.technologies || [])
                .forEach(tech => {

                    technologies += `
                        <span class="tech">
                            ${tech}
                        </span>
                    `;

                });


            card.innerHTML = `

                <h3>
                    ${project.title || ""}
                </h3>

                <p>
                    ${project.description || ""}
                </p>

                <div class="technologies">
                    ${technologies}
                </div>

            `;


            projectsContainer.appendChild(
                card
            );

        });


        // =========================
        // EDUCATION
        // =========================

        const educationContainer =
            document.getElementById("education");

        educationContainer.innerHTML = "";


        (p.education || []).forEach(education => {

            const card =
                document.createElement("div");

            card.className =
                "education-card";


            card.innerHTML = `

                <h3>
                    ${education.degree || ""}
                </h3>

                <p>
                    ${education.institution || ""}
                </p>

                <p>
                    ${education.year || ""}
                </p>

            `;


            educationContainer.appendChild(
                card
            );

        });


        // =========================
        // EXPERIENCE
        // =========================

        const experienceSection =
            document.getElementById(
                "experience-section"
            );

        const experienceContainer =
            document.getElementById(
                "experience"
            );

        experienceContainer.innerHTML = "";


        if (
            !p.experience ||
            p.experience.length === 0
        ) {

            experienceSection.style.display =
                "none";

        } else {

            experienceSection.style.display =
                "block";


            p.experience.forEach(exp => {

                const card =
                    document.createElement("div");

                card.className =
                    "experience-card";


                card.innerHTML = `

                    <h3>
                        ${exp.role || ""}
                    </h3>

                    <p>
                        ${exp.company || ""}
                    </p>

                    <p>
                        ${exp.description || ""}
                    </p>

                `;


                experienceContainer
                    .appendChild(card);

            });

        }


        // =========================
        // ACHIEVEMENTS
        // =========================

        const achievementsSection =
            document.getElementById(
                "achievements-section"
            );

        const achievementsContainer =
            document.getElementById(
                "achievements"
            );

        achievementsContainer.innerHTML = "";


        if (
            !p.achievements ||
            p.achievements.length === 0
        ) {

            achievementsSection.style.display =
                "none";

        } else {

            achievementsSection.style.display =
                "block";


            p.achievements.forEach(
                achievement => {

                    const element =
                        document.createElement("div");

                    element.className =
                        "achievement";

                    element.innerText =
                        "🏆 " + achievement;

                    achievementsContainer
                        .appendChild(element);

                }
            );

        }


        // =========================
        // APPLY SELECTED TEMPLATE
        // =========================

        applyTemplate(portfolio);


        // =========================
        // SHOW PORTFOLIO
        // =========================

        generator.style.display =
            "none";

        portfolio.classList.remove(
            "hidden"
        );


        loading.innerText = "";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Frontend error:",
            error
        );

        loading.innerText =
            "❌ Could not connect to the backend.";

    }
}


// Template classes are intentionally applied only to #portfolio. The input
// screen stays unchanged while the user selects a template.
function applyTemplate(portfolio) {

    portfolio.classList.remove("minimal", "developer");

    if (selectedTemplate === "minimal") {
        portfolio.classList.add("minimal");
    } else if (selectedTemplate === "developer") {
        portfolio.classList.add("developer");
    }
}
