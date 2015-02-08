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

                if (dbItem == null)
                {
                    return null;
                }

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

        //public async Task<Core.Model.Event> SaveAsync(Core.Model.Event obj)
        //{
        //    var id = obj.Id;

        //    if (obj.Id != Guid.Empty)
        //    {
        //        await UpdateAsync(obj);
        //    }
        //    else
        //    {
        //        await CreateAsync(obj);
        //    }

        //    return await GetAsync(id);
        //}

        public async Task<Core.Model.Event> CreateAsync(Core.Model.Event obj)
        {
            using (var ctx = new Entities())
            {
                var dbEvent = ctx.Events.Add(mapper.Map<Event>(obj));
                dbEvent.ExpirationDate = DateTime.UtcNow.AddMonths(1);

                var dbItems = new List<Item>();
                var dbParticipants = new List<Participant>();

                foreach (var participant in obj.Participants)
                {
                    var dbParticipant = ctx.Participants.Add(mapper.Map<Participant>(participant));
                    dbParticipants.Add(dbParticipant);

                    dbParticipant.Event = dbEvent;

                    foreach (var item in participant.PurchasedItems)
                    {
                        var dbItem = ctx.Items.Add(mapper.Map<Item>(item));
                        dbItems.Add(dbItem);

                        dbItem.Event = dbEvent;
                        dbItem.Provider = dbParticipant;
                    }
                }

                foreach (var participant in obj.Participants)
                {
                    var dbParticipant = dbParticipants.First(x => x.Id == participant.Id);
                    foreach (var item in participant.Items)
                    {
                        dbParticipant.ConsumedItems.Add(dbItems.First(x => x.Id == item.Id));
                    }
                }

                await ctx.SaveChangesAsync();
            }

            return await GetAsync(obj.Id);
        }

        public async Task<Core.Model.Event> SaveAsync(Core.Model.Event obj)
        {
            using (var ctx = new Entities())
            {
                var dbEvent = await ctx.Events
                    .Include(x => x.Items)
                    .Include(x => x.Participants)
                    .Include(x => x.Participants.Select(y => y.ProvidedItems))
                    .Include(x => x.Participants.Select(y => y.ConsumedItems))
                    .FirstOrDefaultAsync(x => x.Id == obj.Id);

                dbEvent.Name = obj.Name;
                dbEvent.LastModified = DateTime.UtcNow;
                dbEvent.ExpirationDate = DateTime.UtcNow.AddMonths(1);

                var currentItems = new List<Item>();
                var currentParticipants = new List<Participant>();

                foreach (var participant in obj.Participants)
                {
                    var dbParticipant = dbEvent.Participants.FirstOrDefault(x => x.Id == participant.Id);
                    if (dbParticipant != null)
                    {
                        //Update participant
                        dbParticipant.Name = participant.Name;
                        dbParticipant.LastModified = DateTime.UtcNow;
                    }
                    else
                    {
                        //Create
                        dbParticipant = mapper.Map<Participant>(participant);
                        dbParticipant.ProvidedItems = new List<Item>();
                        dbEvent.Participants.Add(dbParticipant);
                        //ctx.Participants.Add(dbParticipant);
                        //await ctx.SaveChangesAsync();
                    }

                    currentParticipants.Add(dbParticipant);

                    foreach (var item in participant.PurchasedItems)
                    {
                        var dbItem = dbParticipant.ProvidedItems.FirstOrDefault(x => x.Id == item.Id);

                        if (dbItem != null)
                        {
                            //Update
                            dbItem.Name = item.Name;
                            dbItem.LastModified = DateTime.UtcNow;
                        }
                        else
                        {
                            //create
                            dbItem = mapper.Map<Item>(item);
                            //dbItem.ParticipantId = dbParticipant.Id;
                            dbEvent.Items.Add(dbItem);
                            dbParticipant.ProvidedItems.Add(dbItem);
                        }

                        currentItems.Add(dbItem);
                    }
                }

                /*
                 * Now that all participants and unique items have been saved,
                 * we can process consumed items
                 */

                //Clean up participants
                foreach (var participant in dbEvent.Participants)
                {
                    if (!currentParticipants.Any(x => x.Id == participant.Id))
                    {
                        dbEvent.Participants.Remove(participant);
                        continue;
                    }

                    participant.ConsumedItems.Clear();
                    foreach (var item in obj.Participants.First(x => x.Id == participant.Id).Items)
                    {
                        var dbItem = currentItems.First(x => x.Id == item.Id);
                        /*
                         * All items have been purchased by someone,
                         * so we don't need to update them again here.
                         * We just need to ensure that participant's
                         * currently consumed items match the ones on
                         * the current event.
                         */

                        participant.ConsumedItems.Add(dbItem);
                    }
                }

                //Clean up items
                foreach (var item in dbEvent.Items)
                {
                    if (!currentItems.Any(x => x.Id == item.Id))
                    {
                        ctx.Items.Remove(item);
                    }
                }

                await ctx.SaveChangesAsync();
            }

            return await GetAsync(obj.Id);
        }

    }
}