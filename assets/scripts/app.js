const units = document.querySelector(".form__units");
const metricInputs = document.querySelectorAll(".form__inputs--metric label");
const form = document.querySelector(".form");


let bmiRanges;
let bmiWeight;
fetch("../../bmi.json").then(response => {
    return response.json();
}).then(obj => {
    bmiRanges = obj["bmiRanges"];
    bmiWeight = obj["metric"];
})

units.addEventListener("click", e => {
   if (e.target.id === "metric") {
    document.querySelector(".form__inputs--metric").style.display = "flex";
    document.querySelector(".form__inputs--imperial").style.display = "none";
    form.classList.add("metric-form");
    form.classList.remove("imperial-form");
   } else if (e.target.id == "imperial") {
    document.querySelector(".form__inputs--metric").style.display = "none";
    document.querySelector(".form__inputs--imperial").style.display = "flex";
    form.classList.add("imperial-form");
    form.classList.remove("metric-form");
   }
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const category = ["a healthy weight", "overweight", "obese"];
    let bmi;
    let bmiCat;
    let weightRange;

    if (e.target.classList.contains("metric-form")) {
        const height = parseFloat(document.querySelector("#metric-height").value);
        const weight = parseFloat(document.querySelector("#metric-weight").value);
        bmi = (weight / (height/100)**2).toFixed(1);

        for (let i = 0; i < bmiRanges.length; ++i) {
            let cur = bmiRanges[i];
            if (bmi >= cur[0] && bmi <= cur[1]) {
                bmiCat = i;
                break;
            }
        }

        for (let i = 0; i < bmiWeight.length; ++i) {
            if ((height >= bmiWeight[i]["height"]) && (height < bmiWeight[i+1]["height"])) {
                weightRange = bmiWeight[i]["weightRange"][bmiCat];
                break;
            }
        }

        const html = `
            <span>
                <h3>Your BMI is...</h3>
                <div class="bmi">${bmi}</div>
            </span>
            <p>Your BMI suggests you're ${category[bmiCat]}.
            Your ideal weight is between <span class="range">${weightRange[0]}kgs - ${weightRange[1]}kgs</span>.</p>
        `;

        document.querySelector(".results__welcome").style.display = "none";
        document.querySelector(".results__bmi").innerHTML = html;
        document.querySelector(".results__bmi").style.display = "flex";

        if (window.innerWidth >= 768) {
            document.querySelector(".results__bmi > span").classList.add("tablet-desktop");
        }
    } else {
        const ft = parseFloat(document.querySelector("#imperial-height-ft").value);
        const inches = parseFloat(document.querySelector("#imperial-height-in").value);
        let totalInches = (ft * 12) + inches;

        const st = parseFloat(document.querySelector("#imperial-weight-st").value);
        const lbs = parseFloat(document.querySelector("#imperial-weight-lbs").value);
        let totalLBS = (st * 14) + lbs

        bmi = (703 * totalLBS / totalInches**2).toFixed(1);

        for (let i = 0; i < bmiRanges.length; ++i) {
            let cur = bmiRanges[i];
            if (bmi >= cur[0] && bmi <= cur[1]) {
                bmiCat = i;
                break;
            }
        }

        let height = (totalInches * 2.54);
        for (let i = 0; i < bmiWeight.length; ++i) {
            if ((height >= bmiWeight[i]["height"]) && (height < bmiWeight[i+1]["height"])) {
                weightRange = bmiWeight[i]["weightRange"][bmiCat];
                break;
            }
        }

        let stLow = Math.floor((weightRange[0] * 2.2) / 14);
        let lbsLow = (weightRange[0] * 2.2) % 14;

        let stHigh = Math.floor((weightRange[1] * 2.2) / 14);
        let lbsHigh = (weightRange[1] * 2.2) % 14;

        const html = `
            <span>
                <h3>Your BMI is...</h3>
                <div class="bmi">${bmi}</div>
            </span>
            <p>Your BMI suggests you're ${category[bmiCat]}.
            Your ideal weight is between <span class="range">${stLow}st ${lbsLow.toFixed(0)}lbs - ${stHigh}st ${lbsHigh.toFixed(0)}lbs.</p>
        `;

        document.querySelector(".results__welcome").style.display = "none";
        document.querySelector(".results__bmi").innerHTML = html;
        document.querySelector(".results__bmi").style.display = "flex";
    }
});