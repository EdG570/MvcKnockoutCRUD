using KnockoutTake99.Models;
using System.Collections.Generic;

namespace KnockoutTake99.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<KnockoutTake99.Models.AppDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(KnockoutTake99.Models.AppDbContext context)
        {
            var emps = new List<Employee>
            {
                new Employee { FirstName = "Bob", LastName = "Jones" },
                new Employee { FirstName = "Francis", LastName = "Slocum" },
                new Employee { FirstName = "Brad", LastName = "McDoogal" }
            };

            foreach (var emp in emps)
            {
                context.Employees.AddOrUpdate(emp);
            }
        }
    }
}
