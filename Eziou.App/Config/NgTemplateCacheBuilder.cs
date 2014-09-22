using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using WebMarkupMin.Core.Minifiers;
using WebMarkupMin.Core.Settings;

namespace Eziou.App.Config
{
    public class NgTemplateCacheBuilder
    {
        private HtmlMinifier _minifier;

        public NgTemplateCacheBuilder()
        {
            this._minifier = new HtmlMinifier(new HtmlMinificationSettings()
            {
                AttributeQuotesRemovalMode = WebMarkupMin.Core.HtmlAttributeQuotesRemovalMode.KeepQuotes,
                RemoveRedundantAttributes = false
            });
        }

        public string BuildJavascript(string targetModule, IEnumerable<string> templates, string serverRoot, bool linebreaks)
        {
            var result = new StringBuilder();
            String templateContent;

            result.Append(AddLine("angular.module('" + targetModule + "').run([\"$templateCache\", function($templateCache) {", linebreaks));

            foreach (var file in templates)
            {
                templateContent = File.ReadAllText(file);
                result.Append(AddLine("$templateCache.put(\"" + MakeRelativeUrl(file, serverRoot) + "\",", linebreaks));
                result.Append(AddLine(EncodeJsString(this._minifier.Minify(templateContent).MinifiedContent), linebreaks));
                result.Append(AddLine(");", linebreaks));
            }

            result.Append(AddLine("}]);", linebreaks));
            return result.ToString();
        }

        private string AddLine(String line, bool linebreak)
        {
            return line + (linebreak ? Environment.NewLine : String.Empty);
        }

        private string EncodeJsString(String s)
        {
            var result = new StringBuilder();
            result.Append("\"");
            foreach (var c in s)
            {
                switch (c)
                {
                    case '\"':
                        result.Append("\\\"");
                        break;

                    case '\\':
                        result.Append("\\\\");
                        break;

                    case '\b':
                        result.Append("\\b");
                        break;

                    case '\f':
                        result.Append("\\f");
                        break;

                    case '\n':
                        result.Append("\\n");
                        break;

                    case '\r':
                        result.Append("\\r");
                        break;

                    case '\t':
                        result.Append("\\t");
                        break;

                    default:
                        int i = (int)c;
                        if (i < 32 || i > 127)
                        {
                            result.AppendFormat("\\u{0:X04}", i);
                        }
                        else
                        {
                            result.Append(c);
                        }
                        break;
                }
            }
            result.Append("\"");

            return result.ToString();
        }

        /// <summary>
        /// This relative URL will be the key in the $templateCache entry.
        /// </summary>
        /// <param name="file"></param>
        /// <param name="serverRootPath"></param>
        /// <returns></returns>
        private string MakeRelativeUrl(String file, String serverRootPath)
        {
            //Make the path lowercase, but preserve casing for the file (apparently, that's how angular makes keys)
            var dir = new FileInfo(file).DirectoryName;
            file = file.Replace(dir, dir.ToLower());

            return file.Substring(serverRootPath.Length).Replace("\\", "/");
            //return file.Substring(serverRootPath.Length - templateRoot.Length).Replace("\\", "/");
        }
    }
}