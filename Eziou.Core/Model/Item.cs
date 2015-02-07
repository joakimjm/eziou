using System.Collections.Generic;

namespace Eziou.Core.Model
{
    public class Item : BaseObject
    {
        /*
         * EF 5 Code first https://www.youtube.com/watch?v=HbDOhCjjxSY
         */

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public Participant PurchasedBy { get; set; }

        public ICollection<Participant> Participants { get; set; }
    }
}