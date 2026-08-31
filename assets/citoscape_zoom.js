console.log("=== cytoscape_zoom.js LOADED ===");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOMContentLoaded");

    const observer = new MutationObserver(function () {

        const graph = document.getElementById("graph");

        if (!graph || !graph._cyreg) {
            return;
        }

        console.log("=== CYTOSCAPE FOUND ===");

        const cy = graph._cyreg.cy;

        console.log("Cytoscape instance:", cy);

        // =========================================================
        // DISABLE CYTOSCAPE'S NATIVE MOUSE-WHEEL ZOOM
        // =========================================================

        cy.userZoomingEnabled(false);

        console.log("=== NATIVE CYTOSCAPE ZOOM DISABLED ===");


        // =========================================================
        // CUSTOM MOUSE-WHEEL ZOOM
        // =========================================================

        graph.addEventListener(
            "wheel",
            function (event) {

                // Prevent browser scrolling
                event.preventDefault();

                // Prevent Cytoscape/other handlers from processing
                // this wheel event
                event.stopPropagation();


                // -------------------------------------------------
                // Current zoom
                // -------------------------------------------------

                const currentZoom = cy.zoom();


                // -------------------------------------------------
                // Fixed zoom increment
                //
                // IMPORTANT:
                // deltaY magnitude is deliberately ignored.
                //
                // Any wheel movement = exactly one step.
                // -------------------------------------------------

                const zoomStep = 0.01;

                const direction = event.deltaY > 0 ? -1 : 1;

                const newZoom =
                    currentZoom + direction * zoomStep;


                // -------------------------------------------------
                // Mouse position inside the Cytoscape element
                //
                // This makes the zoom happen around the cursor.
                // -------------------------------------------------

                const rect = graph.getBoundingClientRect();

                const renderedPosition = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };


                // -------------------------------------------------
                // Debug output
                // -------------------------------------------------

                console.log(
                    "Wheel:",
                    event.deltaY,
                    "Zoom:",
                    currentZoom,
                    "→",
                    newZoom
                );


                // -------------------------------------------------
                // Apply custom zoom
                // -------------------------------------------------

                cy.zoom({
                    level: newZoom,
                    renderedPosition: renderedPosition
                });

            },
            {
                passive: false,
                capture: true
            }
        );


        console.log("=== CUSTOM ZOOM HANDLER INSTALLED ===");

        observer.disconnect();

    });


    // =============================================================
    // Wait until Dash/Cytoscape has created the graph
    // =============================================================

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

});