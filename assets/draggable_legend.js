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
// Constants for png export size
// ============================================================
const EXPORT_SIZE_CM = 12;
const EXPORT_SIZE_CM_HEIGHT = 8;
const EXPORT_SIZE_CM_WIDTH = 12;
const EXPORT_DPI = 300;

const CM_PER_INCH = 2.54;

// Convert physical size to pixels
const EXPORT_SIZE_PX =
    (EXPORT_SIZE_CM / CM_PER_INCH) * EXPORT_DPI;

const EXPORT_SIZE_PX_HEIGHT =
    (EXPORT_SIZE_CM_HEIGHT / CM_PER_INCH) * EXPORT_DPI;

const EXPORT_SIZE_PX_WIDTH =
    (EXPORT_SIZE_CM_WIDTH / CM_PER_INCH) * EXPORT_DPI;

// CSS pixels for the on-screen frame
const EXPORT_SCREEN_PX =
    (EXPORT_SIZE_CM / CM_PER_INCH) * 96;

const EXPORT_SCREEN_PX_HEIGHT =
    (EXPORT_SIZE_CM_HEIGHT / CM_PER_INCH) * 96;

const EXPORT_SCREEN_PX_WIDTH =
    (EXPORT_SIZE_CM_WIDTH / CM_PER_INCH) * 96;

console.log(
    "*** PNG EXPORT SIZE ***",
    EXPORT_SIZE_CM + " cm",
    EXPORT_DPI + " DPI",
    EXPORT_SIZE_PX + " px"
);


// ============================================================
// Constants for legend size relative to graph size and manual 
// ============================================================

const LEGEND_NODE_HEIGHT_RATIO = 0.35; //legend row to node height

// Manual scale limits
const LEGEND_MIN_SCALE = 0.40;
const LEGEND_MAX_SCALE = 3.00;


// Current legend scaling mode
let legendScaleMode = "automatic";

// Current scale
let legendScale = 1.0;

// ============================================================
// Find a Cytoscape node and measure its rendered height
// ============================================================

function getRenderedNodeHeight() {

    const graph =
        document.getElementById("graph");

    if (!graph) {
        return null;
    }


    // Cytoscape React/Dash component exposes its
    // internal Cytoscape instance through _cyreg.
    const cyreg = graph._cyreg;

    if (!cyreg) {
        return null;
    }

    const cy =
        cyreg.cy;

    if (!cy) {
        return null;
    }


    const nodes = cy.nodes();

    if (!nodes || nodes.length === 0) {
        return null;
    }


    // Use the first visible node as the reference.
    const node =
        nodes.filter(
            n => !n.hidden()
        )[0];

    if (!node) {
        return null;
    }


    const renderedHeight =
        node.renderedOuterHeight();

    if (
        !renderedHeight ||
        renderedHeight <= 0
    ) {
        return null;
    }


    return renderedHeight;
}

// ============================================================
// Calculate automatic legend scale
// ============================================================

function calculateAutomaticLegendScale() {

    const legend =
        document.getElementById(
            "legend-box"
        );

    if (!legend) {
        return null;
    }


    const rows =
        legend.querySelectorAll(
            ".legend-row"
        );

    if (!rows.length) {
        return null;
    }


    const nodeHeight =
        getRenderedNodeHeight();

    if (!nodeHeight) {
        return null;
    }


    // Measure an unscaled legend row.
    const row =
        rows[0];


    const previousTransform =
        legend.style.transform;


    // Temporarily remove scaling.
    legend.style.transform =
        "scale(1)";


    const legendRowHeight =
        row.getBoundingClientRect().height;


    // Restore current transform.
    legend.style.transform =
        previousTransform;


    if (
        !legendRowHeight ||
        legendRowHeight <= 0
    ) {
        return null;
    }


    const scale =
        (
            nodeHeight *
            LEGEND_NODE_HEIGHT_RATIO
        ) /
        legendRowHeight;


    return Math.max(
        LEGEND_MIN_SCALE,
        Math.min(
            LEGEND_MAX_SCALE,
            scale
        )
    );
}

