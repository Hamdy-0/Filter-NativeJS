const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const undo = document.getElementById("undoChanges");
const downloadBtn = document.getElementById("downloadBtn");
const filterSelect = document.getElementById("selectFilter");
const applyFilter = document.getElementById("applyFilter");
const uploadBtn = document.getElementById("cheese");

let originalImageData;

canvas.width = 400;
canvas.height = 400;
window.addEventListener("resize", function () {
  canvas.width = 400;
  canvas.height = 400;
});

uploadBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    const spinner = createSpinner();

    reader.onload = (e) => {
      removeSpinner(spinner);
      hideSpinner();
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
});
function createSpinner() {
  const spinner = document.createElement("div");
  spinner.classList.add("loader");

  const canvas = document.getElementById("canvas1");
  const canvasRect = canvas.getBoundingClientRect();

  spinner.style.position = "absolute";
  spinner.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
  spinner.style.left = `${canvasRect.left + canvasRect.width / 2}px`;

  canvas.appendChild(spinner);

  return spinner;
}
function removeSpinner(spinner) {
  if (spinner && spinner.parentNode) {
    spinner.parentNode.removeChild(spinner);
  }
}

function showSpinner() {}
function hideSpinner() {}
applyFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const value = filterSelect.value;
  if (originalImageData) {
    const modifiedImageData = filter(value, originalImageData);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(modifiedImageData, 0, 0);
  }
});

function filter(value, data) {
  let newData;

  switch (value) {
    case "blackAndWhite":
      newData = apllyBlackAwhite(data);
      break;
    case "reverse":
      newData = applyReverse(data);
      break;
    case "sepia":
      newData = applySepia(data);
      break;
    case "yellow":
      newData = applyYellow(data);
      break;
    case "cyan":
      newData = apllyCyan(data);
      break;
    default:
      newData = data; // Handle default case by returning original data
      break;
  }

  return newData;
}

function applySepia(imageData) {
  const data = imageData.data.slice();
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const sepiaRed = Math.min(255, 0.393 * red + 0.769 * green + 0.189 * blue);
    const sepiaGreen = Math.min(
      255,
      0.349 * red + 0.686 * green + 0.168 * blue
    );
    const sepiaBlue = Math.min(255, 0.272 * red + 0.534 * green + 0.131 * blue);
    data[i] = sepiaRed;
    data[i + 1] = sepiaGreen;
    data[i + 2] = sepiaBlue;
  }
  return new ImageData(data, imageData.width, imageData.height);
}
function apllyBlackAwhite(imageData) {
  const data = imageData.data.slice();
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  return new ImageData(data, imageData.width, imageData.height);
}
function applyReverse(imageData) {
  const data = imageData.data.slice();
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  return new ImageData(data, imageData.width, imageData.height);
}
function applyYellow(imageData) {
  const data = imageData.data.slice();
  for (let i = 0; i < data.length; i += 4) {
    data[i] += 100; //  red
    data[i + 1] += 100; //  green
  }
  return new ImageData(data, imageData.width, imageData.height);
}

function apllyCyan(imageData) {
  const data = imageData.data.slice();
  for (let i = 0; i < data.length; i += 4) {
    data[i] -= 50; //  red

    data[i + 2] -= 50; //  green
  }
  return new ImageData(data, imageData.width, imageData.height);
}

undo.addEventListener("click", () => {
  if (originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
  }
});

downloadBtn.addEventListener("click", downloadImage);

function downloadImage() {
  const filename = `image_${Date.now()}.png`;
  const dataUrl = canvas.toDataURL("image/png");
  downloadBtn.href = dataUrl;
  downloadBtn.download = filename;
}
