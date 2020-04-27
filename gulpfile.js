var gulp = require("gulp");
var server = require("browser-sync").create();
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var webp = require("gulp-webp");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");

gulp.task("webp", function() {
  return gulp.src("source/img/*.{jpg,jpeg,png}")
  .pipe(webp({quality: 75}))
  .pipe(gulp.dest("build/img"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("images", function () {
  return gulp.src("source/img/**")
  .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.svgo()
    ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("style", function() {
  return gulp.src("source/css/style.css")
  .pipe(plumber())
  .pipe(postcss([
        autoprefixer()
    ]))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
  .pipe(server.stream());
});

gulp.task("js", function() {
  return gulp.src("source/js/**/*.js")
  .pipe(uglify())
  .pipe(rename({suffix: ".min"}))
  .pipe(gulp.dest("build/js"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });
  gulp.watch("source/css/**/*.css", gulp.parallel("style"));
  gulp.watch("source/*.html", gulp.parallel("html"))
    .on("change", server.reload);
  gulp.watch("source/js/**", gulp.parallel("js"))
    .on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "webp", "images", "style", "html", "js", "serve"));