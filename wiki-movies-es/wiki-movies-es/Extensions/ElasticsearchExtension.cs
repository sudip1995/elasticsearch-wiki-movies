using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nest;

namespace wiki_movies_es.Extensions
{
    public static class ElasticSearchExtension
    {
        public static void AddElasticSearch(this IServiceCollection services, IConfiguration configuration,
            IWebHostEnvironment environment)
        {
            var url = environment.IsProduction() ? Environment.GetEnvironmentVariable("BONSAI_URL") : configuration["ElasticSearch:Url"];

            var defaultIndex = configuration["ElasticSearch:DefaultIndex"];
            var esHost = Environment.GetEnvironmentVariable("ES_HOST");
            if (url == null) return;
            url = url.Replace("[ES_HOST]", esHost);
            var settings = new ConnectionSettings(new Uri(url))
                .DefaultIndex(defaultIndex);

            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);
        }
    }
}