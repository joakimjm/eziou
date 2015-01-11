using System;
using System.Collections.Generic;
using System.Reflection;

namespace Eziou.Data
{
    public class Mapper
    {
        public T Map<T>(object fromObj, T toObj)
        {
            if (fromObj == null)
            {
                return default(T);
            }

            foreach (var prop in fromObj.GetType().GetProperties())
            {
                var myProp = toObj.GetType().GetProperty(prop.Name);

                if (myProp == null || myProp.SetMethod == null)
                {
                    continue;
                }

                if (prop.PropertyType.FullName == myProp.PropertyType.FullName)
                {
                    myProp.SetValue(toObj, prop.GetValue(fromObj, null), null);
                }
            }

            return toObj;
        }

        public T Map<T>(object fromObj)
        {
            T toObj = Activator.CreateInstance<T>();

            return Map(fromObj, toObj);
        }

        public List<To> Map<From, To>(IEnumerable<From> collection)
        {
            var result = new List<To>();

            foreach (var fromObj in collection)
            {
                result.Add(Map<To>(fromObj));
            }

            return result;
        }
    }
}