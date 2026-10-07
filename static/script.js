const analyzeButton =
    document.getElementById("analyzeButton");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const chartTitle =
    document.getElementById("chartTitle");

let chart = null;


analyzeButton.addEventListener(
    "click",
    analyzeData
);


async function analyzeData() {

    const country1 =
        document.getElementById("country1").value;

    const country2 =
        document.getElementById("country2").value;

    const indicatorSelect =
        document.getElementById("indicator");

    const indicator =
        indicatorSelect.value;

    const indicatorName =
        indicatorSelect.options[
            indicatorSelect.selectedIndex
        ].text.trim();

    const startYear =
        document.getElementById("startYear").value;

    const endYear =
        document.getElementById("endYear").value;


    if (!startYear || !endYear) {

        showError(
            "Please enter both a start year and an end year."
        );

        return;
    }


    if (
        Number(startYear)
        >
        Number(endYear)
    ) {

        showError(
            "Start year cannot be after end year."
        );

        return;
    }


    hideError();

    loading.classList.remove("hidden");

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Loading...";


    try {

        const url =
            `/api/data?country1=${encodeURIComponent(country1)}` +
            `&country2=${encodeURIComponent(country2)}` +
            `&indicator=${encodeURIComponent(indicator)}` +
            `&start=${encodeURIComponent(startYear)}` +
            `&end=${encodeURIComponent(endYear)}`;


        const response =
            await fetch(url);


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Unable to load the data."
            );

        }


        updateChart(
            result.country1,
            result.country2,
            indicatorName
        );


        updateStatistics(
            result.country1,
            result.country2
        );


        chartTitle.textContent =
            `${indicatorName}: ` +
            `${result.country1.country} vs ` +
            `${result.country2.country}`;

    }

    catch (error) {

        console.error(error);

        showError(
            error.message
        );

    }

    finally {

        loading.classList.add("hidden");

        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analyze Data";

    }

}


function updateChart(
    country1,
    country2,
    indicatorName
) {

    const yearsSet =
        new Set();


    country1.data.forEach(
        item => {
            yearsSet.add(item.year);
        }
    );


    country2.data.forEach(
        item => {
            yearsSet.add(item.year);
        }
    );


    const years =
        Array
            .from(yearsSet)
            .sort(
                (a, b) => a - b
            );


    const country1Map = {};

    country1.data.forEach(
        item => {
            country1Map[item.year] =
                item.value;
        }
    );


    const country2Map = {};

    country2.data.forEach(
        item => {
            country2Map[item.year] =
                item.value;
        }
    );


    const country1Values =
        years.map(
            year =>
                country1Map[year] ?? null
        );


    const country2Values =
        years.map(
            year =>
                country2Map[year] ?? null
        );


    const canvas =
        document.getElementById(
            "dataChart"
        );


    const context =
        canvas.getContext("2d");


    if (chart !== null) {

        chart.destroy();

    }


    chart =
        new Chart(
            context,
            {

                type: "line",

                data: {

                    labels: years,

                    datasets: [

                        {
                            label:
                                country1.country,

                            data:
                                country1Values,

                            borderColor:
                                "#2563eb",

                            backgroundColor:
                                "rgba(37, 99, 235, 0.08)",

                            pointBackgroundColor:
                                "#2563eb",

                            borderWidth: 3,
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            tension: 0.25,
                            spanGaps: true
                        },

                        {
                            label:
                                country2.country,

                            data:
                                country2Values,

                            borderColor:
                                "#7c3aed",

                            backgroundColor:
                                "rgba(124, 58, 237, 0.08)",

                            pointBackgroundColor:
                                "#7c3aed",

                            borderWidth: 3,
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            tension: 0.25,
                            spanGaps: true
                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    interaction: {
                        mode: "index",
                        intersect: false
                    },


                    plugins: {

                        legend: {
                            position: "top"
                        },

                        tooltip: {

                            callbacks: {

                                label: function(
                                    context
                                ) {

                                    const value =
                                        context.raw;

                                    return (
                                        context.dataset.label +
                                        ": " +
                                        formatNumber(value)
                                    );

                                }

                            }

                        }

                    },


                    scales: {

                        x: {

                            title: {
                                display: true,
                                text: "Year"
                            }

                        },

                        y: {

                            beginAtZero: false,

                            title: {
                                display: true,
                                text: indicatorName
                            },

                            ticks: {

                                callback:
                                    function(
                                        value
                                    ) {

                                        return (
                                            formatNumber(value)
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


function updateStatistics(
    country1,
    country2
) {

    document.getElementById(
        "country1Title"
    ).textContent =
        country1.country;


    document.getElementById(
        "country2Title"
    ).textContent =
        country2.country;


    setStatistics(
        "country1",
        country1.statistics
    );


    setStatistics(
        "country2",
        country2.statistics
    );

}


function setStatistics(
    prefix,
    statistics
) {

    document.getElementById(
        `${prefix}Latest`
    ).textContent =
        formatNumber(statistics.latest);


    document.getElementById(
        `${prefix}Average`
    ).textContent =
        formatNumber(statistics.average);


    document.getElementById(
        `${prefix}Minimum`
    ).textContent =
        formatNumber(statistics.minimum);


    document.getElementById(
        `${prefix}Maximum`
    ).textContent =
        formatNumber(statistics.maximum);


    document.getElementById(
        `${prefix}Range`
    ).textContent =
        formatNumber(statistics.range);


    const change =
        statistics.percent_change;


    let changeText =
        `${change}%`;


    if (change > 0) {
        changeText =
            `+${change}%`;
    }


    document.getElementById(
        `${prefix}Change`
    ).textContent =
        changeText;

}


function formatNumber(value) {

    if (
        value === null
        ||
        value === undefined
    ) {
        return "--";
    }


    const number =
        Number(value);


    if (
        Math.abs(number)
        >=
        1000000000
    ) {
        return (
            number / 1000000000
        ).toFixed(2) + "B";
    }


    if (
        Math.abs(number)
        >=
        1000000
    ) {
        return (
            number / 1000000
        ).toFixed(2) + "M";
    }


    if (
        Math.abs(number)
        >=
        1000
    ) {

        return number.toLocaleString(
            undefined,
            {
                maximumFractionDigits: 2
            }
        );

    }


    return number.toFixed(2);
}


function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );

}


function hideError() {

    errorMessage.textContent = "";

    errorMessage.classList.add(
        "hidden"
    );

}


analyzeData();