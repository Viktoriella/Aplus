var gulp = require("gulp");
var server = require("browser-sync").create();
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

gulp.task("copy", function () {
  return gulp.src([
    "source/img/**",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  return gulp.src("source/css/style.css")
  .pipe(plumber())
  .pipe(postcss([
        autoprefixer()
    ]))
  .pipe(gulp.dest("build/css"))
  .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });
  gulp.watch("source/css/**/*.css", gulp.parallel("style"));
  gulp.watch("source/*.html", gulp.parallel("html"))
    .on("change", server.reload);
});

gulp.task("build", gulp.series("copy", "serve"));