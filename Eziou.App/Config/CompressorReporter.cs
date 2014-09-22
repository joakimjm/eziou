using System.Collections.Generic;

namespace Eziou.App.Config
{
    public class CompressorReporter : EcmaScript.NET.ErrorReporter
    {
        public CompressorReporter()
        {
            this.Messages = new List<string>();
        }

        public List<string> Messages { get; set; }

        public void Error(string message, string sourceName, int line, string lineSource, int lineOffset)
        {
            Messages.Add(string.Format("[{0} line {3}]: {1} in {4}", "Error", message, sourceName, line, lineSource, lineOffset));
        }

        public EcmaScript.NET.EcmaScriptRuntimeException RuntimeError(string message, string sourceName, int line, string lineSource, int lineOffset)
        {
            Messages.Add(string.Format("[{0} line {3}]: {1} in {4}", "RuntimeError", message, sourceName, line, lineSource, lineOffset));

            return new EcmaScript.NET.EcmaScriptRuntimeException(message, sourceName, lineOffset, lineSource, lineOffset);
        }

        public void Warning(string message, string sourceName, int line, string lineSource, int lineOffset)
        {
            Messages.Add(string.Format("[{0} line {3}]: {1} in {4}", "Warning", message, sourceName, line, lineSource, lineOffset));
        }
    }
}