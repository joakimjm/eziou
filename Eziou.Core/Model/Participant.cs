using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eziou.Core.Model
{
    public class Participant : BaseObject
    {
        public string Name { get; set; }

        public IEnumerable<Item> PurchasedItems { get; set; }
        public IEnumerable<Item> Items { get; set; }
    }
}
