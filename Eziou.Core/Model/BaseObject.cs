using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eziou.Core.Model
{
    internal abstract class BaseObject
    {
        public long Id { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
