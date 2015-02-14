/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
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
          style: "compressed"
        },
        files: {
          '<%= app.dist %>/css/<%= pkg.name %>.css': '<%= app.root %>/styles/main.scss'
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('dev', ['sass:dev', 'watch']);

};
