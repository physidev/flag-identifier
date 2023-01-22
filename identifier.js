let img1Element = document.getElementById('image1Src');
let input1Element = document.getElementById('fileInput1');
let img2Element = document.getElementById('image2Src');
let input2Element = document.getElementById('fileInput2');

input1Element.addEventListener('change', (e) => {
    img1Element.src = URL.createObjectURL(e.target.files[0]);
}, false);
input2Element.addEventListener('change', (e) => {
    img2Element.src = URL.createObjectURL(e.target.files[0]);
}, false);

img2Element.onload = function () {
    let src = cv.imread(img2Element);
    let dst = new cv.Mat();
    let ksize = new cv.Size(9, 9);
    cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);

    let cmp = cv.imread(img1Element);

    // find total distance between pixels
    let distanceSum = 0;
    let width = Math.min(cmp.size().width, dst.size().width);
    let height = Math.min(cmp.size().height, dst.size().height);
    for(let r=0; r < height; r++) {
        for(let c=0; c < width; c++) {
            let s = cmp.ucharPtr(r, c);
            let t = dst.ucharPtr(r, c);
            distanceSum += Math.sqrt(
                (s[0]-t[0])*(s[0]-t[0]) +
                (s[1]-t[1])*(s[1]-t[1]) +
                (s[2]-t[2])*(s[2]-t[2])
            );
        }
    }
    console.log(distanceSum);
    document.getElementById('distance').innerText = 'Distance: ' + distanceSum;

    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete();
};

function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
}