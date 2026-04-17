package com.example.moviesheet

import com.lagradost.cloudstream3.*
import com.lagradost.cloudstream3.MainAPI
import com.lagradost.cloudstream3.utils.AppUtils.parseJson

class MovieSheetProvider : MainAPI() {
    override var name = "GSheet Movie Addon"
    // QUAN TRỌNG: Link này sẽ tự động được ứng dụng React cung cấp qua API
    override var mainUrl = "https://your-deployed-app.run.app" 
    override var supportedTypes = setOf(TvType.Movie)

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

    override suspend fun load(url: String): LoadResponse {
        return newMovieLoadResponse("Movie", url, TvType.Movie, url)
    }

    data class MovieData(val name: String, val url: String, val poster: String, val episode: String)
}
