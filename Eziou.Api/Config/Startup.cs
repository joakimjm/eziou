using Microsoft.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

[assembly: OwinStartup(typeof(Eziou.Api.Config.Startup))]
namespace Eziou.Api.Config
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            BoostrapWebApi.Configure(app);
        }
    }
}