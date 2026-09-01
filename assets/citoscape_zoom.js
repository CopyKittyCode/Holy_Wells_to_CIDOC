console.log("=================================================");
console.log("=== citoscape_zoom.js LOADED ===");
console.log("=================================================");


document.addEventListener("DOMContentLoaded", function () {

    console.log("=== DOMContentLoaded ===");

    const observer = new MutationObserver(function () {

        const graph = document.getElementById("graph");

        if (!graph) {
            return;
        }

        if (!graph._cyreg) {
            return;
        }

        console.log("=================================================");
        console.log("=== CYTOSCAPE FOUND ===");
        console.log("=================================================");


        const cy = graph._cyreg.cy;


        // =========================================================
        // CONFIGURATION
        // =========================================================

        // Keep this at 0.01 for extremely fine zoom.
        const ZOOM_STEP = 0.01;

        const MIN_ZOOM = 0.05;

        const MAX_ZOOM = 3.0;


        // =========================================================
        // GRAPH INFORMATION
        // =========================================================

        const rect = graph.getBoundingClientRect();

        console.log(
            "Graph DOM size:",
            rect.width,
            "x",
            rect.height
        );

        console.log(
            "Nodes:",
            cy.nodes().length
        );

        console.log(
            "Edges:",
            cy.edges().length
        );

        console.log(
            "Current zoom:",
            cy.zoom()
        );

        console.log(
            "Current pan:",
            cy.pan()
        );


        // =========================================================
        // DISABLE CYTOSCAPE NATIVE WHEEL ZOOM
        // =========================================================

        cy.userZoomingEnabled(false);

        console.log(
            "=== NATIVE CYTOSCAPE ZOOM DISABLED ==="
        );


        // =========================================================
        // DEBUG: ZOOM EVENTS
        // =========================================================

        cy.on("zoom", function () {

            console.log(
                "=== CYTOSCAPE ZOOM ===",
                cy.zoom()
            );

        });


        // =========================================================
        // DEBUG: PAN EVENTS
        // =========================================================

        cy.on("pan", function () {

            console.log(
                "=== CYTOSCAPE PAN ===",
                cy.pan()
            );

        });


        // =========================================================
        // DEBUG: NODE ADDITIONS
        // =========================================================

        cy.on("add", "node", function (event) {

            const node = event.target;

            console.log("=================================================");
            console.log("=== NODE ADDED ===");
            console.log("ID:", node.id());
            console.log("Label:", node.data("label"));
            console.log("Kind:", node.data("kind"));

            console.log(
                "Model position:",
                node.position()
            );

            console.log(
                "Model size:",
                {
                    w: node.width(),
                    h: node.height()
                }
            );

            console.log(
                "Current zoom:",
                cy.zoom()
            );

            console.log(
                "Current pan:",
                cy.pan()
            );

            console.log("=================================================");

        });


        // =========================================================
        // CUSTOM WHEEL ZOOM
        // =========================================================

        graph.addEventListener(
            "wheel",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                // -------------------------------------------------
                // Current zoom
                // -------------------------------------------------

                const currentZoom = cy.zoom();


                // -------------------------------------------------
                // Zoom direction
                // -------------------------------------------------

                const direction =
                    event.deltaY > 0 ? -1 : 1;


                // -------------------------------------------------
                // Apply very small zoom step
                // -------------------------------------------------

                const requestedZoom =
                    currentZoom +
                    direction * ZOOM_STEP;


                // -------------------------------------------------
                // Clamp zoom
                // -------------------------------------------------

                const newZoom = Math.max(
                    MIN_ZOOM,
                    Math.min(
                        MAX_ZOOM,
                        requestedZoom
                    )
                );


                // -------------------------------------------------
                // Mouse position inside Cytoscape
                // -------------------------------------------------

                const rect =
                    graph.getBoundingClientRect();

                const renderedPosition = {

                    x:
                        event.clientX -
                        rect.left,

                    y:
                        event.clientY -
                        rect.top

                };


                // -------------------------------------------------
                // Debug
                // -------------------------------------------------

                console.log("=================================================");
                console.log("=== CUSTOM WHEEL ZOOM ===");

                console.log(
                    "deltaY:",
                    event.deltaY
                );

                console.log(
                    "current:",
                    currentZoom
                );

                console.log(
                    "step:",
                    ZOOM_STEP
                );

                console.log(
                    "new:",
                    newZoom
                );

                console.log(
                    "mouse:",
                    renderedPosition
                );


                // -------------------------------------------------
                // Apply zoom around mouse position
                // -------------------------------------------------

                cy.zoom({

                    level: newZoom,

                    renderedPosition:
                        renderedPosition

                });


                console.log(
                    "actual zoom:",
                    cy.zoom()
                );

                console.log("=================================================");

            },
            {
                passive: false,
                capture: true
            }
        );


        // =========================================================
        // COMPLETE
        // =========================================================

        console.log(
            "=== CUSTOM ZOOM HANDLER INSTALLED ==="
        );

        console.log(
            "Initial zoom is controlled by Dash/Python."
        );

        console.log(
            "Saved graph zoom/pan are controlled by Dash/Python."
        );


        // =========================================================
        // STOP OBSERVING
        // =========================================================

        observer.disconnect();

    });


    // =============================================================
    // WAIT FOR DASH / CYTOSCAPE
    // =============================================================

    observer.observe(document.body, {

        childList: true,

        subtree: true

    });

});