let employees = [];


/* =========================================
   LOAD EMPLOYEES
========================================= */

async function loadEmployees() {

    try {

        const response = await fetch("/employees");

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const data = await response.json();

        console.log("API DATA:", data);

        employees = data;

        displayEmployees();

        updateStatistics();

    } catch (error) {

        console.error("LOAD ERROR:", error);

        showNotification(
            "Unable to load employees",
            "error"
        );

    }
}


/* =========================================
   DISPLAY EMPLOYEES
========================================= */

function displayEmployees(list = employees) {

    const table =
        document.getElementById("employeeTable");

    if (!table) {
        console.error("employeeTable not found");
        return;
    }

    table.innerHTML = "";


    if (!list || list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No employees found
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function(employee) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${employee.id}</td>

            <td>
                <div class="employee-name">
                    ${escapeHtml(employee.name)}
                </div>
            </td>

            <td>
                ${escapeHtml(employee.email)}
            </td>

            <td>
                <span class="department">
                    ${escapeHtml(employee.department || "N/A")}
                </span>
            </td>

            <td>
                ₹${Number(
                    employee.salary || 0
                ).toLocaleString("en-IN")}
            </td>

            <td>

                <div class="actions">

                    <button
                        class="edit-button"
                        onclick="openEditModal(${employee.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteEmployee(${employee.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>
        `;


        table.appendChild(row);

    });

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total =
        employees.length;


    document.getElementById(
        "totalEmployees"
    ).textContent = total;


    const departments =
        new Set(
            employees
                .map(function(employee) {
                    return employee.department;
                })
                .filter(Boolean)
        );


    document.getElementById(
        "totalDepartments"
    ).textContent =
        departments.size;


    let totalSalary = 0;


    employees.forEach(function(employee) {

        totalSalary +=
            Number(employee.salary || 0);

    });


    const average =
        employees.length
            ? totalSalary / employees.length
            : 0;


    document.getElementById(
        "averageSalary"
    ).textContent =
        "₹" +
        Math.round(average)
            .toLocaleString("en-IN");
}


/* =========================================
   ADD MODAL
========================================= */

function openAddModal() {

    document
        .getElementById("addModal")
        .classList.add("show");

}


function closeAddModal() {

    document
        .getElementById("addModal")
        .classList.remove("show");


    document
        .getElementById("addEmployeeForm")
        .reset();

}


/* =========================================
   ADD EMPLOYEE
========================================= */

async function addEmployee(event) {

    event.preventDefault();


    const employee = {

        name:
            document
                .getElementById("employeeName")
                .value
                .trim(),

        email:
            document
                .getElementById("employeeEmail")
                .value
                .trim(),

        department:
            document
                .getElementById("employeeDepartment")
                .value
                .trim(),

        salary:
            Number(
                document
                    .getElementById("employeeSalary")
                    .value
            )

    };


    try {

        const response =
            await fetch(
                "/employees",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(employee)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Unable to add employee"
            );

        }


        closeAddModal();


        showNotification(
            "Employee added successfully",
            "success"
        );


        await loadEmployees();


    } catch (error) {

        console.error(error);


        showNotification(
            error.message,
            "error"
        );

    }

}


/* =========================================
   EDIT MODAL
========================================= */

function openEditModal(id) {

    const employee =
        employees.find(function(item) {

            return Number(item.id) === Number(id);

        });


    if (!employee) {

        console.error(
            "Employee not found:",
            id
        );

        return;

    }


    document.getElementById(
        "editEmployeeId"
    ).value = employee.id;


    document.getElementById(
        "editEmployeeName"
    ).value = employee.name;


    document.getElementById(
        "editEmployeeEmail"
    ).value = employee.email;


    document.getElementById(
        "editEmployeeDepartment"
    ).value =
        employee.department || "";


    document.getElementById(
        "editEmployeeSalary"
    ).value =
        employee.salary;


    document
        .getElementById("editModal")
        .classList.add("show");

}


function closeEditModal() {

    document
        .getElementById("editModal")
        .classList.remove("show");

}


/* =========================================
   UPDATE EMPLOYEE
========================================= */

async function updateEmployee(event) {

    event.preventDefault();


    const id =
        document
            .getElementById("editEmployeeId")
            .value;


    const employee = {

        name:
            document
                .getElementById("editEmployeeName")
                .value
                .trim(),

        email:
            document
                .getElementById("editEmployeeEmail")
                .value
                .trim(),

        department:
            document
                .getElementById("editEmployeeDepartment")
                .value
                .trim(),

        salary:
            Number(
                document
                    .getElementById("editEmployeeSalary")
                    .value
            )

    };


    try {

        const response =
            await fetch(
                `/employees/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(employee)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Unable to update employee"
            );

        }


        closeEditModal();


        showNotification(
            "Employee updated successfully",
            "success"
        );


        await loadEmployees();


    } catch (error) {

        console.error(error);


        showNotification(
            error.message,
            "error"
        );

    }

}


/* =========================================
   DELETE
========================================= */

async function deleteEmployee(id) {

    const employee =
        employees.find(function(item) {

            return Number(item.id) === Number(id);

        });


    if (!employee) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${employee.name}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/employees/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Unable to delete employee"
            );

        }


        showNotification(
            "Employee deleted successfully",
            "success"
        );


        await loadEmployees();


    } catch (error) {

        console.error(error);


        showNotification(
            error.message,
            "error"
        );

    }

}


/* =========================================
   SEARCH
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const search =
            document.getElementById(
                "searchInput"
            );


        search.addEventListener(
            "input",
            function() {

                const value =
                    this.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    employees.filter(
                        function(employee) {

                            return (

                                String(
                                    employee.name || ""
                                )
                                    .toLowerCase()
                                    .includes(value)

                                ||

                                String(
                                    employee.email || ""
                                )
                                    .toLowerCase()
                                    .includes(value)

                                ||

                                String(
                                    employee.department || ""
                                )
                                    .toLowerCase()
                                    .includes(value)

                            );

                        }
                    );


                displayEmployees(filtered);

            }
        );


        loadEmployees();

    }
);


/* =========================================
   CLOSE MODAL OUTSIDE
========================================= */

window.addEventListener(
    "click",
    function(event) {

        const addModal =
            document.getElementById("addModal");

        const editModal =
            document.getElementById("editModal");


        if (event.target === addModal) {
            closeAddModal();
        }


        if (event.target === editModal) {
            closeEditModal();
        }

    }
);


/* =========================================
   ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeAddModal();

            closeEditModal();

        }

    }
);


/* =========================================
   NOTIFICATION
========================================= */

function showNotification(
    message,
    type
) {

    const notification =
        document.getElementById(
            "notification"
        );


    const messageElement =
        document.getElementById(
            "notificationMessage"
        );


    messageElement.textContent =
        message;


    notification.className =
        "notification " +
        type +
        " show";


    setTimeout(
        function() {

            notification.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null ? "" : value;

    return div.innerHTML;

}