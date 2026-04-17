package com.example.moviesheet

import com.lagradost.cloudstream3.*
import com.lagradost.cloudstream3.utils.ExtractorLink
import com.lagradost.cloudstream3.utils.Qualities
import com.lagradost.cloudstream3.MainAPI
import com.lagradost.cloudstream3.MovieSearchResponse
import com.lagradost.cloudstream3.utils.AppUtils.parseJson

class MovieSheetProvider : MainAPI() {
    override var name = "GSheet Movie Explorer"
    override var mainUrl = "https://your-app-url.run.app" // User needs to replace this
    override var supportedTypes = setOf(TvType.Movie, TvType.TvSeries)

    override suspend fun getMainPage(page: Int, request: MainPageRequest): HomePageResponse {
        val json = app.get("$mainUrl/api/movies").text
        val movies = parseJson<List<MovieData>>(json)
        
        val homeData = movies.map { 
            newMovieSearchResponse(it.name, it.url) {
                this.posterUrl = it.poster
            }
        }
        
        return newHomePageResponse("Google Sheets Movies", homeData)
    }

    override suspend fun search(query: String): List<SearchResponse> {
        val json = app.get("$mainUrl/api/movies").text
        val movies = parseJson<List<MovieData>>(json)
        
        return movies.filter { it.name.contains(query, ignoreCase = true) }.map {
            newMovieSearchResponse(it.name, it.url) {
                this.posterUrl = it.poster
            }
        }
    }

    override suspend fun load(url: String): LoadResponse {
        // Here we handle the links from G-Sheets
        return newMovieLoadResponse("Movie", url, TvType.Movie, url)
    }

    override suspend fun loadLinks(
        data: String,
        isCasting: Boolean,
        subtitleCallback: (SubtitleFile) -> Unit,
        callback: (ExtractorLink) -> Unit
    ): Boolean {
        // If the URL is a direct stream, we add it here
        callback.invoke(
            ExtractorLink(
                this.name,
                "Direct Link",
                data,
                "",
                Qualities.P1080.value,
                false
            )
        )
        return true
    }

    data class MovieData(
        val name: String,
        val url: String,
        val poster: String,
        val episode: String
    )
}
