var validateErrorMessages = (function () {
    var lastNameErrMsg = $('#last-name-err');
    var firstNameErrMsg = $('#first-name-err');

    var hideAll = function () {
        lastNameErrMsg.hide();
        firstNameErrMsg.hide();
    };

    var showLastName = function () {
        lastNameErrMsg.show();
    };

    var hideLastName = function () {
        lastNameErrMsg.hide();
    };

    var showFirstName = function () {
        firstNameErrMsg.show();
    };

    var hideFirstName = function () {
        firstNameErrMsg.hide();
    };

    return {
        hideAll: hideAll,
        showLastName: showLastName,
        showFirstName: showFirstName,
        hideLastName: hideLastName,
        hideFirstName: hideFirstName
    };
}());

var ajaxAlerts = (function () {
    var successCreate = $('#success-message-create');
    var errorAlert = $('#alert-error-message');
    var successDelete = $('#success-message-delete');

    var hideSuccessCreate = function (speed) {
        successCreate.hide(speed);
    };

    var showSuccessCreate = function () {
        successCreate.show();
        setTimeout(function () {
            hideSuccessCreate("slow");
        }, 5000);
    };

    var hideSuccessDelete = function (speed) {
        successDelete.hide(speed);
    };

    var showSuccessDelete = function () {
        successDelete.show();
        setTimeout(function () {
            hideSuccessDelete("slow");
        }, 5000);
    };

    var hideErrorAlert = function (speed) {
        errorAlert.hide(speed);
    };

    var showError = function () {
        errorAlert.show();
        setTimeout(function () {
            hideErrorAlert("slow");
        }, 5000);
    };

    return {
        hideSuccessCreate: hideSuccessCreate,
        showSuccessCreate: showSuccessCreate,
        hideErrorAlert: hideErrorAlert,
        showError: showError,
        hideSuccessDelete: hideSuccessDelete,
        showSuccessDelete: showSuccessDelete
    };
}());

function Department(id, name) {
    var self = this;

    self.Id = id;
    self.Name = name;
}

function Employee(id, firstName, lastName, department, mode) {
    var self = this;

    self.Id = ko.observable(id);
    self.FirstName = ko.observable(firstName);
    self.LastName = ko.observable(lastName);
    self.Mode = ko.observable(mode);
    self.Department = ko.observable(department);

    self.getFullName = function() {
        return self.LastName() + ', ' + self.FirstName();
    };
}

function EmployeeViewModel() {
    var self = this;

    self.Employees = ko.observableArray();

    // Dropdowns
    self.Departments = ko.observableArray();
    self.SelectedDepartment = ko.observable();

    // GET Employees
    $.ajax({
        type: "GET",
        url: "/Employee/GetIndex",
        format: "json",
        success: function (data) {
            $(data).each(function (index, item) {
                var emp = new Employee(item.Id, item.FirstName, item.LastName, item.Department, 'read');
                self.Employees.push(emp);
            });
        },
        error: function () {
            alert("Error");
        }
    });

    self.getDepartments = function () {
        $.ajax({
            type: "GET",
            url: "/Employee/GetDepartments",
            format: "json",
            success: function (data) {
                $(data).each(function (index, item) {
                    var department = new Department(item.Id, item.Name);
                    self.Departments.push(department);
                });
            },
            error: function () {
                ajaxAlerts.showError();
            }
        });
    };

    self.showCreate = function () {
        var createRow = new Employee(0, '', '', '', 'create');
        self.Employees.unshift(createRow);
    };

    self.removeCreateRow = function (item, event) {
        $(event.target).parent('td').parent('tr').remove();
        validateErrorMessages.hideAll();
    };

    self.createNewEmp = function (newEmp, event) {
        newEmp.FirstName().length < 2 ? validateErrorMessages.showFirstName() : validateErrorMessages.hideFirstName();
        newEmp.LastName().length < 2 ? validateErrorMessages.showLastName() : validateErrorMessages.hideLastName();

        var newEmpObj = {
            FirstName: newEmp.FirstName(),
            LastName: newEmp.LastName(),
            Department: parseInt(self.SelectedDepartment())
        };

        $.ajax({
            type: "POST",
            url: "/Employee/Create",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(newEmpObj),
            success: function (id) {
                newEmp.Id(id);
                newEmp.Department(self.SelectedDepartment());
                newEmp.Mode('read');
                ajaxAlerts.showSuccessCreate();
            },
            error: function () {
                ajaxAlerts.showError();
            }
        });
    };

    self.displayEditMode = function (emp, event) {
        self.SelectedDepartment = emp.Department();
        emp.Mode('edit');
    };

    self.cancelEditMode = function (emp, event) {
        emp.Mode('read');
    };

    self.deleteEmp = function (emp, event) {
        var empObj = {
            Id: emp.Id(),
            FirstName: emp.FirstName(),
            LastName: emp.LastName(),
            Department: emp.Department()
        };

        $.ajax({
            type: "POST",
            url: "/Employee/Delete",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(empObj),
            success: function (id) {
                self.Employees.remove(emp);
                ajaxAlerts.showSuccessDelete();
            },
            error: function () {
                ajaxAlerts.showError();
            }
        });
    };

    self.updateEmp = function (emp, event) {
        var empObj = {
            Id: emp.Id(),
            FirstName: emp.FirstName(),
            LastName: emp.LastName(),
            Department: parseInt(emp.Department())
        };

        $.ajax({
            type: "POST",
            url: "/Employee/Edit",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(empObj),
            success: function (id) {
                emp.Mode('read');
            },
            error: function () {
                ajaxAlerts.showError();
            }
        });
    };

    self.getEmployeeCount = ko.computed(function () {
        var count = 0;

        ko.utils.arrayForEach(self.Employees(), function (item) {
            console.log(item);
            if (item.Id() > 0) count++;
        });

        return count;
    });

    self.initialize = (function () {
        if (self.Departments().length === 0) {
            self.getDepartments();
        }  
    }());
}


$(document).ready(function () {
    ko.applyBindings(new EmployeeViewModel(), document.getElementById('emps'));
});