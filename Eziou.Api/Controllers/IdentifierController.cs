using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace Eziou.Api.Controllers
{
    [RoutePrefix("api/id")]
    public class IdentifierController : ApiController
    {
        [Route(""), HttpGet]
        public Guid Get()
        {
            return Guid.NewGuid();
        }
    }
}