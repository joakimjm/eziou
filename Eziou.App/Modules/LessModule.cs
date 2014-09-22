using Nancy;
using System.IO;

namespace Eziou.App.Modules
{
    public class LessModule : NancyModule
    {
        public LessModule(IRootPathProvider root)
        {
            var urlPrefix = System.Configuration.ConfigurationManager.AppSettings["app:UrlPrefix"] ?? string.Empty;

            Get[urlPrefix + "/less/desktop"] = _ =>
            {
                var manifest = System.Configuration.ConfigurationManager.AppSettings["app:LessManifest"];
                if (manifest.StartsWith("/"))
                {
                    manifest = manifest.Substring(1);
                }

                manifest = manifest.Replace("/", "\\");

                var lessFile = Path.Combine(root.GetRootPath(), manifest);

                if (!File.Exists(lessFile))
                {
                    throw new FileNotFoundException("Less manifest was not found");
                }

                var less = File.ReadAllText(lessFile);

                var config = dotless.Core.configuration.DotlessConfiguration.GetDefaultWeb();
                config.Logger = typeof(dotless.Core.Loggers.AspResponseLogger);
                config.CacheEnabled = false;
                config.MinifyOutput = true;
                var css = dotless.Core.LessWeb.Parse(less, config);

                return Response.AsText(css, "text/css");
            };
        }
    }
}