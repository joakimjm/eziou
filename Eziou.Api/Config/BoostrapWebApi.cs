using Owin;
using System.Net.Http.Formatting;
using System.Web.Http;
using Microsoft.Owin.Cors;
using System.Web.Http.Cors;

namespace Eziou.Api.Config
{
    public class BoostrapWebApi
    {
        public static void Configure(Owin.IAppBuilder app)
        {
            var config = new HttpConfiguration();

            app.UseWebApi(config);
            app.UseCors(CorsOptions.AllowAll);

            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));

            config.MapHttpAttributeRoutes();

            var settings = config.Formatters.JsonFormatter.SerializerSettings;
            //Use camelCaseFormatting
            settings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();

            //Ignore null values
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

            config.Formatters.XmlFormatter.MediaTypeMappings.Add(new UriPathExtensionMapping("xml", "text/xml"));
            config.Formatters.JsonFormatter.MediaTypeMappings.Add(new UriPathExtensionMapping("json", "application/json"));
        }
    }
}