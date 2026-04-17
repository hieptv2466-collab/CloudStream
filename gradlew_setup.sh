#!/usr/bin/env sh

# Minimal gradlew script to trigger build in GitHub Actions
if [ ! -d "gradle/wrapper" ]; then
    mkdir -p gradle/wrapper
    echo "distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists" > gradle/wrapper/gradle-wrapper.properties
fi

# Download gradle if missing (simplified)
./gradlew "$@"