// ============================================================
// Apply legend scale
// ============================================================

function applyLegendScale(scale) {

    const legend =
        document.getElementById(
            "legend-box"
        );

    if (!legend) {
        return;
    }


    legendScale =
        Math.max(
            LEGEND_MIN_SCALE,
            Math.min(
                LEGEND_MAX_SCALE,
                scale
            )
        );


    legend.style.transform =
        "scale(" +
        legendScale +
        ")";


    // legend.style.transformOrigin =
    //   "top left";
}

// ============================================================
// Automatically synchronize legend with graph nodes
// ============================================================

function updateLegendAutomatically() {

    if (
        legendScaleMode !== "automatic"
    ) {
        return;
    }


    const scale =
        calculateAutomaticLegendScale();


    if (scale === null) {
        return;
    }


    applyLegendScale(scale);
}

// ============================================================
// Manual legend resizing
// ============================================================

(function setupLegendResize() {

    let resizing = false;

    let startX = 0;
    let startY = 0;

    let startScale = 1.0;


    function getLegend() {

        return document.getElementById(
            "legend-box"
        );
    }


    function getHandle() {

        return document.getElementById(
            "legend-resize-handle"
        );
    }


    // --------------------------------------------------------
    // Mouse down on resize handle
    // --------------------------------------------------------

    document.addEventListener(
        "mousedown",
        function (e) {

            const handle =
                getHandle();

            if (!handle) {
                return;
            }


            if (!handle.contains(e.target)) {
                return;
            }


            const legend =
                getLegend();

            if (!legend) {
                return;
            }


            resizing = true;


            startX =
                e.clientX;

            startY =
                e.clientY;


            startScale =
                legendScale;


            // Switching to manual mode.
            legendScaleMode =
                "manual";


            localStorage.setItem(
                "legend-scale-mode",
                "manual"
            );


            handle.style.cursor =
                "nwse-resize";


            e.preventDefault();
            e.stopPropagation();

        },
        true
    );


    // --------------------------------------------------------
    // Mouse move
    // --------------------------------------------------------

    document.addEventListener(
        "mousemove",
        function (e) {

            if (!resizing) {
                return;
            }


            // Use diagonal movement.
            //
            // Positive movement → larger
            // Negative movement → smaller

            const dx =
                e.clientX -
                startX;

            const dy =
                e.clientY -
                startY;


            const delta =
                (dx + dy) / 2;


            // 200 px movement = approximately
            // one unit of scale.

            const newScale =
                startScale +
                delta / 200;


            applyLegendScale(
                newScale
            );

        },
        true
    );


    // --------------------------------------------------------
    // Mouse up
    // --------------------------------------------------------

    document.addEventListener(
        "mouseup",
        function () {

            if (!resizing) {
                return;
            }


            resizing = false;


            localStorage.setItem(
                "legend-scale",
                legendScale
            );

        },
        true
    );


    // --------------------------------------------------------
    // Double-click handle:
    // return to automatic sizing
    // --------------------------------------------------------

    document.addEventListener(
        "dblclick",
        function (e) {

            const handle =
                getHandle();

            if (!handle) {
                return;
            }


            if (!handle.contains(e.target)) {
                return;
            }


            legendScaleMode =
                "automatic";


            localStorage.setItem(
                "legend-scale-mode",
                "automatic"
            );


            localStorage.removeItem(
                "legend-scale"
            );


            updateLegendAutomatically();


            e.preventDefault();
            e.stopPropagation();

        },
        true
    );

})();

