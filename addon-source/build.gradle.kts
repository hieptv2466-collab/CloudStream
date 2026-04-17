import org.gradle.api.Project
import com.lagradost.cloudstream3.gradle.CloudstreamExtension

plugins {
    id("com.android.library")
    kotlin("android")
    id("com.lagradost.cloudstream3.gradle")
}

android {
    namespace = "com.example.moviesheet"
    compileSdk = 33

    defaultConfig {
        minSdk = 21
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    val cloudstreamVersion = "3.2.0" // Check for latest
    compileOnly("com.github.recloudstream:cloudstream:master-SNAPSHOT")
    implementation("com.github.lagradost:nice-http:0.4.5")
    implementation(kotlin("stdlib"))
}

cloudstream {
    // This is the metadata for the extension
    setDisplayName("GSheet Movie Addon")
    setDescription("Addon xem phim từ Google Sheet")
    setAuthors(listOf("User"))
}
