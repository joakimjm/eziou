using Eziou.App.Config;
using Nancy;

namespace Eziou.App.Modules
{
    public class ScriptModule : NancyModule
    {
        public ScriptModule(IRootPathProvider root, ScriptBuilder scriptBuilder)
        {
            Get["/js/debug"] = _ =>
            {
                return Response.AsText(scriptBuilder.GetScripts(root.GetRootPath(), false), "application/javascript");
            };

            Get["/js/min"] = _ =>
            {
                //Maybe some server side caching could be great

                //In the future, when retrieving scripts becomes relative to the user role, the cache could map roles and relevant scripts together
                return Response.AsText(scriptBuilder.GetScripts(root.GetRootPath(), true), "application/javascript");
            };
        }
    }
}