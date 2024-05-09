function attachTCPopup() {
  //Get hostname of the dealer to append in offsite url
  const hostname = window.location.hostname;
  let urlWithHostname = "https://offsiteinventory.vercel.app";
  if (hostname) {
    urlWithHostname += "/" + hostname;
  }
  const el = document.getElementById("open-tc-offsite-btn");
  if (el) {
    el.addEventListener("click", function () {
      //Get container to of div to append iframe
      var iframeContainer = document.getElementById("tc-iframe-container");

      // Create an iframe element
      var iframe = document.createElement("iframe");

      // Set the source
      iframe.src = urlWithHostname;

      // Set iframe attributes if needed
      iframe.width = "100%";
      iframe.height = "500px";

      // Append the iframe to the container
      if (iframeContainer) {
        iframeContainer.appendChild(iframe);
      }
    });
  }
}
// Wait for dom to load
setTimeout(attachTCPopup, 5000);
