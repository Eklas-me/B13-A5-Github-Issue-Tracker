var isLoggedIn = localStorage.getItem("isLoggedIn");
if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}

var allIssues = [];
var currentTab = "all";

var issuesContainer = document.getElementById("issuesContainer");
var loadingSpinner = document.getElementById("loadingSpinner");
var issueCount = document.getElementById("issueCount");
var searchInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var issueModal = document.getElementById("issueModal");
var modalContent = document.getElementById("modalContent");

var tabAll = document.getElementById("tabAll");
var tabOpen = document.getElementById("tabOpen");
var tabClosed = document.getElementById("tabClosed");


function loadIssues() {

    loadingSpinner.classList.remove("hidden");
    issuesContainer.innerHTML = "";

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {

            loadingSpinner.classList.add("hidden");


            allIssues = result.data;


            displayIssues(allIssues);
        })
        .catch(function (error) {
            loadingSpinner.classList.add("hidden");
            issuesContainer.innerHTML = "<p class='text-red-500 text-center col-span-4'>Failed to load issues. Please try again.</p>";
            console.log("Error:", error);
        });
}


function displayIssues(issues) {

    issuesContainer.innerHTML = "";


    issueCount.textContent = issues.length + " Issues";


    for (var i = 0; i < issues.length; i++) {
        var issue = issues[i];


        var card = document.createElement("div");


        if (issue.status === "open") {
            card.className = "issue-card card-open";
        } else {
            card.className = "issue-card card-closed";
        }


        var priorityClass = "";
        if (issue.priority === "high") {
            priorityClass = "priority-high";
        } else if (issue.priority === "medium") {
            priorityClass = "priority-medium";
        } else {
            priorityClass = "priority-low";
        }


        var labelsHTML = "";
        for (var j = 0; j < issue.labels.length; j++) {
            var label = issue.labels[j];
            var labelClass = getLabelClass(label);
            labelsHTML = labelsHTML + '<span class="label-badge ' + labelClass + '">' + label + '</span>';
        }


        var date = new Date(issue.createdAt);
        var formattedDate = date.toLocaleDateString();


        var statusIcon = "";
        if (issue.status === "open") {
            statusIcon = '<img src="assets/Open-Status.png" alt="open" class="w-5 h-5">';
        } else {
            statusIcon = '<img src="assets/Closed- Status .png" alt="closed" class="w-5 h-5">';
        }


        card.innerHTML =
            '<div class="flex justify-between items-center mb-3">' +
            statusIcon +
            '<span class="priority-badge ' + priorityClass + '">' + issue.priority + '</span>' +
            '</div>' +
            '<h3 class="text-sm font-bold text-gray-800 line-clamp-2 mb-2">' + issue.title + '</h3>' +
            '<p class="text-xs text-gray-500 mb-3 line-clamp-2">' + issue.description + '</p>' +
            '<div class="mb-3">' + labelsHTML + '</div>' +
            '<div class="flex items-center justify-between text-xs text-gray-400">' +
            '<span>#' + issue.id + ' By ' + issue.author + '</span>' +
            '<span>' + formattedDate + '</span>' +
            '</div>';


        card.setAttribute("data-id", issue.id);
        card.addEventListener("click", function () {
            var id = this.getAttribute("data-id");
            openModal(id);
        });


        issuesContainer.appendChild(card);
    }
}


function getLabelClass(label) {
    if (label === "bug") {
        return "label-bug";
    } else if (label === "enhancement") {
        return "label-enhancement";
    } else if (label === "help wanted") {
        return "label-help-wanted";
    } else if (label === "documentation") {
        return "label-documentation";
    } else if (label === "good first issue") {
        return "label-good-first-issue";
    } else {
        return "label-bug";
    }
}


function filterIssues(tab) {
    currentTab = tab;


    tabAll.className = "tab-btn";
    tabOpen.className = "tab-btn";
    tabClosed.className = "tab-btn";


    if (tab === "all") {
        tabAll.className = "tab-btn active-tab";
        displayIssues(allIssues);
    } else if (tab === "open") {
        tabOpen.className = "tab-btn active-tab";

        var openIssues = [];
        for (var i = 0; i < allIssues.length; i++) {
            if (allIssues[i].status === "open") {
                openIssues.push(allIssues[i]);
            }
        }
        displayIssues(openIssues);
    } else if (tab === "closed") {
        tabClosed.className = "tab-btn active-tab-closed";

        var closedIssues = [];
        for (var i = 0; i < allIssues.length; i++) {
            if (allIssues[i].status === "closed") {
                closedIssues.push(allIssues[i]);
            }
        }
        displayIssues(closedIssues);
    }
}


