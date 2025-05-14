document.addEventListener("DOMContentLoaded", function () {
    const notes = document.querySelectorAll(".graffiti-note");

    notes.forEach(note => {
        const id = note.getAttribute("graf-id");
        const marker = document.querySelector(`.graffiti-marker[graf-id="${id}"]`);

        if (marker) {
            const markerTop = marker.getBoundingClientRect().top + window.scrollY;
            note.style.position = "absolute";
            note.style.top = markerTop + "px";
            note.style.width = '200px';
        }
    });

    const container = document.querySelector(".graffiti-container");
    if (container) {
        container.style.position = "relative";
    }
});
