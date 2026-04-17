package com.example.moviesheet

import com.lagradost.cloudstream3.plugins.CloudstreamPlugin
import com.lagradost.cloudstream3.plugins.Plugin
import android.content.Context

@CloudstreamPlugin
class MovieSheetPlugin: Plugin() {
    override fun load(context: Context) {
        // Register your provider
        registerMainAPI(MovieSheetProvider())
    }
}
