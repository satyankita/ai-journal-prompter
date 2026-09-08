const moodSelect = document.getElementById("mood");
const promptButton = document.getElementById("promptButton");
const promptText = document.getElementById("prompt");

promptButton.addEventListener("click", async () => {
    
    const mood = moodSelect.value;

    if (!mood) {
        promptText.textContent = "Please select your mood first.";
        return;
    }

    promptText.textContent = "Generating your journal prompt...";

    try {
        const response = await fetch("/journal-prompt", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mood: mood
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        promptText.textContent = data.prompt;

    } catch (error) {
        console.error("ERROR:", error);

        promptText.textContent =
            "Sorry, we couldn't generate a journal prompt.";
    }
});