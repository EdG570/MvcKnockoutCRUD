namespace KnockoutTake99.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDepartmentColumnToEmployee : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employees", "Department", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Employees", "Department");
        }
    }
}
