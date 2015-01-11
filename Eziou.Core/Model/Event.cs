using System;
using System.Collections.Generic;

namespace Eziou.Core.Model
{
    public class Event
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public DateTime ExpirationDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }

        public IEnumerable<Participant> Participants { get; set; }
    }
}