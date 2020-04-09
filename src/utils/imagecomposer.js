// to do: separate images loading from drawing on canvas
//        -> reuse already created image elements in subsequent calls ("customize" component)
export const imageComposer = (urls) => {
  let images = [];
  let promises = [];
  for (let url of urls) {
    let image = new Image();
    image.crossOrigin = "anonymous";
    // https://stackoverflow.com/questions/126772/how-to-force-a-web-browser-not-to-cache-images
    // to do: https://serverfault.com/questions/856904/chrome-s3-cloudfront-no-access-control-allow-origin-header-on-initial-xhr-req/856948#856948
    //        to enable caching in correct way
    image.src = url.includes("base64") ? url : url + "?" + performance.now();
    images.push(image);
    promises.push(setImageListeners(image));
  }
  let maxWidth = 0;
  let maxHeight = 0;
  return Promise.all(promises)
    .then(function () {
      maxWidth = Math.max.apply(
        Math,
        images.map(function (image) {
          return image.width;
        })
      );
      maxHeight = Math.max.apply(
        Math,
        images.map(function (image) {
          return image.height;
        })
      );
      var canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      var ctx = canvas.getContext("2d");
      for (let image of images) {
        ctx.drawImage(image, 0, 0);
      }
      let canvasDataUrl = canvas.toDataURL();
      const result = { width: maxWidth, height: maxHeight, url: canvasDataUrl };
      return result;
    })
    .catch((err) => console.error(err));
};

function setImageListeners(image) {
  return new Promise((resolve, reject) => {
    image.addEventListener("load", () => resolve());
    image.addEventListener("error", (err) => reject(err));
  });
}