function openModal(issueId) {

    modalContent.innerHTML = '<div class="flex justify-center py-10"><span class="loading loading-spinner loading-md text-purple-600"></span></div>';
    issueModal.classList.remove("hidden");


    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issue/" + issueId)
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            var issue = result.data;


            var statusClass = "";
            if (issue.status === "open") {
                statusClass = "status-open";
            } else {
                statusClass = "status-closed";
            }


            var priorityClass = "";
            if (issue.priority === "high") {
                priorityClass = "priority-high";
            } else if (issue.priority === "medium") {
                priorityClass = "priority-medium";
            } else {
                priorityClass = "priority-low";
            }


            var labelsHTML = "";
            for (var i = 0; i < issue.labels.length; i++) {
                var labelClass = getLabelClass(issue.labels[i]);
                labelsHTML = labelsHTML + '<span class="label-badge ' + labelClass + '">' + issue.labels[i] + '</span>';
            }


            var date = new Date(issue.createdAt);
            var formattedDate = date.toLocaleDateString();


            var assigneeName = issue.assignee;
            if (assigneeName === "" || assigneeName === null || assigneeName === undefined) {
                assigneeName = "Not assigned";
            }


            modalContent.innerHTML =
                '<h2 class="text-xl font-bold text-gray-800 mb-3">' + issue.title + '</h2>' +
                '<div class="flex items-center gap-2 mb-4">' +
                '<span class="' + statusClass + '">' + issue.status + '</span>' +
                '<span class="text-sm text-gray-500">Opened by ' + issue.author + ' • ' + formattedDate + '</span>' +
                '</div>' +
                '<div class="mb-4">' + labelsHTML + '</div>' +
                '<div class="bg-gray-50 p-4 rounded-lg mb-4">' +
                '<p class="text-sm text-gray-700">' + issue.description + '</p>' +
                '</div>' +
                '<div class="grid grid-cols-2 gap-4 mb-5">' +
                '<div>' +
                '<p class="text-xs text-gray-400 mb-1">Assignee:</p>' +
                '<p class="text-sm font-medium text-gray-700">' + assigneeName + '</p>' +
                '</div>' +
                '<div>' +
                '<p class="text-xs text-gray-400 mb-1">Priority:</p>' +
                '<span class="priority-badge ' + priorityClass + '">' + issue.priority + '</span>' +
                '</div>' +
                '</div>' +
                '<button onclick="closeModal()" class="btn btn-sm w-full text-white" style="background-color: #6c3beb;">Close</button>';
        })
        .catch(function (error) {
            modalContent.innerHTML = '<p class="text-red-500 text-center">Failed to load issue details.</p>';
            console.log("Error:", error);
        });
}



function closeModal(event) {

    if (event && event.target !== event.currentTarget) {
        return;
    }
    issueModal.classList.add("hidden");
}



searchBtn.addEventListener("click", function () {
    searchIssues();
});


searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchIssues();
    }
});

function searchIssues() {
    var searchText = searchInput.value.trim();


    if (searchText === "") {
        filterIssues(currentTab);
        return;
    }


    loadingSpinner.classList.remove("hidden");
    issuesContainer.innerHTML = "";


    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=" + searchText)
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            loadingSpinner.classList.add("hidden");

            if (result.data && result.data.length > 0) {
                displayIssues(result.data);
            } else {
                issuesContainer.innerHTML = '<p class="text-gray-500 text-center col-span-4 py-10">No issues found for "' + searchText + '"</p>';
                issueCount.textContent = "0 Issues";
            }
        })
        .catch(function (error) {
            loadingSpinner.classList.add("hidden");
            issuesContainer.innerHTML = "<p class='text-red-500 text-center col-span-4'>Search failed. Please try again.</p>";
            console.log("Error:", error);
        });
}


loadIssues();
