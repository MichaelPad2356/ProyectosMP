plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.joinifyapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.joinifyapp"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

dependencies {

    implementation ("com.squareup.retrofit2:retrofit:2.9.0'")      // Retrofit
    implementation ("com.squareup.retrofit2:converter-gson:2.9.0") // Conversor JSON (Gson)
    implementation ("com.squareup.okhttp3:logging-interceptor:4.10.0") // Logger para depuración
    implementation ("com.stripe:stripe-android:20.34.0") // Use the latest version
    implementation ("com.github.bumptech.glide:glide:4.13.2")



    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}