// ============================================================
// Draggable legend
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

        const legend =
            document.getElementById(
                "legend-box"
            );

        if (!legend) {
            return;
        }


        // --------------------------------------------------------
        // Restore position
        // --------------------------------------------------------

        const savedLeft =
            localStorage.getItem(
                "legend-left"
            );

        const savedTop =
            localStorage.getItem(
                "legend-top"
            );


        if (savedLeft) {
            legend.style.left =
                savedLeft;
        }

        if (savedTop) {
            legend.style.top =
                savedTop;
        }


        // --------------------------------------------------------
        // Restore scaling mode
        // --------------------------------------------------------

        const savedMode =
            localStorage.getItem(
                "legend-scale-mode"
            );


        if (savedMode === "manual") {

            legendScaleMode =
                "manual";


            const savedScale =
                parseFloat(
                    localStorage.getItem(
                        "legend-scale"
                    )
                );


            if (
                !isNaN(savedScale)
            ) {

                applyLegendScale(
                    savedScale
                );

            }

        } else {

            legendScaleMode =
                "automatic";

            updateLegendAutomatically();
        }
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

(function setupExportFrameDragging() {

    let dragging = false;
    let frame = null;

    let offsetX = 0;
    let offsetY = 0;


    function getFrame() {

        return document.getElementById(
            "png-export-frame"
        );
    }


    function getHandle() {

        return document.getElementById(
            "png-export-frame-handle"
        );
    }


    function restoreFramePosition() {

        const currentFrame =
            getFrame();

        if (!currentFrame) {
            return;
        }


        // ----------------------------------------------------
        // Restore position
        // ----------------------------------------------------

        const savedLeft =
            localStorage.getItem(
                "png-frame-left"
            );

        const savedTop =
            localStorage.getItem(
                "png-frame-top"
            );

        if (savedLeft !== null) {

            currentFrame.style.left =
                savedLeft + "px";
        }

        if (savedTop !== null) {

            currentFrame.style.top =
                savedTop + "px";
        }


        // ----------------------------------------------------
        // Calculate physical screen size
        // ----------------------------------------------------

        currentFrame.style.height =
            EXPORT_SCREEN_PX_HEIGHT + "px";

        currentFrame.style.width =
            EXPORT_SCREEN_PX_WIDTH + "px";


        // ----------------------------------------------------
        // Update label
        // ----------------------------------------------------

        const label =
            document.getElementById(
                "png-export-frame-label"
            );

        if (label) {

            label.textContent =
                EXPORT_SIZE_CM_WIDTH +
                " × " +
                EXPORT_SIZE_CM_HEIGHT +
                " cm";
        }
    }


    // --------------------------------------------------------
    // Mouse down ONLY on handle
    // --------------------------------------------------------

    document.addEventListener(
        "mousedown",
        function (e) {

            const handle =
                getHandle();

            if (!handle) {
                return;
            }

            if (!handle.contains(e.target)) {
                return;
            }


            const currentFrame =
                getFrame();

            if (!currentFrame) {
                return;
            }


            dragging = true;
            frame = currentFrame;


            const rect =
                frame.getBoundingClientRect();


            offsetX =
                e.clientX -
                rect.left;

            offsetY =
                e.clientY -
                rect.top;


            handle.style.cursor =
                "grabbing";


            e.preventDefault();
            e.stopPropagation();

        },
        true
    );


    // --------------------------------------------------------
    // Mouse move
    // --------------------------------------------------------

    document.addEventListener(
        "mousemove",
        function (e) {

            if (!dragging || !frame) {
                return;
            }


            const parent =
                frame.offsetParent;

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


            frame.style.left =
                newLeft + "px";

            frame.style.top =
                newTop + "px";

        },
        true
    );


    // --------------------------------------------------------
    // Mouse up
    // --------------------------------------------------------

    document.addEventListener(
        "mouseup",
        function () {

            if (!dragging || !frame) {
                return;
            }


            dragging = false;


            const handle =
                getHandle();

            if (handle) {

                handle.style.cursor =
                    "move";
            }


            localStorage.setItem(
                "png-frame-left",
                frame.style.left
            );

            localStorage.setItem(
                "png-frame-top",
                frame.style.top
            );


            frame = null;

        },
        true
    );


    // --------------------------------------------------------
    // Restore after Dash redraw
    // --------------------------------------------------------

    setInterval(
        function () {

            if (!dragging) {
                restoreFramePosition();
            }

        },
        500
    );


    restoreFramePosition();

})();


