using System;

namespace Eziou.Core.Model
{
    public abstract class BaseObject
    {
        public Guid Id { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }
    }
}