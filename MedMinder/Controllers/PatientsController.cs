using MedMinder.Data;
using MedMinder.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MedMinder.Controllers
{ 
    public class PatientsController : BaseApiController
    {
        private readonly DataContext _context;
        public PatientsController(DataContext context)
        {
            _context = context;
        }
        [HttpGet("getallpatients")]
        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetAllPatients()
        {
            var result = await _context.Patients.Select(x => x).ToListAsync();

                return result;
        }

        [HttpPost("updatepatient")]
        public async Task<ActionResult<PatientViewModel>> UpdatePatient([FromBody]  PatientViewModel model)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(x => x.Id == model.Id);
            if (patient != null)
            {
                patient.FirstName = model.FirstName;
                patient.LastName = model.LastName;
                patient.City    = model.City;
                patient.Active = model.Active;

                await _context.SaveChangesAsync();
            }
            return patient;
        }

        [HttpPost("addpatient")]
        public async Task<ActionResult<PatientViewModel>> AddPatient([FromBody] PatientViewModel model)
        {
           _context.Patients.Add(model);
            await _context.SaveChangesAsync();

            return model;
        }

        [HttpPost("deletepatient")]
        public async Task<ActionResult<Boolean>> DeletePatient([FromBody] int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(x => x.Id == id);
            if (patient != null)
            {
               _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        [HttpPost("getpaged")]

        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetPaged([FromBody] SearchCriteria searchCriteria)
        {

            IQueryable<PatientViewModel> query =_context.Patients;
            var filter = searchCriteria.filterBy;
            var sort = searchCriteria.sortBy;
            var param = searchCriteria.searchString.ToLower();

            //Filter By Category
            switch(filter)
            {
                case "firstName":
                    query = query.Where(p => p.FirstName.ToLower().Contains(param));
                    break;
                case "lastName":
                    query = query.Where(p => p.LastName.ToLower().Contains(param));
                    break;
                case "city":
                    query = query.Where(p => p.City.ToLower().Contains(param));
                    break;
                case "active":
                    bool isActive = bool.Parse(param); // Convert string to bool
                    query = query.Where(p => p.Active == isActive);
                    break;
                default:
                    throw new ArgumentException("Invalid searchBy parameter");
            }

            //Sort by category

            switch (sort)
            {
                case "firstName":
                    query = query.OrderBy(p => p.FirstName);
                    break;
                case "lastName":
                    query = query.OrderBy(p => p.LastName);
                    break;
                case "city":
                    query = query.OrderBy(p => p.City);
                    break;
                case "active":
                    bool isActive = bool.Parse(param); // Convert string to bool
                    query = query.Where(p => p.Active == isActive);
                    break;
                default:
                    throw new ArgumentException("Invalid sortBy parameter");
            }
            var result = await query.ToListAsync();
            return result;
        }

    }
}
