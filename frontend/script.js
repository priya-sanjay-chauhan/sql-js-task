document.getElementById("dateRangeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const errorMessage = document.getElementById("errorMessage");
    const dataTable = document.getElementById("dataTable");

    errorMessage.textContent = "";
    

  
    if (fromDate > toDate) {
        errorMessage.textContent = "'From Date' cannot be after 'To Date'.";
        dataTable.querySelector("tbody").innerHTML = "<tr><td colspan='8'>No data found</td></tr>";
            dataTable.querySelector("thead").innerHTML = "";

        return;
    }

 
    try {
        const response = await fetch(`http://localhost:5000/fetchData?fromDate=${fromDate}&toDate=${toDate}`);
        const data = await response.json();
        console.log(data);

        if (data && data.length > 0) {
            populateTable(data);
            
        } else {
            errorMessage.textContent = "No data found in this date range.";
            dataTable.querySelector("tbody").innerHTML = "<tr><td colspan='8'>No data found</td></tr>";
            dataTable.querySelector("thead").innerHTML = "";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
    }
});

function populateTable(data) {
    const dataTable = document.getElementById("dataTable");
    if (!dataTable) {
        console.error("Table element not found.");
        return;
    }

    const thead = dataTable.querySelector("thead");
    const tbody = dataTable.querySelector("tbody");
    
    thead.innerHTML = ""; 
    tbody.innerHTML = "";  

    
    const headerRow = document.createElement('tr');
    const headers = ['ID', 'Action Code', 'Action Text', 'Created By', 'Modified By', 'Created Date', 'Modified Date', 'Reason'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.id}</td>
                         <td>${item.action_code}</td>
                         <td>${item.action_text}</td>
                         <td>${item.created_by}</td>
                         <td>${item.modified_by}</td>
                         <td>${item.created_datetime}</td>
                         <td>${item.modified_datetime}</td>
                         <td>${item.reason_text}</td>`;
        tbody.appendChild(row);
    });
}


const fromDateInput = document.getElementById("fromDate");
const toDateInput = document.getElementById("toDate");
const fetchDataButton = document.getElementById("fetchDataButton");

function toggleFetchButton() {
    if (fromDateInput.value && toDateInput.value) {
        fetchDataButton.disabled = false;
    } else {
        fetchDataButton.disabled = true;
    }
}


fromDateInput.addEventListener("input", toggleFetchButton);
toDateInput.addEventListener("input", toggleFetchButton);