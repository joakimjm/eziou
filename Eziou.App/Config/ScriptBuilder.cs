using System;
using System.IO;
using System.Linq;
using System.Text;
using Yahoo.Yui.Compressor;

namespace Eziou.App.Config
{
    public class ScriptBuilder
    {
        private NgTemplateCacheBuilder cacheBuilder;
        private JavaScriptCompressor compressor;

        public ScriptBuilder(NgTemplateCacheBuilder cacheBuilder, JavaScriptCompressor compressor, CompressorReporter reporter)
        {
            this.cacheBuilder = cacheBuilder;

            compressor.ErrorReporter = reporter;
            this.compressor = compressor;
        }

        public String GetScripts(string root, bool minify)
        {
            var scripts = GetScripts(root);

            if (!minify)
            {
                return scripts;
            }

            try
            {
                return compressor.Compress(scripts);
            }
            catch (Exception ex)
            {
                var errors = (compressor.ErrorReporter as CompressorReporter).Messages;
                ex.Data.Add("Compressor Errors", string.Join(Environment.NewLine, errors));
                throw;
            }
        }

        private String GetScripts(string root)
        {
            var result = new StringBuilder();

            var ngFiles = Directory.EnumerateFiles(Path.Combine(root, "ng"), "*.*", SearchOption.AllDirectories).ToList();

            var libraryBundle = Path.Combine(root, "js/generated-libs.js");
            if (File.Exists(libraryBundle))
            {
                ngFiles.Insert(0, libraryBundle);
            }

            foreach (var script in ngFiles.Where(x => x.EndsWith(".js")))
            {
                result.AppendLine(File.ReadAllText(script));
            }

            var cacheBuilder = new NgTemplateCacheBuilder();

            var templates = cacheBuilder.BuildJavascript("App", ngFiles.Where(x => x.EndsWith("html")), root, true);

            result.AppendLine(templates);

            return result.ToString();
        }
    }
}