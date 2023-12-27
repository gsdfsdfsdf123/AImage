const input = document.getElementById("file-input");
const inputURL = document.getElementById("paste");
const browse = document.getElementById("browse");
const dragArea = document.getElementById("drop");
const msg = document.querySelector('.help-message');
let file;

function Browse() {
  input.click();
  input.addEventListener("change", async(e) => {
  file = e.target.files[0];
  const data = new FormData();
  data.append("image_file", file,"image_file");
  const response = await fetch("/detect",{
      method:"post",
      body: data
    });
    const boxes = await response.json();
    draw_image_and_boxes(file, boxes);
  });
}

dragArea.addEventListener('dragenter', (e) =>  {
  e.preventDefault();
  dragArea.classList.add('active');
});

dragArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragArea.classList.remove('active');
});

// Доделать
dragArea.addEventListener('drop', (e) => {
  e.preventDefault();
  file = e.dataTransfer.files[0];
  input.addEventListener("change", async(e) => {
  const data = new FormData();
  data.append("image_file", file,"image_file");
  const response = await fetch("/detect",{
      method:"post",
      body: data
    });
    const boxes = await response.json();
    draw_image_and_boxes(file, boxes);
  });
  dragArea.classList.remove('active');
});

// Сделать input paste

function draw_image_and_boxes(file, boxes) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
      const canvas = document.querySelector("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img,0,0);
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      ctx.font = "18px serif";
      boxes.forEach(([x1,y1,x2,y2,label]) => {
          ctx.strokeRect(x1,y1,x2-x1,y2-y1);
          ctx.fillStyle = "#00ff00";
          const width = ctx.measureText(label).width;
          ctx.fillRect(x1,y1,width+10,25);
          ctx.fillStyle = "#000000";
          ctx.fillText(label, x1, y1+18);
      });
  }
}