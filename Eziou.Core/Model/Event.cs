using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eziou.Core.Model
{
    public class Event : BaseObject
    {
        public string Name { get; set; }
        public Guid Guid { get; set; }
        public DateTime ExpirationDate { get; set; }

        public ICollection<Item> Items { get; set; }
        public ICollection<Participant> Participants { get; set; }
    }
}
