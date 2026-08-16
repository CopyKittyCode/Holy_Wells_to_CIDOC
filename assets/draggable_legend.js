console.log("*** GRAPH EXPORT / DRAGGABLE LEGEND JS LOADED ***");


// ============================================================
// Load html2canvas
// ============================================================

(function loadHtml2Canvas() {

    if (window.html2canvas) {
        console.log("*** html2canvas already available ***");
        return;
    }

    const script = document.createElement("script");

    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

    script.onload = function () {
        console.log("*** html2canvas loaded ***");
    };

    script.onerror = function () {
        console.error("*** FAILED TO LOAD html2canvas ***");
    };

    document.head.appendChild(script);

})();


// ============================================================
// Draggable legend
//
// IMPORTANT:
// Use event delegation rather than attaching listeners directly
// to #legend-box. Dash can replace DOM nodes when components
// update. Delegation means dragging continues to work.
// ============================================================

(function setupLegendDragging() {

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let activeLegend = null;

    function getLegend() {
        return document.getElementById("legend-box");
    }

    function restoreLegendPosition() {

        const legend = getLegend();

        if (!legend) {
            return;
        }

        const savedLeft =
            localStorage.getItem("legend-left");

        const savedTop =
            localStorage.getItem("legend-top");

        if (savedLeft) {
            legend.style.left = savedLeft;
        }

        if (savedTop) {
            legend.style.top = savedTop;
        }

        legend.style.transition = "none";
        legend.style.cursor = "move";
        legend.style.userSelect = "none";
    }


    // --------------------------------------------------------
    // Mouse down
    // --------------------------------------------------------

    document.addEventListener("mousedown", function (e) {

        const legend = getLegend();

        if (!legend) {
            return;
        }

        // Check whether the click occurred inside the legend
        if (!legend.contains(e.target)) {
            return;
        }

        dragging = true;
        activeLegend = legend;

        const rect = legend.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        legend.style.transition = "none";

        e.preventDefault();
        e.stopPropagation();

    }, true);


    // --------------------------------------------------------
    // Mouse move
    // --------------------------------------------------------

    document.addEventListener("mousemove", function (e) {

        if (!dragging || !activeLegend) {
            return;
        }

        const parent =
            activeLegend.offsetParent;

        if (!parent) {
            return;
        }

        const parentRect =
            parent.getBoundingClientRect();

        const newLeft =
            e.clientX -
            parentRect.left -
            offsetX;

        const newTop =
            e.clientY -
            parentRect.top -
            offsetY;

        activeLegend.style.left =
            newLeft + "px";

        activeLegend.style.top =
            newTop + "px";

    }, true);


    // --------------------------------------------------------
    // Mouse up
    // --------------------------------------------------------

    document.addEventListener("mouseup", function () {

        if (!dragging || !activeLegend) {
            return;
        }

        dragging = false;

        activeLegend.style.transition = "";

        localStorage.setItem(
            "legend-left",
            activeLegend.style.left
        );

        localStorage.setItem(
            "legend-top",
            activeLegend.style.top
        );

        activeLegend = null;

    }, true);


    // --------------------------------------------------------
    // Restore position periodically.
    //
    // This also handles Dash replacing the legend DOM element.
    // --------------------------------------------------------

    setInterval(function () {

        if (!dragging) {
            restoreLegendPosition();
        }

    }, 500);


    restoreLegendPosition();

})();


// ============================================================
// PNG EXPORT
// ============================================================

(function setupPNGExport() {

    document.addEventListener("click", async function (e) {

        const button = e.target.closest(
            "#export-png-button"
        );

        if (!button) {
            return;
        }

        console.log("*** EXPORT PNG CLICKED ***");

        const container =
            document.getElementById(
                "graph-export-container"
            );

        if (!container) {

            console.error(
                "*** graph-export-container NOT FOUND ***"
            );

            return;
        }


        // ----------------------------------------------------
        // Wait for html2canvas
        // ----------------------------------------------------

        let attempts = 0;

        while (
            !window.html2canvas &&
            attempts < 100
        ) {

            await new Promise(
                resolve => setTimeout(resolve, 100)
            );

            attempts++;
        }


        if (!window.html2canvas) {

            console.error(
                "*** html2canvas NOT AVAILABLE ***"
            );

            return;
        }


        // ----------------------------------------------------
        // Give Cytoscape/browser a moment to finish rendering
        // ----------------------------------------------------

        await new Promise(
            resolve => requestAnimationFrame(resolve)
        );

        await new Promise(
            resolve => setTimeout(resolve, 100)
        );


        try {

            console.log(
                "*** Capturing graph + legend ***"
            );


            // ------------------------------------------------
            // Make sure legend is above the graph
            // ------------------------------------------------

            const legend =
                document.getElementById(
                    "legend-box"
                );

            if (legend) {
                legend.style.zIndex = "3000";
            }


            // ------------------------------------------------
            // Capture the complete graph container
            // ------------------------------------------------

            const canvas =
                await window.html2canvas(
                    container,
                    {
                        backgroundColor: "#ffffff",

                        useCORS: true,

                        allowTaint: true,

                        logging: false,

                        scale:
                            window.devicePixelRatio || 1,

                        width:
                            container.offsetWidth,

                        height:
                            container.offsetHeight,

                        windowWidth:
                            document.documentElement.clientWidth,

                        windowHeight:
                            document.documentElement.clientHeight
                    }
                );


            // ------------------------------------------------
            // Convert to PNG data URL
            // ------------------------------------------------

            const imageData =
                canvas.toDataURL(
                    "image/png"
                );


            console.log(
                "*** PNG generated ***"
            );


            // ------------------------------------------------
            // Send image to Dash Store
            //
            // This avoids a Dash clientside_callback.
            // ------------------------------------------------

            if (
                window.dash_clientside &&
                window.dash_clientside.set_props
            ) {

                window.dash_clientside.set_props(
                    "png-export-data",
                    {
                        data: imageData
                    }
                );

                console.log(
                    "*** PNG data sent to Dash ***"
                );

            } else {

                console.error(
                    "*** dash_clientside.set_props is unavailable ***"
                );

            }


        } catch (error) {

            console.error(
                "*** PNG EXPORT FAILED ***",
                error
            );

        }

    }, true);

})();