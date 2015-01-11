using Eziou.Infrastructure.EF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Eziou.Data
{
    public class EventRepository
    {
        private Mapper mapper;

        public EventRepository()
        {
            var instance = System.Data.Entity.SqlServer.SqlProviderServices.Instance;

            this.mapper = new Mapper();
        }

        public async Task<Core.Model.Event> GetAsync(Guid id)
        {
            using (var ctx = new Entities())
            {
                var dbItem = await ctx.Events
                    .Include(x => x.Participants.Select(y => y.ProvidedItems))
                    .Include(x => x.Participants.Select(y => y.ConsumedItems))
                    .FirstOrDefaultAsync(x => x.Id == id);

                var result = mapper.Map<Core.Model.Event>(dbItem);

                var participants = new List<Core.Model.Participant>();

                foreach (var dbParticipant in dbItem.Participants)
                {
                    var participant = mapper.Map<Core.Model.Participant>(dbParticipant);
                    participants.Add(participant);

                    participant.PurchasedItems = mapper.Map<Item, Core.Model.Item>(dbParticipant.ProvidedItems);
                    participant.Items = mapper.Map<Item, Core.Model.Item>(dbParticipant.ConsumedItems);
                }

                result.Participants = participants;

                return result;
            };
        }

        public async Task<Core.Model.Event> SaveAsync(Core.Model.Event obj)
        {
            var id = obj.Id;

            if (obj.Id != Guid.Empty)
            {
                await UpdateAsync(obj);
            }
            else
            {
                id = await CreateAsync(obj);
            }

            return await GetAsync(id);
        }

        private async Task<Guid> CreateAsync(Core.Model.Event obj)
        {
            using (var ctx = new Entities())
            {
                var dbEvent = ctx.Events.Add(mapper.Map<Event>(obj));

                foreach (var participant in obj.Participants)
                {
                    var dbParticipant = ctx.Participants.Add(mapper.Map<Participant>(participant));
                    dbParticipant.Event = dbEvent;

                    foreach (var item in participant.PurchasedItems)
                    {
                        var dbItem = ctx.Items.Add(mapper.Map<Item>(item));
                        dbItem.Event = dbEvent;
                        dbItem.Provider = dbParticipant;
                    }
                }

                await ctx.SaveChangesAsync();

                return dbEvent.Id;
            }
        }

        private Task UpdateAsync(Core.Model.Event obj)
        {
            //using (var ctx = new Entities())
            //{
            //    var dbEvent = ctx.Events.Add(mapper.Map<Event>(obj));

            //    foreach (var participant in obj.Participants)
            //    {
            //        var dbParticipant = ctx.Participants.Add(mapper.Map<Participant>(participant));
            //        dbParticipant.Event = dbEvent;

            //        foreach (var item in participant.PurchasedItems)
            //        {
            //            var dbItem = ctx.Items.Add(mapper.Map<Item>(item));
            //            dbItem.Event = dbEvent;
            //            dbItem.Provider = dbParticipant;
            //        }
            //    }

            //    await ctx.SaveChangesAsync();

            //    return dbEvent.Id;
            //}

            return null;
        }

    }
}