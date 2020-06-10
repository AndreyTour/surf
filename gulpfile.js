let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('clean', async function(){  // удалить dist
  del.sync('dist')
})

gulp.task('scss', function(){
  return gulp.src('app/scss/**/*.scss')//папка откуда берут scss
    .pipe(sass({outputStyle: 'compressed'})) //compressed - сжатие css, expanded-красивый перенос
    .pipe(autoprefixer({
     overRideBrowsers: ['last 10 versions'],
    }))
    .pipe(rename({suffix: '.min'}))// переиминовует и ставит файлу .min
    .pipe(gulp.dest('app/css'))// папка куда компилиться css
    .pipe(browserSync.reload({stream: true})) // чтоб livereload сделил за css
});

gulp.task('css', function(){
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/animate.css/animate.css',
    // 'node_modules/magnific-popup/dist/magnific-popup.css'
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
  .pipe(browserSync.reload({stream: true})) // если есть препроцессоры для htm, то эта строчка не надо
});

gulp.task('script', function(){
  return gulp.src('app/js/*.js')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js'
    // "node_modules/magnific-popup/dist/jquery.magnific-popup.js",
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {// livereload
  browserSync.init({
      server: {
          baseDir: "app/"//директория для сервера
      }
  });
});

gulp.task('export', function(){// готовый проект на продакшн
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
    
  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));   
});

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));// следит за всеми файлами в scss || parallel следить и одновременно запускает task scss
  gulp.watch('app/*.html', gulp.parallel('html'))// сделит за html
  gulp.watch('app/js/*.js', gulp.parallel('script'))// сделит за js
});

gulp.task('build', gulp.series('clean', 'export'))

gulp.task('default', gulp.parallel('css' ,'scss', 'js', 'browser-sync', 'watch')); //запускает одно за другим