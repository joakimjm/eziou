using System;
using System.Collections.Generic;

namespace Eziou.Core.Model
{
    public class Event : BaseObject
    {
        public string Name { get; set; }

        public DateTime ExpirationDate { get; set; }

        public IEnumerable<Participant> Participants { get; set; }
    }
}