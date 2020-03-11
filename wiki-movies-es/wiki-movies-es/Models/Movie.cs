namespace wiki_movies_es.Models
{
    public class Movie
    {
        public string Id { get; set; }
        public int ReleaseYear { get; set; }
        public string Title { get; set; }
        public string Origin { get; set; }
        public string Director { get; set; }
        public string Cast { get; set; }
        public string Genre { get; set; }
        public string WikiPageLink { get; set; }
        public string Plot { get; set; }
    }
}