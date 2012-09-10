/*global module:false*/
var fs = require('fs')
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    lint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  grunt.registerTask('render','render the questions', function (level) {
    function renderLevel(level) {
      console.log('Parsing: ', level)
      var src =  fs.readFileSync('./questions/' + level + '/src.js', 'utf8')
      src = src.replace(/<%=([\s\S]+?)%>/g, function(st, match, ind, left){
        match = match.trim()
        var file = '\nNOT FOUND\n'
        try {
            file = fs.readFileSync('./questions/easy/' + match, 'utf8')
        } catch (ex) {
          console.log('FILE DOESNT EXISTS')
        }
        return '<pre><code>' + file.split('\n').join('\\n') + '</code></pre>'
      })
      return fs.writeFileSync('./questions/' + level + '/index.js', src, 'utf8')
    }

    if (level) {
      renderLevel(level)
    } else {
      var dirs = fs.readdirSync('./questions')
      dirs.forEach(function(item){
        renderLevel(item)
      })
    }



  })
  // Default task.
  grunt.registerTask('default', 'render');

};
