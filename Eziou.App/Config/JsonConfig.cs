using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eziou.App.Config
{
    public class JsonConfig
    {
        public static JsonSerializerSettings GetSettings()
        {
            return Configure(new JsonSerializerSettings());
        }

        public static JsonSerializerSettings Configure(JsonSerializerSettings settings)
        {
            //Use camelCaseFormatting
            settings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();

            //Ignore null values
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

            //Make sure that polymorphic types can be properly deserialized
            settings.TypeNameHandling = TypeNameHandling.Auto;
            return settings;
        }
    }
}