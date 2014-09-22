using Nancy;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace Eziou.App.Modules
{
    public class IndexModule : NancyModule
    {
        public IndexModule()
        {
            Get["/"] = _ =>
            {
                dynamic result = new ExpandoObject();
                result.config = JsonConvert.SerializeObject(new {  Build = Assembly.GetExecutingAssembly().GetName().Version }, Config.JsonConfig.GetSettings());
                return View["index", result];
            };
        }
    }
}