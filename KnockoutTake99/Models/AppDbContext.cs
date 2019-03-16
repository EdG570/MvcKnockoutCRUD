using System.Data.Entity;

namespace KnockoutTake99.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
            :base("Default")
        {
            
        }

        public DbSet<Employee> Employees { get; set; }

    }
}