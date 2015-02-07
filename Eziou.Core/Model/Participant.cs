using System.Collections.Generic;

namespace Eziou.Core.Model
{
    public class Participant : BaseObject
    {
        public string Name { get; set; }

        public IEnumerable<Item> PurchasedItems { get; set; }

        public IEnumerable<Item> Items { get; set; }
    }
}