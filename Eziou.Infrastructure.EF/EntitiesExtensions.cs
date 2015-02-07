using System.Data.Entity.Validation;
using System.Text;

namespace Eziou.Infrastructure.EF
{
    public partial class Entities
    {
        public override int SaveChanges()
        {
            //From http://stackoverflow.com/questions/15820505/dbentityvalidationexception-how-can-i-easily-tell-what-caused-the-error
            try
            {
                return base.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                StringBuilder errorMessages = new StringBuilder();
                errorMessages.AppendLine(ex.Message);
                errorMessages.AppendLine("The validation errors are:");

                var count = 0;
                foreach (var item in ex.EntityValidationErrors)
                {
                    foreach (var error in item.ValidationErrors)
                    {
                        errorMessages.AppendLine(string.Format("{0}: {1} for {2}", ++count, error.ErrorMessage, item.Entry.Entity.GetType().Name));
                    }
                }

                // Throw a new DbEntityValidationException with the improved exception message.
                throw new DbEntityValidationException(errorMessages.ToString(), ex.EntityValidationErrors);
            }
        }

        public override System.Threading.Tasks.Task<int> SaveChangesAsync()
        {
            try
            {
                return base.SaveChangesAsync();
            }
            catch (DbEntityValidationException ex)
            {
                StringBuilder errorMessages = new StringBuilder();
                errorMessages.AppendLine(ex.Message);
                errorMessages.AppendLine("The validation errors are:");

                var count = 0;
                foreach (var item in ex.EntityValidationErrors)
                {
                    foreach (var error in item.ValidationErrors)
                    {
                        errorMessages.AppendLine(string.Format("{0}: {1} for {2}", ++count, error.ErrorMessage, item.Entry.Entity.GetType().Name));
                    }
                }

                // Throw a new DbEntityValidationException with the improved exception message.
                throw new DbEntityValidationException(errorMessages.ToString(), ex.EntityValidationErrors);
            }
        }
    }
}