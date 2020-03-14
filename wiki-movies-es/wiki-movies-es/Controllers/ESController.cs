using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Nest;
using wiki_movies_es.Models;

namespace wiki_movies_es.Controllers
{
    [Route("api/[controller]")]
    public class ESController : ControllerBase
    {
        public IElasticClient Client { get; set; }
	public IWebHostEnvironment WebHostEnvironment { get; set; }

        public ESController(IElasticClient elasticClient, IWebHostEnvironment webHostEnvironment)
        {
            Client = elasticClient;
	    WebHostEnvironment = webHostEnvironment;
        }

        [HttpPost("Create")]
        public IActionResult CreateIndex()
        {
            var rootPath = WebHostEnvironment.ContentRootPath;
            var filePath = $"{Path.GetFullPath(Path.Combine(new []{rootPath, "Resources", "wikipedia-movie-plots", "wiki_movie_plots_deduped.csv" }))}";

            var movies = new List<Movie>();
            using var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read);
            using var reader = ExcelReaderFactory.CreateCsvReader(stream);
            var result = reader.AsDataSet();
            result.Tables[0].Rows.RemoveAt(0);
            var counter = 1;
            foreach (DataRow dataRow in result.Tables[0].Rows)
            {
                var movie = new Movie
                {
                    Id = $"{counter++}",
                    ReleaseYear = int.Parse(dataRow.ItemArray[0].ToString()),
                    Title = dataRow.ItemArray[1].ToString(),
                    Origin = dataRow.ItemArray[2].ToString(),
                    Director = dataRow.ItemArray[3].ToString(),
                    Cast = dataRow.ItemArray[4].ToString(),
                    Genre = dataRow.ItemArray[5].ToString(),
                    WikiPageLink = dataRow.ItemArray[6].ToString(),
                    Plot = dataRow.ItemArray[7].ToString()
                };
                movies.Add(movie);
	    }
            var bulkResponse = Client.Bulk(b => b.Index("movies").CreateMany(movies));
            return Ok(bulkResponse.DebugInformation);
        }

        [HttpGet("Search")]
        public IActionResult Search([FromQuery] string searchText = null, int fromYear = 0, int toYear = 3000, int from = 0, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                searchText = null;
            }
            var searchResponse = Client.Search<Movie>(s => s
                .Query(q => q
                    .Match(m => m
                        .Field(f => f.Title)
                        .Query(searchText)
                        .Boost(1.5)
                    ) || q
                    .Match(m => m
                        .Field(f => f.Plot)
                        .Query(searchText)
                    ) && q
                    .Range(d => d
                        .Field(f => f.ReleaseYear)
                        .GreaterThanOrEquals(fromYear)
                        .LessThanOrEquals(toYear))
                )
                .TrackTotalHits()
                .Highlight(h => h
                    .Fields(fs => fs
                            .Field(f => f.Title),
                            fs => fs
                            .Field(f => f.Plot)))
                .From(from)
                .Size(pageSize));
            var documents = searchResponse.Hits.Select(h => new {h.Source, h.Id}).ToList();
            return Ok(new {
                documents, searchResponse.HitsMetadata
            });
        }
        
        [HttpGet("Get")]
        public IActionResult Get([FromQuery] string documentId)
        {
            var searchResponse = Client.Get<Movie>(documentId);
            return Ok(searchResponse.Source);
        }
    }
}
