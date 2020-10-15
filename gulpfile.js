// Utilities
require("dotenv").config();

// Defaults
const env_debug = process.env.DEBUG || "false";
const env_port = process.env.DEV_PORT || "3000";
const env_output = process.env.SASS_OUTPUT || "compressed";
const env_merge_js = process.env.MERGE_JS || "false";
const env_compress_js = process.env.COMPRESS_JS || "true";
const env_prefixer = process.env.PREFIXER || "true";
const env_clean_css = process.env.CLEAN_CSS || "true";

// Options
const options = {
  debug: env_debug.toLocaleLowerCase() === "true",
  port: parseInt(env_port), //default port 3000
  output: env_output.toLocaleLowerCase(), //expanded, compact, compressed (nested)
  merge_js: env_merge_js.toLocaleLowerCase() === "true",
  compress_js: env_compress_js.toLocaleLowerCase() === "true",
  prefixer: env_prefixer.toLocaleLowerCase() === "true",
  clean_css: env_clean_css.toLocaleLowerCase() === "true",
};

// config
const config = {
  js: ["./src/js/**/*.js"],
  sass: "./src/styles/**/*.scss",
  assets: "./src/assets/*",
  views: [
    "./src/views/**/*.pug",
    "!./src/views/master.pug",
    "!./src/views/components/*.pug",
  ],
  app: {
    name: process.env.npm_package_name,
    version: `-v${process.env.npm_package_version}`,
  },
  dist: {
    base: "./dist/",
    assets: "./dist/assets",
    css: "./dist/css/",
    js: "./dist/js/",
  },
};

// Init gulp modules
const gulp = require("gulp");
const sass = require("gulp-sass");
const prefixer = require("gulp-autoprefixer");
const condition = require("gulp-if");
const map = require("gulp-sourcemaps");
const copy = require("gulp-contrib-copy");
const concat = require("gulp-concat");
const pug = require("gulp-pug");
const plumber = require("gulp-plumber");
// const cleanCSS = require("gulp-clean-css");
const del = require("del");
const replace = require("gulp-async-replace");
const rename = require("gulp-rename");
const terser = require('gulp-terser');

const server = require("browser-sync").create();

// Tasks
gulp.task("sass", () => {
  //sass
  return gulp
    .src(config.sass)
    .pipe(map.init())
    .pipe(sass({ outputStyle: options.output }))
    .pipe(condition(options.prefixer, prefixer()))
    .pipe(
      rename({
        basename: config.app.name,
        suffix: config.app.version,
      })
    )
    .pipe(map.write("."))
    .pipe(gulp.dest(config.dist.css));
});

gulp.task("javascript", () => {
  //js
  let processGulpSource = config.js;

  return gulp
    .src(processGulpSource)
    .pipe(map.init())
    .pipe(concat(`${config.app.name}${config.app.version}.js`, { newLine: ";" }))
    .pipe(terser({
      format: {
        comments: false,
      },
      compress:{
        drop_console: true,
        drop_debugger: true,
      }
    }))
    .pipe(map.write("."))
    .pipe(gulp.dest(config.dist.js));
});

gulp.task("html", () => {
  //render pug template
  return gulp
    .src(config.views)
    .pipe(plumber())
    .pipe(pug())
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.dist.base));
});

// Copies
gulp.task("copy:assets", (done) => {
  //files
  gulp.src(config.assets).pipe(copy()).pipe(gulp.dest(config.dist.assets));

  done();
});

// gulp.task("copy:fonts", (done) => {
//   //files
//   gulp.src("./src/fonts/*").pipe(copy()).pipe(gulp.dest("./dist/assets/fonts"));

//   done();
// });

// Watches
gulp.task("sass:watch", () => {
  //process+reload
  return gulp.watch(config.sass, gulp.series("sass", "reload"));
});

gulp.task("html:watch", () => {
  //process+reload
  return gulp.watch(config.views, gulp.series("html", "reload"));
});

gulp.task("javascript:watch", () => {
  //process+reload
  let processGulpSource = config.js;

  // if (!options.merge_js){
  //     processGulpSource.pop();
  // }

  return gulp.watch(processGulpSource, gulp.series("javascript", "reload"));
});

// Server operations
gulp.task("reload", (done) => {
  server.reload();
  done();
});

gulp.task("serve", (done) => {
  server.init({
    port: options.port,
    server: {
      baseDir: config.dist.base,
    },
    open: false,
  });
  done();
});

// Utilities
gulp.task("clean", (done) => {
  if (require("fs").existsSync(config.dest.base)) {
    del([config.dest.base]);
  }
  done();
});

// Bundle process
gulp.task(
  "copy",
  gulp.series("copy:assets") //, "copy:fonts", "copy:css", "copy:js")
);

gulp.task(
  "build",
  gulp.series("copy", gulp.parallel("sass", "html", "javascript"))
);

gulp.task(
  "dev",
  gulp.series(
    "copy",
    gulp.parallel("sass", "html", "javascript"),
    "serve",
    gulp.parallel("sass:watch", "html:watch", "javascript:watch")
  )
);