// ============================================================
// takes an image data URL and turns it into a Promise 
// that resolves when the browser has successfully loaded the image.
// ============================================================

function loadImageFromDataUrl(dataUrl) {

    return new Promise(
        function (resolve, reject) {

            const image =
                new Image();

            image.onload =
                function () {
                    resolve(image);
                };

            image.onerror =
                function (error) {
                    reject(error);
                };

            image.src =
                dataUrl;
        }
    );
}

// ============================================================
//                  PNG EXPORT
//
//              graph -export -container
//                       │
//            ┌──────────┴──────────┐
//            │                     │
//        Cytoscape               HTML
//            │                     │
//        cy.png()           html2canvas()
//            │                     │
//            └──────────┬──────────┘
//                       ↓
//                  finalCanvas
//                       ↓
//                      PNG
// ============================================================


(function setupPNGExport() {

    document.addEventListener(
        "click",
        async function (e) {

            // ====================================================
            // Check whether the clicked element is the
            // PNG export button
            // ====================================================

            const button =
                e.target.closest(
                    "#export-png-button"
                );

            if (!button) {
                return;
            }


            console.log(
                "*** EXPORT PNG CLICKED ***"
            );


            // ====================================================
            // FIND GRAPH CONTAINER
            // ====================================================

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


            // ====================================================
            // FIND CYTOSCAPE GRAPH
            // ====================================================

            const graph =
                document.getElementById(
                    "graph"
                );


            if (!graph) {

                console.error(
                    "*** graph NOT FOUND ***"
                );

                return;
            }


            // ====================================================
            // FIND EXPORT FRAME
            // ====================================================

            const frame =
                document.getElementById(
                    "png-export-frame"
                );


            if (!frame) {

                console.error(
                    "*** png-export-frame NOT FOUND ***"
                );

                return;
            }


            // ====================================================
            // GET CYTOSCAPE INSTANCE
            // ====================================================

            if (!graph._cyreg) {

                console.error(
                    "*** CYTOSCAPE _cyreg NOT FOUND ***"
                );

                return;
            }


            const cy =
                graph._cyreg.cy;


            if (!cy) {

                console.error(
                    "*** CYTOSCAPE INSTANCE NOT FOUND ***"
                );

                return;
            }


            console.log(
                "*** CYTOSCAPE INSTANCE FOUND ***"
            );


            // ====================================================
            // WAIT FOR html2canvas
            // ====================================================

            let attempts = 0;


            while (
                !window.html2canvas &&
                attempts < 100
            ) {
                //continue export when ready
                // doesnt freeze screen
                await new Promise(
                    function (resolve) {

                        setTimeout(
                            resolve,
                            100
                        );

                    }
                );

                attempts++;

            }


            if (!window.html2canvas) {

                console.error(
                    "*** html2canvas NOT AVAILABLE ***"
                );

                return;
            }


            console.log(
                "*** html2canvas AVAILABLE ***"
            );


            // ====================================================
            // WAIT FOR BROWSER RENDER
            // ====================================================

            await new Promise(
                function (resolve) {

                    requestAnimationFrame(
                        resolve
                    );

                }
            );


            await new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        100
                    );

                }
            );


            // ====================================================
            // SAVE FRAME VISIBILITY
            // ====================================================

            const previousVisibility =
                frame.style.visibility;


            try {

                // =================================================
                // GET CURRENT GEOMETRY
                // =================================================

                const containerRect =
                    container.getBoundingClientRect();


                const frameRect =
                    frame.getBoundingClientRect();


                const graphRect =
                    graph.getBoundingClientRect();


                // =================================================
                // FRAME POSITION RELATIVE TO CONTAINER
                // =================================================

                const cropX =
                    frameRect.left -
                    containerRect.left;


                const cropY =
                    frameRect.top -
                    containerRect.top;


                const cropWidth =
                    frameRect.width;


                const cropHeight =
                    frameRect.height;



                // =================================================
                // OUTPUT SIZE
                // =================================================


                const outputHeight =
                    Math.round(
                        EXPORT_SIZE_PX_HEIGHT
                    );


                const outputWidth =
                    Math.round(
                        EXPORT_SIZE_PX_WIDTH
                    );

                // css pixels to output pixels
                const outputScale =
                    outputWidth /
                    cropWidth;

                // =================================================
                // HIDE EXPORT FRAME
                // =================================================

                frame.style.visibility =
                    "hidden";


                // =================================================
                // CREATE FINAL CANVAS
                // =================================================

                const finalCanvas =
                    document.createElement(
                        "canvas"
                    );


                finalCanvas.width =
                    outputWidth;


                finalCanvas.height =
                    outputHeight;


                const ctx =
                    finalCanvas.getContext(
                        "2d"
                    );


                if (!ctx) {

                    throw new Error(
                        "Could not create 2D canvas context."
                    );

                }


                // =================================================
                // WHITE BACKGROUND
                // =================================================

                ctx.fillStyle =
                    "#ffffff";


                ctx.fillRect(
                    0,
                    0,
                    outputWidth,
                    outputHeight
                );


                // =================================================
                // CYTOSCAPE HIGH-RES EXPORT
                // =================================================

                console.log(
                    "*** RENDERING CYTOSCAPE AT HIGH RESOLUTION ***"
                );


                const cyDataUrl =
                    cy.png({

                        // IMPORTANT:
                        // Ask Cytoscape for a PNG data URL.
                        output:
                            "base64uri",

                        // White graph background.
                        bg:
                            "#ffffff",

                        // Export current viewport,
                        // preserving current pan + zoom.
                        full:
                            false,

                        // Render Cytoscape itself at
                        // high resolution.
                        scale:
                            outputScale
                    });


                console.log(
                    "*** CYTOSCAPE PNG GENERATED ***"
                );


                // =================================================
                // LOAD CYTOSCAPE PNG AS HTML IMAGE
                // =================================================

                const cyImage =
                    await loadImageFromDataUrl(
                        cyDataUrl
                    );


                console.log(
                    "*** CYTOSCAPE IMAGE LOADED ***"
                );


                // =================================================
                // DETERMINE GRAPH / FRAME INTERSECTION
                // =================================================

                const intersectionLeft =
                    Math.max(
                        frameRect.left,
                        graphRect.left
                    );


                const intersectionTop =
                    Math.max(
                        frameRect.top,
                        graphRect.top
                    );


                const intersectionRight =
                    Math.min(
                        frameRect.right,
                        graphRect.right
                    );


                const intersectionBottom =
                    Math.min(
                        frameRect.bottom,
                        graphRect.bottom
                    );


                const hasIntersection =
                    intersectionRight >
                    intersectionLeft &&
                    intersectionBottom >
                    intersectionTop;


                // =================================================
                // DRAW CYTOSCAPE
                // =================================================

                if (hasIntersection) {

                    // ------------------------------------------------
                    // Source coordinates
                    //
                    // Coordinates inside the Cytoscape PNG.
                    // ------------------------------------------------

                    const sourceX =
                        (
                            intersectionLeft -
                            graphRect.left
                        ) *
                        outputScale;


                    const sourceY =
                        (
                            intersectionTop -
                            graphRect.top
                        ) *
                        outputScale;


                    const sourceWidth =
                        (
                            intersectionRight -
                            intersectionLeft
                        ) *
                        outputScale;


                    const sourceHeight =
                        (
                            intersectionBottom -
                            intersectionTop
                        ) *
                        outputScale;


                    // ------------------------------------------------
                    // Destination coordinates
                    //
                    // Coordinates inside the final PNG.
                    // ------------------------------------------------

                    const destinationX =
                        (
                            intersectionLeft -
                            frameRect.left
                        ) *
                        outputScale;


                    const destinationY =
                        (
                            intersectionTop -
                            frameRect.top
                        ) *
                        outputScale;


                    const destinationWidth =
                        sourceWidth;


                    const destinationHeight =
                        sourceHeight;


                    console.log(
                        "*** DRAWING CYTOSCAPE ***"
                    );


                    console.log(
                        "Source:",
                        sourceX,
                        sourceY,
                        sourceWidth,
                        sourceHeight
                    );


                    console.log(
                        "Destination:",
                        destinationX,
                        destinationY,
                        destinationWidth,
                        destinationHeight
                    );


                    ctx.drawImage(

                        cyImage,

                        // Source rectangle
                        sourceX,
                        sourceY,
                        sourceWidth,
                        sourceHeight,

                        // Destination rectangle
                        destinationX,
                        destinationY,
                        destinationWidth,
                        destinationHeight

                    );


                    console.log(
                        "*** CYTOSCAPE DRAWN SUCCESSFULLY ***"
                    );


                } else {

                    console.log(
                        "*** FRAME DOES NOT OVERLAP GRAPH ***"
                    );

                }


                // =================================================
                // CAPTURE HTML OVERLAYS
                // =================================================
                //
                // html2canvas handles the HTML portion:
                //
                //   - legend
                //   - labels
                //   - other HTML overlays
                //
                // Cytoscape itself is explicitly excluded.
                // =================================================

                console.log(
                    "*** CAPTURING HTML OVERLAYS ***"
                );


                const htmlCanvas =
                    await window.html2canvas(
                        container,
                        {

                            backgroundColor:
                                null,


                            useCORS:
                                true,


                            allowTaint:
                                false,


                            logging:
                                false,


                            scale:
                                outputScale,


                            x:
                                cropX,


                            y:
                                cropY,


                            width:
                                cropWidth,


                            height:
                                cropHeight,


                            windowWidth:
                                document
                                    .documentElement
                                    .clientWidth,


                            windowHeight:
                                document
                                    .documentElement
                                    .clientHeight,


                            // =================================================
                            // CRITICAL
                            //
                            // Do NOT let html2canvas render Cytoscape.
                            //
                            // Cytoscape was already rendered above using
                            // cy.png() at high resolution.
                            // =================================================

                            ignoreElements:
                                function (element) {

                                    return (
                                        element.id ===
                                        "graph"
                                    );

                                }

                        }
                    );


                console.log(
                    "*** HTML OVERLAY CAPTURED ***"
                );


                console.log(
                    "HTML canvas size:",
                    htmlCanvas.width,
                    "x",
                    htmlCanvas.height
                );


                // =================================================
                // DRAW HTML OVERLAY ON FINAL CANVAS
                // =================================================

                ctx.drawImage(

                    htmlCanvas,

                    // Source rectangle
                    0,
                    0,
                    htmlCanvas.width,
                    htmlCanvas.height,

                    // Destination rectangle
                    0,
                    0,
                    outputWidth,
                    outputHeight

                );


                console.log(
                    "*** GRAPH + HTML OVERLAY COMBINED ***"
                );


                // =================================================
                // VERIFY FINAL SIZE
                // =================================================

                console.log(
                    "*** FINAL PNG SIZE ***",
                    finalCanvas.width,
                    "x",
                    finalCanvas.height
                );


                // =================================================
                // CONVERT FINAL CANVAS TO PNG
                // =================================================

                const imageData =
                    finalCanvas.toDataURL(
                        "image/png"
                    );


                console.log(
                    "*** FINAL PNG DATA CREATED ***"
                );


                // =================================================
                // SEND PNG TO DASH
                // =================================================

                if (
                    window.dash_clientside &&
                    window.dash_clientside.set_props
                ) {

                    window.dash_clientside.set_props(
                        "png-export-data",
                        {
                            data:
                                imageData
                        }
                    );


                    console.log(
                        "*** PNG DATA SENT TO DASH ***"
                    );


                } else {

                    console.error(
                        "*** dash_clientside.set_props unavailable ***"
                    );

                }


            } catch (error) {

                console.error(
                    "*** PNG EXPORT FAILED ***",
                    error
                );


            } finally {

                // =================================================
                // ALWAYS RESTORE EXPORT FRAME
                // =================================================

                frame.style.visibility =
                    previousVisibility;

            }

        },
        true
    );

})();

