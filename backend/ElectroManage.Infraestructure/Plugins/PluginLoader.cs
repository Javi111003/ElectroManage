using ElectroManage.Infraestructure.Services;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Reflection;

namespace ElectroManage.Infraestructure.Plugins;
public class PluginLoader : IDisposable
{
    private readonly ILogger<PluginLoader> _logger;
    private readonly string _exportersDllPath;
    private readonly FileSystemWatcher _watcher;
    private ConcurrentDictionary<string, IExporter> _pluginExporters { get; set; } = new();
    private ConcurrentDictionary<string, IExporter> _internalExporters { get; set; } = new();
    public PluginLoader(ILogger<PluginLoader> logger)
    {
        _logger = logger;
        _exportersDllPath = Path.Combine(AppContext.BaseDirectory, "Plugins");
        Directory.CreateDirectory(_exportersDllPath);
        _internalExporters = new();
        _pluginExporters = new();

        _watcher = new FileSystemWatcher(_exportersDllPath, "*.dll")
        {
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName,
            EnableRaisingEvents = true
        };

        _watcher.Created += OnPluginChanged;
        _watcher.Deleted += OnPluginChanged;
        _watcher.Renamed += OnPluginChanged;
        LoadPlugins();
        LoadInternalPlugins();
        _logger.LogInformation($"PluginLoader initialized with {_pluginExporters.Count + _internalExporters.Count} exporters");
    }
    private void OnPluginChanged(object sender, FileSystemEventArgs e)
    {
        Thread.Sleep(500);
        LoadPlugins();
    }
    public void LoadPlugins()
    {
        _pluginExporters.Clear();
        foreach (var dllPath in Directory.GetFiles(_exportersDllPath, "*.dll"))
        {
            try
            {
                    var assembly = Assembly.LoadFrom(dllPath);
                    foreach (var type in assembly.GetExportedTypes())
                    {
                        if (typeof(IExporter).IsAssignableFrom(type) && !type.IsAbstract)
                        {
                            var exporter = (IExporter)Activator.CreateInstance(type)!;
                            _pluginExporters.TryAdd(exporter.Format.ToLower(), exporter);
                        }
                    }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error cargando {dllPath}: {ex.Message}");
            }
        }
    }
    public void LoadInternalPlugins()
    {
        _internalExporters.Clear();

        var infrastructureAssembly = typeof(IExporter).Assembly;

        foreach (var type in infrastructureAssembly.GetTypes())
        {
            try
            {
                if (typeof(IExporter).IsAssignableFrom(type) &&
                    !type.IsAbstract &&
                    type.Namespace?.Contains("Exporters") == true) // Filtra por namespace
                {
                    var exporter = (IExporter)Activator.CreateInstance(type)!;
                    _internalExporters.TryAdd(exporter.Format.ToLower(), exporter);
                    _logger.LogInformation($"Exportador interno cargado: {type.Name}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error cargando exportador interno {type.Name}: {ex.Message}");
            }
        }
    }
    /// <summary>
    /// Tries to get an exporter for the specified format.
    /// </summary>
    /// <param name="format">The format of the exporter.</param>
    /// <param name="exporter">The exporter instance if found.</param>
    /// <returns>True if an exporter is found; otherwise, false.</returns>
    public bool TryGetExporter(string format, out IExporter? exporter) => _pluginExporters.TryGetValue(format, out exporter) || _internalExporters.TryGetValue(format, out exporter);//Mayor prioridad a los plugins
    /// <summary>
    /// Gets the available formats from both internal and plugin exporters.
    /// </summary>
    /// <returns>An array of available formats.</returns>
    public string[] GetAvaibleFormats() => _internalExporters.Select(x => x.Key.ToLower()).Concat(_pluginExporters.Select(x => x.Key.ToLower())).Distinct().ToArray();
    public void Dispose() => _watcher.Dispose();
}