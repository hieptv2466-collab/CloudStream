import com.lagradost.cloudstream3.gradle.CloudstreamExtension

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
    val cloudstreamVersion = "master-SNAPSHOT"
    compileOnly("com.github.recloudstream:cloudstream:$cloudstreamVersion")
    implementation("com.github.lagradost:nice-http:0.4.5")
    implementation(kotlin("stdlib"))
}

cloudstream {
    setDisplayName("GSheet Movie Addon")
    setDescription("Addon xem phim từ Google Sheet")
    setAuthors(listOf("User"))
}
