using MedMinder.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace MedMinder.Data
{
    public class DataContext: DbContext 
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<PatientViewModel> Patients { get; set; }
    }
}
