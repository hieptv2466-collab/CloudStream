import com.lagradost.cloudstream3.gradle.CloudstreamExtension
import com.android.build.gradle.LibraryExtension

buildscript {
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")
    }
    dependencies {
        classpath("com.github.recloudstream:gradle:master-SNAPSHOT")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.10")
        classpath("com.android.tools.build:gradle:8.1.1")
    }
}

apply(plugin = "com.android.library")
apply(plugin = "kotlin-android")
apply(plugin = "com.lagradost.cloudstream3.gradle")

configure<LibraryExtension> {
    namespace = "com.example.moviesheet"
    compileSdk = 33

    defaultConfig {
        minSdk = 21
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

dependencies {
    add("compileOnly", "com.github.recloudstream:cloudstream:master-SNAPSHOT")
    add("implementation", "com.github.lagradost:nice-http:0.4.5")
    add("implementation", kotlin("stdlib"))
}

configure<CloudstreamExtension> {
    setDisplayName("GSheet Movie Addon")
    setDescription("Addon xem phim từ Google Sheet")
    setAuthors(listOf("User"))
}
