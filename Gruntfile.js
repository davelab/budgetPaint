/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html: ['dist/index.html']
    },

    copy : {
      app :{
        files: [
          { src: 'app/index.html', dest: 'dist/index.html' },
          {expand: true, cwd: 'app/', src: ['images/*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'app/', src: ['css/*'], dest: 'dist/', filter: 'isFile'},
        ]
      }
    },

    clean: {
      dist: ['dist/**']
    },

    sass: {
      dev : {
        options: {
          style: "expanded",
          compass: true
        },
        src: './app/sass/main.scss',
        dest: './app/css/style.css'
      },
      dist: {
        options: {
          compass: true
        },
        src: './app/sass/main.scss',
        dest: './app/css/style.css'
      }
    },

    connect: {
      server: {
        options: {
          protocol: 'http',
          port: 8081,
          base: 'app',
          keepalive: true
          }
        }
    },

    watch : {
      sass: {
        files: ['app/sass/**/*.scss'],
        tasks: ['sass:dev']
      }
    }

  });
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-usemin');

  //grunt.registerTask('build', ['clean:dist', 'sass:dist', 'copy:app', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin', 'connect:dist']);
  grunt.registerTask('dev', ['sass:dev', 'connect']);

};
