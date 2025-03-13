self.onmessage = function () {
  setInterval(() => {
    postMessage("keep-alive");
  }, 5000);
};
