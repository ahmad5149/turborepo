function attachTCPopup() {
    const hostname = window.location.hostname;
    let urlWithHostname = "https://offsiteinventory.vercel.app";
    if (hostname) {
        urlWithHostname += "/" + hostname;
    }
    const el = document.getElementById("open-tc-offsite-overlay-btn");
    if (el) {
        el.addEventListener("click", function () {
            var iframeSrc = urlWithHostname;

            // Check if overlay already exists, remove it if yes
            var existingOverlay = document.getElementById("overlay");
            if (existingOverlay) {
                document.body.removeChild(existingOverlay);
            }

            // Create overlay div
            var overlay = document.createElement("div");
            overlay.id = "overlay";
            overlay.style.display = "none";
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.zIndex = "1000"; // Set a high z-index value

            // Create close button
            var closeButton = document.createElement("div");
            closeButton.id = "closeButton";
            closeButton.textContent = "Close";
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.cursor = "pointer";
            closeButton.onclick = closeIframe;

            // Create iframe
            var iframe = document.createElement("iframe");
            iframe.id = "iframe";
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.src = iframeSrc;

            // Append elements to overlay
            overlay.appendChild(closeButton);
            overlay.appendChild(iframe);

            // Append overlay to body
            document.body.appendChild(overlay);

            // Show the overlay
            overlay.style.display = "flex";

            // Disable scrolling on the body
            document.body.style.overflow = "hidden";
        });
    }

    function closeIframe() {
        // Check if overlay exists before trying to close
        var overlay = document.getElementById("overlay");
        if (overlay) {
            // Hide the overlay
            overlay.style.display = "none";

            // Enable scrolling on the body
            document.body.style.overflow = "auto";

            // Clear the iframe source to stop loading content
            document.getElementById("iframe").src = "";

            // Remove overlay from the DOM
            document.body.removeChild(overlay);
        }
    }
}

// Wait for DOM to load
setTimeout(attachTCPopup, 5000);
