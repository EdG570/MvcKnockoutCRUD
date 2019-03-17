using KnockoutTake99.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace KnockoutTake99.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly AppDbContext _db;

        public EmployeeController()
        {
            _db = new AppDbContext();
        }

        // GET: Employee
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetIndex()
        {
            return Json(_db.Employees.ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Employee employee)
        {
            var newEmp = new Employee
            {
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Department = Convert.ToInt32(employee.Department)
            };

            if (ModelState.IsValid)
            {
                _db.Employees.Add(newEmp);
                _db.SaveChanges();
                
            }

            return Json(newEmp.Id);
        }

        [HttpPost]
        public JsonResult Edit(Employee employee)
        {
            if (ModelState.IsValid)
            {
                _db.Entry(employee).State = EntityState.Modified;
                _db.SaveChanges();
            }

            return Json(employee.Id);
        }

        [HttpPost]
        public JsonResult Delete(Employee employee)
        {
            var empToDelete = _db.Employees.Find(employee.Id);

            if (empToDelete == null)
            {
                throw new ArgumentException("Invalid Id was passed. Record could not be found in the database.");
            }

            try
            {
                _db.Employees.Remove(empToDelete);
                _db.SaveChanges();
            }
            catch (Exception e)
            {
                
            }

            return Json(empToDelete.Id);
        }

        public JsonResult GetDepartments()
        {
            var departments = new List<DepartmentList>
            {
                new DepartmentList { Id = 1, Name = "Finance" },
                new DepartmentList { Id = 2, Name = "Security" },
                new DepartmentList { Id = 3, Name = "Reporting" }
            };

            return Json(departments, JsonRequestBehavior.AllowGet);
        }
    }
}