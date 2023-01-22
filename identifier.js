let img1Element = document.getElementById('image1Src');
let input1Element = document.getElementById('fileInput1');

const FLAG_WIDTH = 64;
const FLAG_HEIGHT = 32;
const SHEET_WIDTH = 8;

input1Element.addEventListener('change', (e) => {
    img1Element.src = URL.createObjectURL(e.target.files[0]);
}, false);

function identify(n) {
    let flg = cv.imread(img1Element);
    let flagsheet = cv.imread(document.getElementById('flagsheet'));
    cv.imshow('canvasOutput', flagsheet);

    lowestDistance = Infinity;
    lowestDistImg = new cv.Mat();

    for (let i = 0; i < n; i++) {
        console.log(i);
        let blr = flagsheet.roi(new cv.Rect(64*(i % SHEET_WIDTH), 32*Math.floor(i / SHEET_WIDTH), FLAG_WIDTH, FLAG_HEIGHT));
        cv.imshow("canvasOutput", blr);

        distanceSum = getDistance(flg, blr);
        console.log(i, distanceSum);

        if (distanceSum < lowestDistance) {
            lowestDistance = distanceSum;
            lowestDistImg = blr;
        }
    }

    cv.imshow("canvasOutput", lowestDistImg);
    document.getElementById('distance').innerText = 'Distance: ' + lowestDistance;

    flg.delete(); flagsheet.delete();
}

function getDistance(flag, blur) {
    let dst = new cv.Mat();
    let ksize = new cv.Size(9, 9);
    cv.GaussianBlur(blur, dst, ksize, 0, 0, cv.BORDER_DEFAULT);

    let distanceSum = 0;
    let width = Math.min(flag.size().width, dst.size().width);
    let height = Math.min(flag.size().height, dst.size().height);
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let s = flag.ucharPtr(r, c);
            let t = dst.ucharPtr(r, c);
            distanceSum += Math.sqrt(
                (s[0] - t[0]) * (s[0] - t[0]) +
                (s[1] - t[1]) * (s[1] - t[1]) +
                (s[2] - t[2]) * (s[2] - t[2])
            );
        }
    }

    dst.delete();
    return distanceSum;
}

function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
}