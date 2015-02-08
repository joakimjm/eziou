using Eziou.Core.Model;
using Eziou.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Eziou.Api.Controllers
{
    [RoutePrefix("api/events")]
    public class EventController : ApiController
    {
        private readonly EventRepository eventRepo;

        public EventController()
        {
            this.eventRepo = new EventRepository();
        }

        //public EventController(EventRepository eventRepo)
        //{
        //    this.eventRepo = eventRepo;
        //}

        [Route("{id}"), Route("{id}.{ext}"), HttpGet, ResponseType(typeof(Core.Model.Event))]
        public async Task<IHttpActionResult> GetEventAsync(Guid id)
        {
            var result = await eventRepo.GetAsync(id);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound();
        }

        [Route(""), HttpPost, ResponseType(typeof(Core.Model.Event))]
        public async Task<IHttpActionResult> CreateEventAsync(Core.Model.Event obj)
        {
            var result = await eventRepo.CreateAsync(obj);

            return Created(Request.RequestUri.ToString() + "/" + result.Id, result);
        }

        [Route("{id}"), HttpPut, ResponseType(typeof(Core.Model.Event))]
        public async Task<IHttpActionResult> SaveEventAsync(Core.Model.Event obj)
        {
            var result = await eventRepo.SaveAsync(obj);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound();
        }
    }
}
